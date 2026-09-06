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

export const projects: Project[] = [
  {
    slug: "common-ground",
    title: "Common Ground",
    summary: "A family-facing autism support hub designed to make next steps clearer and easier to find.",
    description: "A support and resource experience for Texas ABA families, built around practical guidance and clear pathways.",
    status: "IN PILOT",
    tech: ["Next.js", "TypeScript", "Responsive UI"],
    heroImage: "/hero-crt/common-ground.png",
    heroImageAlt: "Common Ground homepage showing autism support resources for Texas families",
    screenshots: [
      {
        src: "/hero-crt/common-ground.png",
        alt: "Common Ground homepage showing autism support resources for Texas families",
        caption: "Common Ground homepage and primary support pathways.",
      },
    ],
    liveUrl: null,
    problem: [
      "Case-study copy is being finalized.",
      "The project centers on making support resources and next steps easier for families to navigate.",
    ],
    features: [
      "Clear support pathways",
      "Family-focused resource navigation",
      "Responsive, accessible interface",
    ],
    year: "2026",
    clientType: "ABA / autism support",
  },
  {
    slug: "bcba-prep",
    title: "BCBA Prep",
    summary: "A study-library and member experience for BCBA exam preparation materials.",
    description: "An exam-prep storefront and member library organized around the BCBA task-list domains.",
    status: "LAUNCHING SOON",
    tech: ["Next.js", "TypeScript", "Member experience"],
    heroImage: "/hero-crt/bcba-prep.png",
    heroImageAlt: "BCBA Prep domain library showing a stacked collection of exam study domains",
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
      {
        src: "/work/bcba-prep/dashboard.webp",
        alt: "BCBA Prep member dashboard showing purchased domains, quick actions, and study journey guidance",
        caption: "Member dashboard and study-library access.",
      },
    ],
    liveUrl: null,
    problem: [
      "Case-study copy is being finalized.",
      "The build organizes a large study-product catalog into a coherent purchase and member-library experience.",
    ],
    features: [
      "Domain-based study library",
      "Member dashboard",
      "Purchase and access pathways",
    ],
    year: "2026",
    clientType: "Exam prep · licensing",
  },
  {
    slug: "lake-city-self-storage",
    title: "Lake City Self Storage",
    summary: "A self-storage website focused on helping visitors understand options and move toward the right unit.",
    description: "A storage-facility web experience structured around clear unit discovery and customer decision-making.",
    status: "CASE STUDY",
    tech: ["Web design", "Responsive UI", "Conversion UX"],
    heroImage: "",
    heroImageAlt: "Lake City Self Storage website preview not available yet",
    screenshots: [],
    liveUrl: null,
    problem: [
      "Case-study copy is being finalized.",
      "The experience is designed to make storage options easier to understand and compare.",
    ],
    features: [
      "Storage-focused information architecture",
      "Responsive customer journey",
      "Clear conversion pathways",
    ],
    year: "2025",
    clientType: "Self storage",
  },
  {
    slug: "project-04",
    title: "[PLACEHOLDER] Project 04",
    summary: "[PLACEHOLDER] Replace with a one-line summary of the project outcome.",
    description: "[PLACEHOLDER] Replace with a concise two-line description of what was designed and built for this client.",
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
