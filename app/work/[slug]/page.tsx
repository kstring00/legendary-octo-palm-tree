import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Header from "../../Header";
import SiteMotion from "../../SiteMotion";
import {
  canVisitProject,
  getProjectBySlug,
  projects,
} from "../../data/projects";
import { ProjectMedia, StatusBadge } from "../ProjectUI";
import styles from "../work.module.css";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: `${project.title} | Kyle Stringham`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const projectIndex = projects.findIndex((item) => item.slug === project.slug);
  const previousProject = projects[(projectIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(projectIndex + 1) % projects.length];
  const showVisitSite = canVisitProject(project) && project.liveUrl;

  return (
    <>
      <Header />
      <main className={styles.page}>
        <section className={styles.detailHero} id="top">
          <div className={styles.detailInner}>
            <div className={styles.detailHeroTop}>
              <Link className={styles.backLink} href="/work">
                ← All work
              </Link>
              <StatusBadge status={project.status} />
            </div>

            <div className={styles.detailTitleRow}>
              <h1>{project.title}</h1>
              <p className={styles.detailSummary}>{project.summary}</p>
            </div>

            <div className={styles.detailMeta} aria-label="Project details">
              <div>
                <span className={styles.metaLabel}>Year</span>
                <span>{project.year}</span>
              </div>
              <div>
                <span className={styles.metaLabel}>Client type</span>
                <span>{project.clientType}</span>
              </div>
              <div>
                <span className={styles.metaLabel}>Status</span>
                <span>{project.status}</span>
              </div>
            </div>
          </div>
        </section>

        <div className={styles.heroMediaWrap}>
          <ProjectMedia
            image={project.heroImage}
            title={project.title}
            className={styles.heroMedia}
          />
        </div>

        <section className={styles.contentSection} aria-labelledby="problem-heading">
          <div className={`${styles.detailInner} ${styles.twoCol}`}>
            <p className={styles.sectionLabel}>01 / The problem</p>
            <div className={styles.prose}>
              <h2 id="problem-heading">The problem</h2>
              {project.problem.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contentSectionDark} aria-labelledby="built-heading">
          <div className={`${styles.detailInner} ${styles.twoCol}`}>
            <p className={styles.sectionLabel}>02 / What I built</p>
            <div className={styles.featureColumn}>
              <h2 id="built-heading">What I built</h2>
              <ul className={styles.featureList}>
                {project.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={styles.screenshotSection} aria-labelledby="screenshots-heading">
          <div className={styles.detailInner}>
            <p className={styles.sectionLabel}>03 / Screenshots</p>
            <div className={styles.prose}>
              <h2 id="screenshots-heading">Screenshots</h2>
            </div>
            <div className={styles.screenshotGrid}>
              {project.screenshots.slice(0, 4).map((image, index) => (
                <ProjectMedia
                  image={image}
                  title={`${project.title} — ${index + 1}`}
                  showCaption
                  key={index}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.contentSectionDark} aria-labelledby="stack-heading">
          <div className={`${styles.detailInner} ${styles.twoCol}`}>
            <p className={styles.sectionLabel}>04 / Tech stack</p>
            <div className={styles.techColumn}>
              <h2 id="stack-heading">Tech stack</h2>
              <div className={styles.techWrap} aria-label="Project technology stack">
                {project.tech.map((item, index) => (
                  <span className={styles.techPill} key={`${item}-${index}`}>
                    {item}
                  </span>
                ))}
              </div>

              {showVisitSite ? (
                <a
                  className={styles.visitButton}
                  href={project.liveUrl as string}
                  target="_blank"
                  rel="noreferrer"
                >
                  Visit site <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </div>
          </div>
        </section>

        <nav className={styles.projectNav} aria-label="Project navigation">
          <Link href={`/work/${previousProject.slug}`}>
            <small>← Previous project</small>
            <strong>{previousProject.title}</strong>
          </Link>
          <Link href={`/work/${nextProject.slug}`}>
            <small>Next project →</small>
            <strong>{nextProject.title}</strong>
          </Link>
        </nav>
      </main>
      <SiteMotion />
    </>
  );
}
