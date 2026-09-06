export type ProjectStatus = "LIVE" | "IN PILOT" | "LAUNCHING SOON" | "CASE STUDY";

export type ProjectScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  heroImage: string;
  heroImageAlt: string;
  screenshots: ProjectScreenshot[];
  liveUrl: string | null;
  problem: string[];
  features: string[];
  year: string;
  clientType: string;
};

/**
 * PLACEHOLDER CONTENT ONLY.
 * Replace bracketed copy as case-study content is finalized.
 * Image fields can be populated independently; cards render a cream/gold
 * placeholder whenever heroImage is an empty string.
 */
export const projects: Project[] = [
  {
    slug: "project-01",
    title: "[PLACEHOLDER] Project 01",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description:
      "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
    status: "LIVE",
    tech: ["[TECH]", "[TECH]", "[TECH]"],
    heroImage: "/work/bcba-prep/library.png",
    heroImageAlt:
      "BCBA Prep domain library page showing a stacked collection of study domains",
    screenshots: [
      {
        src: "/work/bcba-prep/library.png",
        alt: "BCBA Prep domain library with nine exam domains presented as stacked books",
        caption: "Domain library overview.",
      },
      {
        src: "/work/bcba-prep/contact.png",
        alt: "BCBA Prep contact page with a two-column support form and project navigation",
        caption: "Contact and support experience.",
      },
    ],
    liveUrl: null,
    problem: [
      "[PLACEHOLDER] Replace with a short paragraph describing the client or business problem.",
      "[PLACEHOLDER] Replace with a short paragraph describing the constraint, friction, or opportunity the build needed to address.",
    ],
    features: [
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
    ],
    year: "[YEAR]",
    clientType: "[PLACEHOLDER] Replace with client type",
  },
  {
    slug: "project-02",
    title: "[PLACEHOLDER] Project 02",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description:
      "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
    status: "IN PILOT",
    tech: ["[TECH]", "[TECH]", "[TECH]"],
    heroImage: "",
    heroImageAlt: "Project 02 website preview not available yet",
    screenshots: [],
    liveUrl: null,
    problem: [
      "[PLACEHOLDER] Replace with a short paragraph describing the client or business problem.",
      "[PLACEHOLDER] Replace with a short paragraph describing the constraint, friction, or opportunity the build needed to address.",
    ],
    features: [
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
    ],
    year: "[YEAR]",
    clientType: "[PLACEHOLDER] Replace with client type",
  },
  {
    slug: "project-03",
    title: "[PLACEHOLDER] Project 03",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description:
      "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
    status: "LAUNCHING SOON",
    tech: ["[TECH]", "[TECH]", "[TECH]"],
    heroImage: "",
    heroImageAlt: "Project 03 website preview not available yet",
    screenshots: [],
    liveUrl: null,
    problem: [
      "[PLACEHOLDER] Replace with a short paragraph describing the client or business problem.",
      "[PLACEHOLDER] Replace with a short paragraph describing the constraint, friction, or opportunity the build needed to address.",
    ],
    features: [
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
    ],
    year: "[YEAR]",
    clientType: "[PLACEHOLDER] Replace with client type",
  },
  {
    slug: "project-04",
    title: "[PLACEHOLDER] Project 04",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description:
      "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
    status: "CASE STUDY",
    tech: ["[TECH]", "[TECH]", "[TECH]"],
    heroImage: "",
    heroImageAlt: "Project 04 website preview not available yet",
    screenshots: [],
    liveUrl: null,
    problem: [
      "[PLACEHOLDER] Replace with a short paragraph describing the client or business problem.",
      "[PLACEHOLDER] Replace with a short paragraph describing the constraint, friction, or opportunity the build needed to address.",
    ],
    features: [
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
      "[PLACEHOLDER] Replace with feature or capability.",
    ],
    year: "[YEAR]",
    clientType: "[PLACEHOLDER] Replace with client type",
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function canVisitProject(project: Project) {
  return (
    (project.status === "LIVE" || project.status === "IN PILOT") &&
    Boolean(project.liveUrl)
  );
}
