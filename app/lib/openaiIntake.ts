import type { IntakeField, IntakeData, IntakePatch } from "./intakeProgress";

type SafeTranscriptMessage = {
  role: "user" | "assistant";
  content: string;
};

export type IntakeModelTurn = {
  reply: string;
  answered_fields: IntakeField[];
  intake: IntakePatch;
};

const nullableString = {
  anyOf: [{ type: "string" }, { type: "null" }],
} as const;

const nullableStringArray = {
  anyOf: [
    { type: "array", items: { type: "string" } },
    { type: "null" },
  ],
} as const;

const fieldEnum: IntakeField[] = [
  "name",
  "business_name",
  "email",
  "phone",
  "business_description",
  "current_website",
  "website_goals",
  "success_definition",
  "friction_points",
  "pages_needed",
  "integrations",
  "color_preferences",
  "inspiration_notes",
  "desired_domain",
  "current_domain",
  "hosting_provider",
  "budget_range",
  "desired_timeline",
  "additional_notes",
];

const intakeSchema = {
  type: "object",
  properties: {
    reply: { type: "string" },
    answered_fields: {
      type: "array",
      items: { type: "string", enum: fieldEnum },
    },
    intake: {
      type: "object",
      properties: {
        name: nullableString,
        business_name: nullableString,
        email: nullableString,
        phone: nullableString,
        business_description: nullableString,
        current_website: nullableString,
        website_goals: nullableString,
        success_definition: nullableString,
        friction_points: nullableStringArray,
        pages_needed: nullableStringArray,
        integrations: nullableStringArray,
        color_preferences: nullableStringArray,
        inspiration_notes: nullableString,
        desired_domain: nullableString,
        current_domain: nullableString,
        hosting_provider: nullableString,
        budget_range: nullableString,
        desired_timeline: nullableString,
        additional_notes: nullableString,
      },
      required: fieldEnum,
      additionalProperties: false,
    },
  },
  required: ["reply", "answered_fields", "intake"],
  additionalProperties: false,
} as const;

const INSTRUCTIONS = `You are Kyle Stringham's website project intake assistant.

Your job is to have a short, natural discovery conversation that gives Kyle enough information to contact the person and understand what they want built. You are not qualifying or rejecting leads. Every reasonable lead should be brought to Kyle.

VOICE
- Professional, friendly, casual, concise.
- Sound like a capable human project coordinator, not a questionnaire.
- Ask one focused question at a time. You may bundle two tightly related details when that is more natural.
- Briefly acknowledge useful context before asking the next question.
- Do not repeat questions that have already been answered.
- If the visitor does not know an answer, accept that answer and move on.
- Never invent answers or infer specific facts that the visitor did not provide.

CONTACT EARLY
- Kyle wants incomplete intakes to remain useful.
- Collect the visitor's name and email within the first two substantive exchanges if they are not already known.
- Ask for a phone number too, but do not pressure the visitor if they prefer not to provide one.

DISCOVERY TARGETS
Collect, when relevant:
1. name, business name, email, phone
2. what the business does and who it serves
3. whether a website already exists
4. the goals of the new website
5. what a successful website looks like to them
6. friction points they want the website to reduce
7. pages or major content areas they expect
8. integrations or functionality they want
9. preferred color schemes or existing brand direction
10. whether they have a logo, photos, or inspiration images/sites, summarized in inspiration_notes/additional_notes for now
11. desired domain, current domain if one exists, and hosting/provider name if known
12. budget range
13. desired launch timing
14. anything else Kyle should know

CREDENTIAL SAFETY
- Never ask for or accept passwords, verification codes, API keys, access tokens, recovery codes, or other credentials.
- Only ask for the domain name and provider/host name.
- If credentials are mentioned, tell the visitor not to send them and say account access can be shared securely after kickoff through a password manager.
- The server already redacts obvious credentials before you receive a message. Treat [REDACTED] as a signal to reinforce this rule and move on.

SCOPE
- Do not promise a price, delivery date, SEO result, specific integration feasibility, or that Kyle will take the project.
- Do not ask for sensitive personal information.
- Do not ask them to upload credentials.
- You may explain that Kyle will personally follow up after the intake.

STRUCTURED EXTRACTION
- intake contains only values newly learned or corrected in the visitor's latest answer. Use null for fields that did not change.
- If the visitor explicitly says they have none, do not want any, do not know, or prefer not to provide something, include that field in answered_fields even if the structured value is an empty array or no useful scalar can be extracted.
- answered_fields must include every field the visitor actually answered or explicitly declined in the latest turn. Do not include fields merely discussed by you.
- For a list explicitly answered as none, return an empty array.
- Keep the visitor-facing reply generally under 80 words.`;

type RawOpenAIResponse = {
  output_text?: string;
  output?: Array<{
    type?: string;
    content?: Array<{
      type?: string;
      text?: string;
    }>;
  }>;
  error?: { message?: string } | null;
};

function getApiKey() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not configured.");
  return apiKey;
}

function extractOutputText(response: RawOpenAIResponse) {
  if (response.output_text?.trim()) return response.output_text.trim();

  for (const item of response.output ?? []) {
    for (const content of item.content ?? []) {
      if (content.type === "output_text" && content.text?.trim()) {
        return content.text.trim();
      }
    }
  }

  throw new Error("OpenAI response did not contain output text.");
}

export async function runIntakeInterview(args: {
  intakeId: string;
  intake: IntakeData;
  answeredFields: string[];
  transcript: SafeTranscriptMessage[];
}): Promise<IntakeModelTurn> {
  const apiKey = getApiKey();
  const model = process.env.OPENAI_INTAKE_MODEL || "gpt-5.6-luna";

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      store: false,
      instructions: INSTRUCTIONS,
      input: JSON.stringify({
        current_intake: args.intake,
        already_answered_fields: args.answeredFields,
        safe_transcript: args.transcript.slice(-18),
        instruction:
          "Continue the discovery conversation from the safe transcript. Extract only information actually supplied by the visitor, then ask the single best next question. Prioritize missing required discovery targets and do not re-ask answered fields.",
      }),
      reasoning: { effort: "low" },
      max_output_tokens: 1200,
      prompt_cache_key: "kyle-website-intake-v1",
      safety_identifier: `intake_${args.intakeId}`,
      text: {
        verbosity: "low",
        format: {
          type: "json_schema",
          name: "website_intake_turn",
          strict: true,
          schema: intakeSchema,
        },
      },
    }),
  });

  const rawText = await response.text();
  let payload: RawOpenAIResponse;

  try {
    payload = rawText ? (JSON.parse(rawText) as RawOpenAIResponse) : {};
  } catch {
    throw new Error(`OpenAI returned a non-JSON response (${response.status}).`);
  }

  if (!response.ok) {
    const detail = payload.error?.message || `status ${response.status}`;
    throw new Error(`OpenAI intake request failed: ${detail}`);
  }

  const outputText = extractOutputText(payload);

  try {
    return JSON.parse(outputText) as IntakeModelTurn;
  } catch {
    throw new Error("OpenAI intake response was not valid structured JSON.");
  }
}
