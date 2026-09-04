import styles from "./AIIntakeSection.module.css";

const intakeItems = [
  {
    title: "Goals & friction",
    text: "What success looks like and what you want the site to make easier.",
    icon: "target",
  },
  {
    title: "Brand & inspiration",
    text: "Color direction, logo, and photos you own the rights to.",
    icon: "palette",
  },
  {
    title: "Domain and hosting",
    text: "Where your site lives now.",
    icon: "domain",
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

  if (type === "target") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="7.5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M12 4.5V7M19.5 12H17M12 19.5V17M4.5 12H7" />
      </svg>
    );
  }

  if (type === "palette") {
    return (
      <svg {...common}>
        <path d="M12 4.5a7.5 7.5 0 1 0 0 15h1.2c1.2 0 1.8-.8 1.3-1.8-.4-.8.1-1.7 1-1.7h1.3A3.7 3.7 0 0 0 20.5 12 7.8 7.8 0 0 0 12 4.5Z" />
        <circle cx="8.4" cy="10" r=".8" />
        <circle cx="11.4" cy="7.9" r=".8" />
        <circle cx="15" cy="9.1" r=".8" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16M12 4c2.1 2.2 3.2 4.9 3.2 8S14.1 17.8 12 20c-2.1-2.2-3.2-4.9-3.2-8S9.9 6.2 12 4Z" />
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
            <span>Project intake</span>
          </div>

          <h2>Start with a conversation</h2>

          <p className={styles.lead}>
            You do not need to figure out every detail before you start. The AI
            consultant asks one question at a time, follows your answers, and
            organizes what I need into a clear project brief.
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

          <p className={styles.collectLabel}>A few things we will cover</p>

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

          <p className={styles.securityNote}>
            Never send passwords or verification codes here. If we work
            together, account access is shared securely after kickoff.
          </p>

          <a className={styles.cta} href="#ai-intake-chat">
            <span>Start the Conversation</span>
            <span className={styles.ctaArrow} aria-hidden="true">→</span>
          </a>
          <p className={styles.ctaNote}>Plan on about 10 minutes</p>
          <p className={styles.emailFallback}>
            Prefer email? <a href="mailto:stringham00@gmail.com">stringham00@gmail.com</a>
          </p>
        </div>

        <div className={styles.visualCol}>
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
                    Hi there. I’ll ask a few focused questions so Kyle can
                    understand your project. First, what does your business do?
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
                    What would a successful website make easier for your
                    practice or your clients?
                  </div>
                  <span className={styles.time}>10:02 AM</span>
                </div>
              </div>

              <div className={`${styles.messageRow} ${styles.messageRowUser}`}>
                <div className={styles.messageGroup}>
                  <div className={styles.messageUser}>
                    I want people to understand our services quickly and make it
                    easier to request a consultation.
                  </div>
                  <span className={`${styles.time} ${styles.timeUser}`}>10:03 AM</span>
                </div>
                <span className={styles.ksBadge}>KS</span>
              </div>

              <div className={styles.messageRow}>
                <span className={styles.messageAvatar}>AI</span>
                <div className={styles.messageGroup}>
                  <div className={styles.messageAi}>
                    Great. Do you already have a domain or hosting provider? Just
                    tell me the name or provider. Please do not send passwords,
                    login codes, or other credentials here.
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
            <p className={styles.chatSecurity}>
              Passwords and verification codes are never requested in this chat.
            </p>
          </div>

          <div className={styles.sideAccent} aria-hidden="true">
            <div className={styles.accentGrid} />
            <p>Simple inputs mean a smoother build</p>
          </div>

          <p className={styles.handNote} aria-hidden="true">
            From conversation<br />to a beautiful<br />website.
          </p>
        </div>
      </div>
    </section>
  );
}
