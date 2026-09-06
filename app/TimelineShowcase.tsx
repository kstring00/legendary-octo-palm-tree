import Image from "next/image";

import styles from "./TimelineShowcase.module.css";
import timelineArtwork from "../ChatGPT Image Sep 4, 2026, 05_24_26 PM.png";

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
        <div className={styles.artworkStage} aria-hidden="true">
          <Image
            className={styles.timelineArtwork}
            src={timelineArtwork}
            alt=""
            fill
            sizes="(max-width: 72rem) 100vw, 50vw"
            quality={95}
          />

          <div className={styles.phaseOverlay}>
            {phases.map((phase, index) => (
              <div
                className={`${styles.phaseCard} ${styles[`phase${index + 1}`]}`}
                key={phase.name}
              >
                <span className={styles.phaseName}>{phase.name}</span>
                <strong>{phase.close}</strong>
                <p>{phase.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.phaseTranscript}>
          {phases.map((phase) => (
            <div key={phase.name}>
              <strong>{phase.name}: {phase.close}.</strong>{" "}
              <span>{phase.description}</span>
            </div>
          ))}
        </div>

        <aside className={styles.checkInBand} aria-label="Timesheet check-in">
          <h3>Every 10 hours, a check-in</h3>
          <p>
            You receive the timesheet — every entry dated, described, and
            totalled. Progress since last check-in, what&apos;s next, and any
            decisions I need from you. If something needs redirecting, we catch
            it at hour 10, not hour 40.
          </p>
        </aside>
      </div>
    </section>
  );
}
