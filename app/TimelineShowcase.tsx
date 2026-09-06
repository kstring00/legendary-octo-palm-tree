import ProcessTimesheet from "./ProcessTimesheet";
import styles from "./TimelineShowcase.module.css";

const phases = [
  {
    name: "Discovery",
    close: "Closes on agreed scope",
    description: "Align on goals, audience, and what we're building.",
  },
  {
    name: "Design",
    close: "Closes on approved direction",
    description: "Turn strategy into a clear visual direction.",
  },
  {
    name: "Build",
    close: "Closes on revisions used",
    description: "Bring the approved direction to life.",
  },
  {
    name: "Launch",
    close: "Closes on handoff",
    description: "Final checks, domain setup, and go live.",
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
            A clear process.
            <br />
            A defined <em>finish.</em>
          </h2>

          <p className={styles.subhead}>Four phases. Bounded scope. Logged hours.</p>

          <p className={styles.bodyCopy}>
            Your project moves through four phases. Each one closes when you
            approve it, not when a calendar says so. Every ten hours of work,
            you get my actual timesheet — date, task, plain-language
            description of what I did, hours logged. Your price is fixed at the
            quote. The log is there so you can see exactly where the time went.
          </p>
        </div>
      </div>

      <div className={styles.visualPanel}>
        <div className={styles.phaseGrid} aria-label="Four project phases">
          {phases.map((phase) => (
            <article className={styles.phaseCard} key={phase.name}>
              <span className={styles.phaseName}>{phase.name}</span>
              <strong>{phase.close}</strong>
              <p>{phase.description}</p>
            </article>
          ))}
        </div>

        <ProcessTimesheet />
      </div>
    </section>
  );
}
