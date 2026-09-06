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
  approach: string;
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
    liveUrl: "https://texasabacenterscg.com/",
    problem: [
      "Families looking for autism support can end up piecing together providers, parent resources, and next steps across too many places.",
      "The site needed to reduce that search burden and make the next useful action obvious without making the experience feel clinical or overwhelming.",
    ],
    features: [
      "Clear support pathways",
      "Family-focused resource navigation",
      "Responsive, accessible interface",
    ],
    approach: "I organized the experience around the decisions a family is actually trying to make, not around internal service categories. The interface keeps guidance direct, local, and easy to scan so visitors can move forward without decoding the site first.",
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
      "A large exam-prep catalog can quickly feel like a folder of disconnected PDFs instead of one coherent product.",
      "The build needed to make nine domains understandable before purchase and just as clear once a member signs in to study.",
    ],
    features: [
      "Domain-based study library",
      "Member dashboard",
      "Purchase and access pathways",
    ],
    approach: "I treated the nine domains as one visual library system with a consistent hierarchy from storefront to member access. The goal was to make the volume of material feel organized and premium without adding friction to finding the next thing to study.",
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
    heroImage: "/work/lake-city-self-storage/home.webp",
    heroImageAlt: "Lake City Self Storage homepage showing unit selection messaging and an aerial view of the storage facility",
    screenshots: [
      {
        src: "/work/lake-city-self-storage/home.webp",
        alt: "Lake City Self Storage homepage showing unit selection messaging and an aerial view of the storage facility",
        caption: "Lake City Self Storage homepage and storage-type selection experience.",
      },
    ],
    liveUrl: null,
    problem: [
      "Storage customers often arrive knowing what they need to store, but not which unit type or size matches it.",
      "The site needed to turn that uncertainty into a simple decision path while keeping pricing, access, and facility information easy to reach.",
    ],
    features: [
      "Storage-focused information architecture",
      "Responsive customer journey",
      "Clear conversion pathways",
    ],
    approach: "I led with the storage-type decision and paired straightforward guidance with strong facility imagery so the site answers the practical question first. From there, the experience narrows toward size, availability, and the action the customer is ready to take.",
    year: "2025",
    clientType: "Self storage",
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
