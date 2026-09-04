export const INTAKE_FIELDS = [
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
] as const;

export type IntakeField = (typeof INTAKE_FIELDS)[number];

export type IntakeData = {
  name: string | null;
  business_name: string | null;
  email: string | null;
  phone: string | null;
  business_description: string | null;
  current_website: string | null;
  website_goals: string | null;
  success_definition: string | null;
  friction_points: string[];
  pages_needed: string[];
  integrations: string[];
  color_preferences: string[];
  inspiration_notes: string | null;
  desired_domain: string | null;
  current_domain: string | null;
  hosting_provider: string | null;
  budget_range: string | null;
  desired_timeline: string | null;
  additional_notes: string | null;
};

export type IntakePatch = {
  [K in IntakeField]: IntakeData[K] | null;
};

const stringFields = new Set<IntakeField>([
  "name",
  "business_name",
  "email",
  "phone",
  "business_description",
  "current_website",
  "website_goals",
  "success_definition",
  "inspiration_notes",
  "desired_domain",
  "current_domain",
  "hosting_provider",
  "budget_range",
  "desired_timeline",
  "additional_notes",
]);

const arrayFields = new Set<IntakeField>([
  "friction_points",
  "pages_needed",
  "integrations",
  "color_preferences",
]);

function cleanString(value: unknown) {
  if (typeof value !== "string") return null;
  const clean = value.trim().replace(/\s+/g, " ").slice(0, 3000);
  return clean || null;
}

function cleanArray(value: unknown) {
  if (!Array.isArray(value)) return null;
  return [...new Set(
    value
      .filter((item): item is string => typeof item === "string")
      .map((item) => item.trim().replace(/\s+/g, " ").slice(0, 500))
      .filter(Boolean),
  )].slice(0, 30);
}

export function sanitizeIntakePatch(patch: IntakePatch) {
  const updates: Partial<IntakeData> = {};

  for (const field of INTAKE_FIELDS) {
    const value = patch[field];
    if (value === null || value === undefined) continue;

    if (stringFields.has(field)) {
      const clean = cleanString(value);
      if (clean !== null) (updates as Record<string, unknown>)[field] = clean;
      continue;
    }

    if (arrayFields.has(field)) {
      const clean = cleanArray(value);
      if (clean !== null) (updates as Record<string, unknown>)[field] = clean;
    }
  }

  return updates;
}

export function mergeAnsweredFields(existing: string[], incoming: string[]) {
  const allowed = new Set<string>(INTAKE_FIELDS);
  return [...new Set([...existing, ...incoming].filter((field) => allowed.has(field)))];
}

export function getAnsweredFields(structuredBrief: unknown): string[] {
  if (!structuredBrief || typeof structuredBrief !== "object") return [];
  const meta = (structuredBrief as Record<string, unknown>)._meta;
  if (!meta || typeof meta !== "object") return [];
  const answered = (meta as Record<string, unknown>).answered_fields;
  if (!Array.isArray(answered)) return [];
  return answered.filter((field): field is string => typeof field === "string");
}

export function getProgress(answeredFields: string[]) {
  const answered = new Set(answeredFields);

  const checks = [
    { stage: "business", done: answered.has("name") },
    { stage: "business", done: answered.has("email") },
    { stage: "business", done: answered.has("business_name") },
    { stage: "business", done: answered.has("business_description") },
    { stage: "goals", done: answered.has("website_goals") },
    { stage: "goals", done: answered.has("success_definition") },
    { stage: "goals", done: answered.has("friction_points") },
    { stage: "pages", done: answered.has("pages_needed") },
    { stage: "pages", done: answered.has("integrations") },
    { stage: "assets", done: answered.has("color_preferences") },
    { stage: "assets", done: answered.has("inspiration_notes") },
    {
      stage: "assets",
      done:
        answered.has("desired_domain") ||
        answered.has("current_domain") ||
        answered.has("hosting_provider"),
    },
    { stage: "launch", done: answered.has("budget_range") },
    { stage: "launch", done: answered.has("desired_timeline") },
  ] as const;

  const completed = checks.filter((check) => check.done).length;
  const completionPercent = Math.round((completed / checks.length) * 100);

  const stages = ["business", "goals", "pages", "assets", "launch"] as const;
  let currentStep: (typeof stages)[number] | "complete" = "complete";

  for (const stage of stages) {
    const stageChecks = checks.filter((check) => check.stage === stage);
    if (stageChecks.some((check) => !check.done)) {
      currentStep = stage;
      break;
    }
  }

  return {
    completionPercent: currentStep === "complete" ? 100 : completionPercent,
    currentStep,
    complete: currentStep === "complete",
  };
}

export function mergeStructuredBrief(args: {
  existing: unknown;
  answeredFields: string[];
  completionPercent: number;
  currentStep: string;
}) {
  const existing =
    args.existing && typeof args.existing === "object"
      ? (args.existing as Record<string, unknown>)
      : {};

  const oldMeta =
    existing._meta && typeof existing._meta === "object"
      ? (existing._meta as Record<string, unknown>)
      : {};

  return {
    ...existing,
    _meta: {
      ...oldMeta,
      answered_fields: args.answeredFields,
      completion_percent: args.completionPercent,
      current_step: args.currentStep,
    },
  };
}
