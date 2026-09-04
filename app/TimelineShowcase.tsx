import styles from "./TimelineShowcase.module.css";

const stages = [
  {
    title: "Discovery",
    days: "1–2 days",
    note: "Align on goals, audience, and scope.",
  },
  {
    title: "Design",
    days: "2–4 days",
    note: "Turn strategy into a clear visual direction.",
  },
  {
    title: "Build",
    days: "3–7 days",
    note: "Bring the approved direction to life.",
  },
  {
    title: "Launch",
    days: "1 day",
    note: "Final checks, domain setup, and go live.",
  },
] as const;

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

      <div className={styles.visualPanel} aria-label="Four phase website timeline">
        <div className={styles.visualGlow} aria-hidden="true" />
        <div className={styles.arcOne} aria-hidden="true" />
        <div className={styles.arcTwo} aria-hidden="true" />
        <div className={styles.pathLine} aria-hidden="true" />

        {stages.map((stage, index) => {
          const stopClass = [styles.stop1, styles.stop2, styles.stop3, styles.stop4][index];

          return (
            <div key={stage.title} className={`${styles.orbStop} ${stopClass}`}>
              <span
                className={`${styles.orb} ${index === 3 ? styles.orbLaunch : ""}`}
                aria-hidden="true"
              />
              <div className={styles.visualLabel}>
                <span>{stage.title}</span>
                <small>{stage.days}</small>
                <i>{stage.note}</i>
              </div>
            </div>
          );
        })}

        <p className={styles.edgeMark} aria-hidden="true">
          <span>Good</span>
          <span>ideas</span>
          <span>deserve</span>
          <span>a</span>
          <span>great</span>
          <span>home</span>
        </p>
      </div>
    </section>
  );
}
