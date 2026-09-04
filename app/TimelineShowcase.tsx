import styles from "./TimelineShowcase.module.css";

const steps = [
  {
    number: "01",
    title: "Discovery",
    days: "1–2 days",
    copy: "We align on your goals, audience, content, and what the site needs to do.",
  },
  {
    number: "02",
    title: "Design",
    days: "2–4 days",
    copy: "I set the visual direction and core pages. You review and respond inside defined revision rounds.",
  },
  {
    number: "03",
    title: "Build",
    days: "3–7 days",
    copy: "I bring the design to life, implement your content, and make sure it works across devices.",
  },
  {
    number: "04",
    title: "Launch",
    days: "1 day",
    copy: "Final checks, domain setup, and go live. Your new site is in the world.",
  },
];

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

          <h2 className="timeline-heading">
            A clear timeline.
            <br />
            A defined <em>finish.</em>
          </h2>

          <p className={styles.subhead}>Four phases. Bounded scope. Real progress.</p>

          <p className={`${styles.bodyCopy} timeline-copy`}>
            Your website moves through four focused phases with a set number of
            revision rounds, so you always know what comes next and what closes
            the project. My working time stays consistent. Your feedback,
            approvals, and materials set the calendar rhythm, and we keep it
            moving together.
          </p>

          <div className={styles.steps}>
            {steps.map((step) => (
              <article className={`${styles.step} timeline-step`} key={step.number}>
                <div className={styles.stepHead}>
                  <span className={styles.stepNumber}>{step.number}</span>
                  <h3>{step.title}</h3>
                  <p className={styles.days}>{step.days}</p>
                </div>

                <div className={styles.materialMark} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>

                <p>{step.copy}</p>
                <span className={styles.stepRule} aria-hidden="true" />
              </article>
            ))}
          </div>

          <div className={styles.timeBar}>
            <div>
              <span className={styles.calendarIcon} aria-hidden="true">▦</span>
              <span>Typical working time: <strong>7–14 days</strong></span>
            </div>
            <span className={styles.timeDivider} aria-hidden="true" />
            <span>Calendar time follows feedback, approvals, and revision rounds.</span>
          </div>
        </div>
      </div>

      <div className={`${styles.visualPanel} timeline-visual`} aria-label="Four phase website timeline">
        <div className={styles.visualGlow} aria-hidden="true" />
        <div className={styles.arcOne} aria-hidden="true" />
        <div className={styles.arcTwo} aria-hidden="true" />
        <div className={styles.pathLine} aria-hidden="true" />

        <div className={`${styles.orbStop} ${styles.stop1}`}>
          <div className={`${styles.orb} timeline-orb`} aria-hidden="true" />
          <div className={styles.visualLabel}>
            <span>Discovery</span>
            <small>1–2 days</small>
          </div>
        </div>

        <div className={`${styles.orbStop} ${styles.stop2}`}>
          <div className={`${styles.orb} timeline-orb`} aria-hidden="true" />
          <div className={styles.visualLabel}>
            <span>Design</span>
            <small>2–4 days</small>
          </div>
        </div>

        <div className={`${styles.orbStop} ${styles.stop3}`}>
          <div className={`${styles.orb} timeline-orb`} aria-hidden="true" />
          <div className={styles.visualLabel}>
            <span>Build</span>
            <small>3–7 days</small>
          </div>
        </div>

        <div className={`${styles.orbStop} ${styles.stop4}`}>
          <div className={`${styles.orb} ${styles.orbLaunch} timeline-orb`} aria-hidden="true" />
          <div className={styles.visualLabel}>
            <span>Launch</span>
            <small>1 day</small>
          </div>
        </div>

        <div className={styles.visualBrand}>
          <span className={styles.visualBrandRule} aria-hidden="true" />
          <p>Strategy today.<br />A stronger tomorrow.</p>
          <span className={styles.visualBrandRule} aria-hidden="true" />
          <small>KS / DIGITAL</small>
        </div>

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
