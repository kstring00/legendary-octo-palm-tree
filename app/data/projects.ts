export type ProjectStatus = "LIVE" | "IN PILOT" | "LAUNCHING SOON" | "CASE STUDY";

export type ProjectImage = {
  src: string | null;
  alt: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  status: ProjectStatus;
  tech: string[];
  heroImage: ProjectImage;
  screenshots: ProjectImage[];
  liveUrl: string | null;
  problem: string[];
  features: string[];
  year: string;
  clientType: string;
};

/**
 * PLACEHOLDER CONTENT ONLY.
 * Replace every bracketed value below before publishing real case studies.
 * The four different statuses are intentionally represented so each badge state
 * can be reviewed visually. No live URLs are supplied until a real URL is known.
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
    heroImage: {
      src: null,
      alt: "Placeholder for the Project 01 hero screenshot",
    },
    screenshots: [
      {
        src: null,
        alt: "Placeholder for Project 01 screenshot one",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
      },
      {
        src: null,
        alt: "Placeholder for Project 01 screenshot two",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
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
    heroImage: {
      src: null,
      alt: "Placeholder for the Project 02 hero screenshot",
    },
    screenshots: [
      {
        src: null,
        alt: "Placeholder for Project 02 screenshot one",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
      },
      {
        src: null,
        alt: "Placeholder for Project 02 screenshot two",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
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
    slug: "project-03",
    title: "[PLACEHOLDER] Project 03",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description:
      "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
    status: "LAUNCHING SOON",
    tech: ["[TECH]", "[TECH]", "[TECH]"],
    heroImage: {
      src: null,
      alt: "Placeholder for the Project 03 hero screenshot",
    },
    screenshots: [
      {
        src: null,
        alt: "Placeholder for Project 03 screenshot one",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
      },
      {
        src: null,
        alt: "Placeholder for Project 03 screenshot two",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
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
    slug: "project-04",
    title: "[PLACEHOLDER] Project 04",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description:
      "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
    status: "CASE STUDY",
    tech: ["[TECH]", "[TECH]", "[TECH]"],
    heroImage: {
      src: null,
      alt: "Placeholder for the Project 04 hero screenshot",
    },
    screenshots: [
      {
        src: null,
        alt: "Placeholder for Project 04 screenshot one",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
      },
      {
        src: null,
        alt: "Placeholder for Project 04 screenshot two",
        caption: "[PLACEHOLDER] Replace with screenshot caption.",
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
