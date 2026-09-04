import Image from "next/image";

import styles from "./TimelineShowcase.module.css";
import timelineArtwork from "../ChatGPT Image Sep 4, 2026, 05_24_26 PM.png";

export default function TimelineShowcase() {
  return (
    <section className={styles.timeline} id="timeline">
      <div className={styles.copyPanel}>
        <div className={styles.copyInner}>
          <div className={styles.kickerRow}>
            <span>01 / 04</span>
            <span className={styles.kickerRule} aria-hidden="true" />
            <span>The process</span>
          </div>

          <h2>
            A clear timeline.
            <br />
            A defined <em>finish.</em>
          </h2>

          <p className={styles.subhead}>Four phases. Bounded scope. Real progress.</p>

          <p className={styles.bodyCopy}>
            Your website moves through four focused phases with a set number of
            revision rounds, so you always know what comes next and what closes
            the project. My working time stays consistent. Your feedback,
            approvals, and materials set the calendar rhythm, and we keep it
            moving together.
          </p>
        </div>
      </div>

      <div className={styles.visualPanel}>
        <Image
          className={styles.timelineArtwork}
          src={timelineArtwork}
          alt="Website project timeline showing Discovery, Design, Build, and Launch"
          fill
          sizes="(max-width: 72rem) 100vw, 50vw"
          quality={95}
        />
      </div>
    </section>
  );
}
