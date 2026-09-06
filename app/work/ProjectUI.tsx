import Link from "next/link";

import type { Project, ProjectStatus } from "../data/projects";
import styles from "./work.module.css";

const statusClass: Record<ProjectStatus, string> = {
  LIVE: styles.statusLive,
  "IN PILOT": styles.statusPilot,
  "LAUNCHING SOON": styles.statusSoon,
  "CASE STUDY": styles.statusCaseStudy,
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`${styles.statusBadge} ${statusClass[status]}`}>
      {status}
    </span>
  );
}

export function ProjectMedia({
  src,
  alt,
  title,
  caption,
  className = "",
  loading = "lazy",
}: {
  src: string;
  alt: string;
  title: string;
  caption?: string;
  className?: string;
  loading?: "lazy" | "eager";
}) {
  return (
    <figure className={`${styles.mediaFigure} ${className}`}>
      {src ? (
        <img
          className={styles.mediaImage}
          src={src}
          alt={alt}
          loading={loading}
          decoding="async"
        />
      ) : (
        <div
          className={styles.mediaPlaceholder}
          role="img"
          aria-label={alt}
        >
          <span>Preview coming soon</span>
          <strong>{title}</strong>
        </div>
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <Link
      className={styles.projectCard}
      href={`/work/${project.slug}`}
      aria-label={`View case study for ${project.title}`}
    >
      <div className={styles.cardMedia}>
        {project.heroImage ? (
          <>
            <img
              className={styles.cardImage}
              src={project.heroImage}
              alt={project.heroImageAlt}
              loading="lazy"
              decoding="async"
            />
            <span className={styles.cardMediaScrim} aria-hidden="true" />
          </>
        ) : (
          <div
            className={styles.cardMediaPlaceholder}
            role="img"
            aria-label={project.heroImageAlt}
          />
        )}

        <span className={styles.cardIndex}>{number}</span>
        <span className={styles.cardStatus}>
          <StatusBadge status={project.status} />
        </span>
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardBody}>
          <h3>{project.title}</h3>
          <p className={styles.cardDescription}>{project.description}</p>

          <div className={styles.techList} aria-label="Technology used">
            {project.tech.map((item, techIndex) => (
              <span className={styles.techPill} key={`${item}-${techIndex}`}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <span className={styles.cardLink} aria-hidden="true">
          View case study <span>→</span>
        </span>
      </div>
    </Link>
  );
}
