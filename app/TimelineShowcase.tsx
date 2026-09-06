"use client";

import {
  KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import AIIntakeSection from "./AIIntakeSection";
import ProcessTimesheet from "./ProcessTimesheet";
import styles from "./TimelineShowcase.module.css";

const steps = [
  {
    nav: "Consultation",
    name: "Consultation",
    closesOn: "Agreed scope",
    copy:
      "You don't need to have every detail figured out. The AI consultant asks one question at a time, follows your answers, and turns the conversation into a clear project brief.",
  },
  {
    nav: "Plan & quote",
    name: "Plan & quote",
    closesOn: "Approved direction",
    copy:
      "You get a written plan before any work starts — what I'm building, what I'm not, what it costs, and how many revision rounds are included.",
  },
  {
    nav: "Build",
    name: "Build",
    closesOn: "Revisions used",
    copy:
      "Every ten hours of work, you get my actual timesheet — date, task, plain-language description of what I did, hours logged. Your price is fixed at the quote. The log is there so you can see exactly where the time went.",
  },
  {
    nav: "Launch",
    name: "Launch & handoff",
    closesOn: "Handoff",
    copy:
      "The site goes live and it's yours. Repo access, domain, analytics — all transferred. No hostage situations.",
  },
] as const;

const proposalIncluded = [
  "Five-page responsive website",
  "Custom visual system",
  "Contact + booking integration",
] as const;

const proposalExcluded = [
  "Ongoing copywriting",
  "Paid third-party subscriptions",
] as const;

const handoffItems = [
  "Repository access transferred",
  "Domain connected and verified",
  "Analytics installed",
  "60-day bug warranty begins",
  "Care plan optional, cancel anytime",
] as const;

function GoldCheck({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path d="M5 12.5 9.5 17 19 7.5" />
    </svg>
  );
}

function ProposalArtifact() {
  return (
    <article className={styles.proposal} aria-label="Example project proposal">
      <header className={styles.proposalHeader}>
        <div>
          <span className={styles.documentEyebrow}>Project proposal</span>
          <h4>Project Name</h4>
        </div>
        <span className={styles.proposalDate}>MM / DD / YYYY</span>
      </header>

      <div className={styles.proposalRule} aria-hidden="true" />

      <section className={styles.proposalSection}>
        <h5>Included</h5>
        <div className={styles.documentList}>
          {proposalIncluded.map((item, index) => (
            <div
              className={styles.proposalLine}
              style={{ transitionDelay: `${index * 80}ms` }}
              key={item}
            >
              <GoldCheck className={styles.proposalCheck} />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.proposalSection}>
        <h5>Not included</h5>
        <div className={`${styles.documentList} ${styles.excludedList}`}>
          {proposalExcluded.map((item, index) => (
            <div
              className={styles.proposalLine}
              style={{ transitionDelay: `${(index + proposalIncluded.length) * 80}ms` }}
              key={item}
            >
              <span className={styles.excludedMark} aria-hidden="true">—</span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <footer className={styles.proposalFooter}>
        <div
          className={styles.proposalLine}
          style={{ transitionDelay: "400ms" }}
        >
          <span>Fixed project price</span>
          <strong>$X,XXX</strong>
        </div>
        <div
          className={styles.proposalLine}
          style={{ transitionDelay: "480ms" }}
        >
          <span>Revision rounds included</span>
          <strong>2 rounds</strong>
        </div>
      </footer>
    </article>
  );
}

function HandoffArtifact() {
  return (
    <article className={styles.handoff} aria-label="Launch handoff checklist">
      <header className={styles.handoffHeader}>
        <div>
          <span className={styles.documentEyebrow}>Final handoff</span>
          <h4>Everything leaves with you.</h4>
        </div>
        <span className={styles.handoffStatus}>Ready to transfer</span>
      </header>

      <div className={styles.handoffList}>
        {handoffItems.map((item, index) => (
          <div
            className={styles.handoffRow}
            style={{ transitionDelay: `${index * 80}ms` }}
            key={item}
          >
            <GoldCheck className={styles.handoffCheck} />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function TimelineShowcase() {
  const [activeStep, setActiveStep] = useState(0);
  const [previousStep, setPreviousStep] = useState<number | null>(null);
  const [transitioning, setTransitioning] = useState(false);
  const [panelHeight, setPanelHeight] = useState<number | null>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const transitionTimer = useRef<number | null>(null);

  const selectStep = (nextStep: number) => {
    if (nextStep === activeStep) return;

    if (transitionTimer.current !== null) {
      window.clearTimeout(transitionTimer.current);
    }

    setPreviousStep(activeStep);
    setActiveStep(nextStep);
    setTransitioning(true);

    transitionTimer.current = window.setTimeout(() => {
      setTransitioning(false);
      setPreviousStep(null);
      transitionTimer.current = null;
    }, 430);
  };

  useEffect(() => {
    return () => {
      if (transitionTimer.current !== null) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const panel = panelRefs.current[activeStep];
    if (!panel) return;

    const updateHeight = () => {
      const nextHeight = panel.getBoundingClientRect().height;
      if (nextHeight > 0) setPanelHeight(nextHeight);
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(panel);

    return () => observer.disconnect();
  }, [activeStep]);

  const handleTabKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    let nextIndex = index;

    if (event.key === "ArrowRight") {
      nextIndex = (index + 1) % steps.length;
    } else if (event.key === "ArrowLeft") {
      nextIndex = (index - 1 + steps.length) % steps.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = steps.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    selectStep(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section className={styles.timeline} id="timeline">
      <div className={styles.stepperInner}>
        <div className={styles.tabShell}>
          <div className={styles.tabList} role="tablist" aria-label="Project process">
            {steps.map((step, index) => {
              const isActive = activeStep === index;

              return (
                <button
                  className={`${styles.tab} ${isActive ? styles.tabActive : ""}`}
                  id={`process-tab-${index + 1}`}
                  key={step.name}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`process-panel-${index + 1}`}
                  tabIndex={isActive ? 0 : -1}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  onClick={() => selectStep(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index)}
                >
                  <span className={styles.tabNumber}>{String(index + 1).padStart(2, "0")}</span>
                  <span>{step.nav}</span>
                </button>
              );
            })}

            <span
              className={styles.activeIndicator}
              style={{ transform: `translateX(${activeStep * 100}%)` }}
              aria-hidden="true"
            />
          </div>
        </div>

        <div
          className={styles.panelViewport}
          style={panelHeight ? { height: `${panelHeight}px` } : undefined}
        >
          {steps.map((step, index) => {
            const isActive = activeStep === index;
            const isExiting = transitioning && previousStep === index;
            const panelClass = isActive
              ? styles.panelActive
              : isExiting
                ? styles.panelExiting
                : styles.panelIdle;

            return (
              <div
                className={`${styles.panel} ${panelClass}`}
                id={`process-panel-${index + 1}`}
                key={step.name}
                role="tabpanel"
                aria-labelledby={`process-tab-${index + 1}`}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                ref={(node) => {
                  panelRefs.current[index] = node;
                }}
              >
                <div className={styles.panelCopy}>
                  <div className={styles.panelCopyInner}>
                    <span className={styles.panelStepNumber}>
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2>{step.name}</h2>
                    <p className={styles.closeCondition}>
                      Closes on: <strong>{step.closesOn}</strong>
                    </p>
                    <p className={styles.bodyCopy}>{step.copy}</p>
                  </div>
                </div>

                <div className={styles.artifactPanel}>
                  <div className={styles.artifactInner}>
                    {index === 0 && (
                      <div className={styles.intakeEmbed}>
                        <AIIntakeSection />
                      </div>
                    )}
                    {index === 1 && <ProposalArtifact />}
                    {index === 2 && (isActive || isExiting) && <ProcessTimesheet />}
                    {index === 3 && <HandoffArtifact />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
