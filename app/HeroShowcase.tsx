import styles from "./HeroShowcase.module.css";

function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const highlights = [
  ["Custom, not templated", "Built for your actual workflow"],
  ["Direct with me", "No agency, no handoffs"],
  ["Built to last", "Yours to keep and change"],
] as const;

export default function HeroShowcase() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>
            Websites for storage, ABA, and small business
          </p>

          <h1>
            Websites built
            <br />
            around <em>your</em>
            <br />
            <em>business.</em>
          </h1>

          <p className={styles.lede}>
            I design and build custom websites for storage facilities, ABA and
            counseling practices, course creators, and other small businesses —
            built around how your business actually works, not a template with
            the name swapped out.
          </p>

          <div className={styles.actions}>
            <a className={styles.primary} href="/work">
              See the work <Arrow />
            </a>
            <a className={styles.secondary} href="#quick-contact">
              Start a project
            </a>
          </div>

          <div className={styles.highlights}>
            {highlights.map(([title, text]) => (
              <div className={styles.highlight} key={title}>
                <strong>{title}</strong>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div
          className={styles.visual}
          aria-label="Selected website build concepts"
        >
          <div className={`${styles.browserMockup} ${styles.commonGround}`}>
            <div className={styles.browserChrome} aria-hidden="true">
              <i />
              <i />
              <i />
              <span />
            </div>
            <div className={styles.commonGroundBody}>
              <div className={styles.cgTopLine} />
              <p>
                Real autism support
                <br />
                for real <em>Texas</em> families
              </p>
              <div className={styles.cgCopyLine} />
              <div className={styles.cgPhotoBlock} />
            </div>
          </div>

          <div className={`${styles.browserMockup} ${styles.bcbaPrep}`}>
            <div className={styles.browserChrome} aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className={styles.bcbaBody}>
              <p>
                Nine domains. <em>One standard.</em>
              </p>
              <div className={styles.bcbaRule} />
              <div className={styles.bcbaShelf} />
            </div>
          </div>

          <div className={`${styles.browserMockup} ${styles.lakeCity}`}>
            <div className={`${styles.browserChrome} ${styles.storageChrome}`} aria-hidden="true">
              <i />
              <i />
              <i />
              <span />
            </div>
            <div className={styles.storageBody}>
              <div className={styles.storageLogoBlock} />
              <div className={styles.storageNavLine} />
              <div className={styles.storageGrid}>
                <div className={styles.storageCopy}>
                  <span />
                  <strong>
                    Find the Right Storage
                    <br />
                    Space for You
                  </strong>
                  <i />
                  <i />
                  <i />
                </div>
                <div className={styles.storageVisual}>
                  <span />
                  <i />
                </div>
              </div>
              <div className={styles.storageCards}>
                <i />
                <i />
              </div>
            </div>
          </div>

          <p className={styles.buildCaption}>
            <span aria-hidden="true" />
            Recent builds
            <b>·</b>
            Lake City Self Storage
            <b>·</b>
            BCBA Prep
            <b>·</b>
            Common Ground (in pilot)
          </p>
        </div>
      </div>
    </section>
  );
}
