"use client";

import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MutableRefObject,
} from "react";

import styles from "./TimelineShowcase.module.css";

const steps = [
  {
    number: "01",
    title: "Discovery",
    days: "1–2 days",
    copy: "We align on your goals, audience, content, and what the site needs to do.",
    doText:
      "I define the brief, business goal, audience, content needs, and technical requirements.",
    youText:
      "You provide the source materials, access, and decisions needed to approve the brief.",
    revisions: "No revision round. This phase closes with brief approval.",
  },
  {
    number: "02",
    title: "Design",
    days: "2–4 days",
    copy: "I set the visual direction and core pages. You review and respond inside defined revision rounds.",
    doText:
      "I turn the approved brief into the visual direction and core page system.",
    youText:
      "You review the presented direction and return one consolidated set of feedback per round.",
    revisions: "3 revision rounds included.",
  },
  {
    number: "03",
    title: "Build",
    days: "3–7 days",
    copy: "I bring the design to life, implement your content, and make sure it works across devices.",
    doText:
      "I implement the approved design, content, responsive behavior, and required functionality.",
    youText:
      "You review the working site and return one consolidated set of implementation notes per round.",
    revisions: "2 revision rounds included.",
  },
  {
    number: "04",
    title: "Launch",
    days: "1 day",
    copy: "Final checks, domain setup, and go live. Your new site is in the world.",
    doText:
      "I complete final checks, connect the domain, and publish the approved site.",
    youText:
      "You approve the launch version and confirm access to the live domain and hosting.",
    revisions: "No revision round. Launch follows final approval.",
  },
] as const;

const LINE_PROGRESS = [0.08, 0.38, 0.64, 0.91] as const;

function PhaseIcon({ index }: { index: number }) {
  const common = {
    width: 40,
    height: 40,
    viewBox: "0 0 40 40",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (index === 0) {
    return (
      <svg {...common}>
        <circle cx="20" cy="20" r="13.5" />
        <circle cx="20" cy="20" r="4" />
        <path d="M20 6.5v4M20 29.5v4M6.5 20h4M29.5 20h4" />
        <path d="M15 25l3.2-8.2L26 13l-3.8 7.8L15 25Z" />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg {...common}>
        <rect x="6.5" y="8" width="27" height="24" rx="1.5" />
        <path d="M6.5 14h27M14 14v18" />
        <path d="M18 19h10M18 23h7M18 27h9" />
      </svg>
    );
  }

  if (index === 2) {
    return (
      <svg {...common}>
        <path d="M14 11 6.5 20 14 29M26 11l7.5 9-7.5 9" />
        <path d="m23 8-6 24" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M8 31h24" />
      <path d="M20 31V12" />
      <path d="M20 12c4.5 0 7-4.5 11-3v10c-4-1.5-6.5 3-11 3" />
      <path d="M16.5 34.5h7" />
    </svg>
  );
}

export default function TimelineShowcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const milestoneRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const togglePhase = (index: number) => {
    setActiveIndex((current) => (current === index ? null : index));
  };

  const handleArrowNavigation = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    refs: MutableRefObject<Array<HTMLButtonElement | null>>,
  ) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;

    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + direction + steps.length) % steps.length;
    setActiveIndex(next);
    refs.current[next]?.focus();
  };

  const lineProgress =
    activeIndex === null ? 0 : LINE_PROGRESS[activeIndex] ?? 0;

  return (
    <section
      className={styles.timeline}
      id="timeline"
      style={
        { "--line-progress": lineProgress } as CSSProperties & {
          "--line-progress": number;
        }
      }
    >
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
            {steps.map((step, index) => {
              const isActive = activeIndex === index;
              const detailId = `timeline-detail-${index + 1}`;

              return (
                <article className={`${styles.step} timeline-step`} key={step.number}>
                  <button
                    ref={(node) => {
                      cardRefs.current[index] = node;
                    }}
                    type="button"
                    className={styles.stepToggle}
                    aria-label={`${isActive ? "Collapse" : "Expand"} ${step.title} details`}
                    aria-expanded={isActive}
                    aria-controls={detailId}
                    onClick={() => togglePhase(index)}
                    onKeyDown={(event) =>
                      handleArrowNavigation(event, index, cardRefs)
                    }
                  />

                  <div className={styles.stepHead}>
                    <span className={styles.stepNumber}>{step.number}</span>
                    <h3>{step.title}</h3>
                    <p className={styles.days}>{step.days}</p>
                  </div>

                  <div className={styles.phaseIconWrap} aria-hidden="true">
                    <PhaseIcon index={index} />
                  </div>

                  <p>{step.copy}</p>
                  <span className={styles.stepRule} aria-hidden="true" />

                  <div
                    id={detailId}
                    className={`${styles.detail} ${
                      isActive ? styles.detailOpen : ""
                    }`}
                    aria-hidden={!isActive}
                  >
                    <div className={styles.detailInner}>
                      <p>
                        <strong>What I do</strong>
                        <span>{step.doText}</span>
                      </p>
                      <p>
                        <strong>What you do</strong>
                        <span>{step.youText}</span>
                      </p>
                      <p>
                        <strong>Revisions</strong>
                        <span>{step.revisions}</span>
                      </p>
                      <p>
                        <strong>Working days</strong>
                        <span>{step.days}</span>
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
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

      <div
        className={`${styles.visualPanel} timeline-visual`}
        aria-label="Four phase website timeline"
      >
        <div className={styles.visualGlow} aria-hidden="true" />
        <div className={styles.arcOne} aria-hidden="true" />
        <div className={styles.arcTwo} aria-hidden="true" />
        <div className={styles.pathLine} aria-hidden="true">
          <span className={styles.pathFill} />
        </div>

        {steps.map((step, index) => {
          const isActive = activeIndex === index;
          const stopClass = [styles.stop1, styles.stop2, styles.stop3, styles.stop4][index];

          return (
            <button
              key={step.number}
              ref={(node) => {
                milestoneRefs.current[index] = node;
              }}
              type="button"
              className={`${styles.orbStop} ${stopClass} ${
                isActive ? styles.milestoneActive : ""
              }`}
              aria-label={`${isActive ? "Collapse" : "Open"} ${step.title} phase`}
              aria-expanded={isActive}
              aria-controls={`timeline-detail-${index + 1}`}
              onClick={() => togglePhase(index)}
              onKeyDown={(event) =>
                handleArrowNavigation(event, index, milestoneRefs)
              }
            >
              <span className={`${styles.orb} timeline-orb`} aria-hidden="true" />
              <span className={styles.visualLabel}>
                <span>{step.title}</span>
                <small>{step.days}</small>
              </span>
            </button>
          );
        })}

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
