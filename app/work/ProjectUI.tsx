import Link from "next/link";

import type { Project, ProjectImage, ProjectStatus } from "../data/projects";
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
  image,
  title,
  className = "",
  showCaption = false,
}: {
  image: ProjectImage;
  title: string;
  className?: string;
  showCaption?: boolean;
}) {
  return (
    <figure className={`${styles.mediaFigure} ${className}`}>
      {image.src ? (
        <img className={styles.mediaImage} src={image.src} alt={image.alt} />
      ) : (
        <div
          className={styles.mediaPlaceholder}
          role="img"
          aria-label={image.alt}
        >
          <span>Screenshot placeholder</span>
          <strong>{title}</strong>
          <small>Replace the image path in app/data/projects.ts</small>
        </div>
      )}
      {showCaption && image.caption ? (
        <figcaption>{image.caption}</figcaption>
      ) : null}
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
      <div className={styles.cardTopline}>
        <span className={styles.cardIndex}>{number}</span>
        <StatusBadge status={project.status} />
      </div>

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
    </Link>
  );
}
