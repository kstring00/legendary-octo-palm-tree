import Link from "next/link";

import { projects } from "./data/projects";
import { ProjectCard } from "./work/ProjectUI";
import workStyles from "./work/work.module.css";
import styles from "./SelectedWork.module.css";

export default function SelectedWork() {
  const featuredProjects = projects.slice(0, 3);

  return (
    <section className={styles.section} id="featured-work" aria-labelledby="selected-work-heading">
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <div>
            <p className={styles.eyebrow}>Selected work</p>
            <h2 id="selected-work-heading">Proof before pricing.</h2>
          </div>
          <Link className={styles.viewAll} href="/work">
            View all work <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className={workStyles.projectGrid}>
          {featuredProjects.map((project, index) => (
            <ProjectCard project={project} index={index} key={project.slug} />
          ))}
        </div>
      </div>
    </section>
  );
}
