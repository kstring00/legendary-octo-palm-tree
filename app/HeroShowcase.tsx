import styles from "./HeroShowcase.module.css";

function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const highlights = [
  ["Strategic", "Built around the business goal"],
  ["Custom", "Not a cookie-cutter template"],
  ["Useful", "Designed to make the next step easier"],
] as const;

export default function HeroShowcase() {
  return (
    <section className={styles.hero} id="top">
      <div className={styles.orbitOne} aria-hidden="true" />
      <div className={styles.orbitTwo} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.copy}>
          <div className={styles.eyebrowRow}>
            <span>Websites for meaningful businesses</span>
            <span className={styles.eyebrowLine} aria-hidden="true" />
          </div>

          <h1>
            Websites built
            <br />
            around <em>your</em>
            <br />
            business.
          </h1>

          <p className={styles.lede}>
            I design and build custom websites for storage facilities,
            counseling practices, ABA centers, coaches, course creators, and
            other small businesses. Each one is built around your goals, your
            audience, and what makes you different.
          </p>

          <div className={styles.actions}>
            <a className={styles.primary} href="#contact">
              Let&apos;s Build Yours <Arrow />
            </a>
            <a className={styles.secondary} href="#featured-work">
              See My Work <Arrow />
            </a>
          </div>

          <div className={styles.highlights}>
            {highlights.map(([title, text]) => (
              <div className={styles.highlight} key={title}>
                <span className={styles.highlightIcon} aria-hidden="true" />
                <div>
                  <strong>{title}</strong>
                  <span>{text}</span>
                </div>
              </div>
            ))}
          </div>

          <p className={styles.seoNote}>
            SEO is not part of my service. If ranking on Google is your main
            goal, I&apos;ll tell you straight and point you toward someone who does it.
          </p>
        </div>

        <div className={styles.visual} id="featured-work" aria-label="Examples of website styles Kyle builds">
          <div className={`${styles.siteCard} ${styles.commonGround}`}>
            <div className={styles.browserBar}>
              <span className={styles.brandDot} />
              <span>Common Ground</span>
            </div>
            <div className={styles.commonGroundScreen}>
              <small>Texas ABA Centers · Common Ground</small>
              <strong>Real autism support for real Texas families</strong>
              <span>Clear next steps, parent tools, and practical support.</span>
            </div>
          </div>

          <div className={`${styles.siteCard} ${styles.bcbaPrep}`}>
            <div className={styles.browserBar}>
              <span className={styles.beeMark}>◇</span>
              <span>BCBA Prep</span>
            </div>
            <div className={styles.bcbaScreen}>
              <small>The library</small>
              <strong>Nine domains. <em>One standard.</em></strong>
              <div className={styles.bookStack} aria-hidden="true">
                <i /><i /><i /><i />
              </div>
            </div>
          </div>

          <div className={`${styles.siteCard} ${styles.lakeCity}`}>
            <div className={styles.browserBar}>
              <span className={styles.storageMark}>▣</span>
              <span>Lake City Self Storage</span>
            </div>
            <div className={styles.storageScreen}>
              <div>
                <small>Non-climate + climate-controlled storage</small>
                <strong>Find the Right Storage Space for You</strong>
                <span>Simple choices, clear pricing, easy next steps.</span>
              </div>
              <div className={styles.storagePhoto} aria-hidden="true">
                <i /><i /><i /><i /><i />
              </div>
            </div>
          </div>

          <p className={styles.handNote} aria-hidden="true">
            Different businesses.<br />Same thoughtful approach.
          </p>
        </div>
      </div>

      <div className={styles.bottomLine} aria-hidden="true">
        <span />
        <p>Purposeful websites. Real impact.</p>
        <span />
      </div>
    </section>
  );
}
