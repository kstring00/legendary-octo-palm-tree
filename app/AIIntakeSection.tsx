import styles from "./AIIntakeSection.module.css";

const intakeItems = [
  {
    title: "Your words",
    text: "Copy and messaging",
    icon: "copy",
  },
  {
    title: "Your logo",
    text: "Best-quality file",
    icon: "image",
  },
  {
    title: "Photos",
    text: "Anything you own or can use",
    icon: "photo",
  },
  {
    title: "Your goals",
    text: "What the site needs to do",
    icon: "target",
  },
  {
    title: "Timeline",
    text: "When you want to launch",
    icon: "calendar",
  },
  {
    title: "Logins",
    text: "Domain and hosting access",
    icon: "lock",
  },
] as const;

const steps = ["Business", "Goals", "Pages", "Assets", "Launch"] as const;

function IntakeIcon({ type }: { type: (typeof intakeItems)[number]["icon"] }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (type === "copy") {
    return (
      <svg {...common}>
        <rect x="5" y="3.5" width="14" height="17" rx="2" />
        <path d="M8 8h8M8 12h8M8 16h5" />
      </svg>
    );
  }

  if (type === "image" || type === "photo") {
    return (
      <svg {...common}>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.5" />
        <path d="M6.5 16l4-4 3 3 2-2 2 3" />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 4.5V7M19.5 12H17M12 19.5V17M4.5 12H7" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg {...common}>
        <rect x="4" y="6" width="16" height="14" rx="2" />
        <path d="M8 3.5v5M16 3.5v5M4 10h16" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <rect x="6" y="11" width="12" height="9" rx="2" />
      <path d="M8.5 11V8.5a3.5 3.5 0 0 1 7 0V11" />
    </svg>
  );
}

export default function AIIntakeSection() {
  return (
    <section className={styles.section} id="contact">
      <div className={styles.inner}>
        <div className={styles.copyCol}>
          <div className={styles.kickerRow}>
            <span className={styles.kickerRule} aria-hidden="true" />
            <span>AI Project Intake</span>
          </div>

          <h2>Tell me what you need</h2>

          <p className={styles.lead}>
            My AI consultant asks a few focused questions, collects the details
            I need for your website, and organizes everything into a clear
            project brief so I can get to work.
          </p>

          <div className={styles.progressWrap} aria-label="Project intake progress">
            <div className={styles.progressLine} aria-hidden="true" />
            <div className={styles.progressFill} aria-hidden="true" />
            <div className={styles.steps}>
              {steps.map((step, index) => (
                <div className={styles.step} key={step}>
                  <span
                    className={`${styles.dot} ${index === 0 ? styles.dotActive : ""}`}
                    aria-hidden="true"
                  />
                  <span className={styles.stepNumber}>{index + 1}</span>
                  <span className={styles.stepLabel}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          <p className={styles.collectLabel}>We’ll collect information about:</p>

          <div className={styles.infoGrid}>
            {intakeItems.map((item) => (
              <div className={styles.infoItem} key={item.title}>
                <div className={styles.infoIcon}>
                  <IntakeIcon type={item.icon} />
                </div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <a className={styles.cta} href="#ai-intake-chat">
            <span>Start the Conversation</span>
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </a>
          <p className={styles.ctaNote}>It only takes a few minutes</p>
        </div>

        <div className={styles.visualCol}>
          <div className={styles.sideAccent} aria-hidden="true">
            <div className={styles.accentGrid} />
            <p>Simple inputs mean a smoother build</p>
          </div>

          <div className={styles.chatCard} id="ai-intake-chat">
            <div className={styles.chatHeader}>
              <div className={styles.chatIdentity}>
                <span className={styles.aiBadge}>AI</span>
                <div>
                  <h3>AI Consultant</h3>
                  <p>Ask · Collect · Organize</p>
                </div>
              </div>
              <span className={styles.online}>
                <span aria-hidden="true" /> Online
              </span>
            </div>

            <div className={styles.chatBody}>
              <div className={styles.messageRow}>
                <span className={styles.messageAvatar}>AI</span>
                <div className={styles.messageGroup}>
                  <div className={styles.messageAi}>
                    Hi there. I’ll ask a few focused questions so I can collect
                    what Kyle needs for your project. First, what does your
                    business do?
                  </div>
                  <span className={styles.time}>10:01 AM</span>
                </div>
              </div>

              <div className={`${styles.messageRow} ${styles.messageRowUser}`}>
                <div className={styles.messageGroup}>
                  <div className={styles.messageUser}>
                    We’re a therapy practice helping adults through anxiety,
                    grief, and life transitions.
                  </div>
                  <span className={`${styles.time} ${styles.timeUser}`}>10:02 AM</span>
                </div>
                <span className={styles.ksBadge}>KS</span>
              </div>

              <div className={styles.messageRow}>
                <span className={styles.messageAvatar}>AI</span>
                <div className={styles.messageGroup}>
                  <div className={styles.messageAi}>
                    Great. What pages do you need on the site?
                  </div>
                  <span className={styles.time}>10:02 AM</span>
                </div>
              </div>

              <div className={`${styles.messageRow} ${styles.messageRowUser}`}>
                <div className={styles.messageGroup}>
                  <div className={styles.messageUser}>
                    Home, About, Services, FAQ, and Contact.
                  </div>
                  <span className={`${styles.time} ${styles.timeUser}`}>10:03 AM</span>
                </div>
                <span className={styles.ksBadge}>KS</span>
              </div>

              <div className={styles.messageRow}>
                <span className={styles.messageAvatar}>AI</span>
                <div className={styles.messageGroup}>
                  <div className={styles.messageAi}>
                    Perfect. Do you already have a logo, photos, and website
                    copy, or do you need help with any of that?
                  </div>
                  <span className={styles.time}>10:03 AM</span>
                </div>
              </div>

              <div className={styles.typingRow} aria-label="AI consultant is typing">
                <span className={styles.messageAvatar}>AI</span>
                <span className={styles.typingBubble}>
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            </div>

            <div className={styles.chatInputBar}>
              <span className={styles.attachment} aria-hidden="true">⌁</span>
              <span className={styles.inputFake}>Type your message...</span>
              <span className={styles.sendButton} aria-hidden="true">↑</span>
            </div>
          </div>

          <p className={styles.handNote} aria-hidden="true">
            From conversation<br />to a beautiful<br />website.
          </p>
        </div>
      </div>
    </section>
  );
}
