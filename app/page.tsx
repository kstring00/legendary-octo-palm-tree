import Image from "next/image";

import Header from "./Header";
import PricingTicker from "./PricingTicker";
import TidalRevealFooter from "./TidalRevealFooter";

import heroPhoto from "./hero.png";

// TODO: replace with the real address before this goes to a custom domain.
const CONTACT_EMAIL = "you@example.com";

// Drop your own photographs into /public and name them here. Until then each
// slot renders a tinted panel — nothing is committed that you don't own.
const PHOTOS: Record<"timeline" | "aside", string | null> = {
  timeline: null, // e.g. "/timeline.jpg"
  aside: null, // e.g. "/aside.jpg"
};

const tiers = [
  {
    name: "One page",
    price: "500",
    includes: [
      "A single scrolling page",
      "Works properly on phones",
      "Contact form",
      "Live on your domain",
    ],
  },
  {
    name: "Small site",
    price: "800",
    includes: [
      "Four to six pages",
      "Works properly on phones",
      "Contact form",
      "Live on your domain",
    ],
  },
  {
    name: "Larger site",
    price: "1,200",
    includes: [
      "More pages",
      "Custom features",
      "Built around what you need",
      "Live on your domain",
    ],
  },
];

const needs = [
  ["Your words", "what each page should say"],
  ["Your logo", "the best-quality file you have"],
  ["Photos", "ones you own or have the rights to use"],
  ["Your domain login", null],
  ["Your hosting login", "if it's separate"],
];

function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden="true">
      <rect x="0.6" y="0.6" width="16.8" height="12.8" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 1.5l8 6 8-6" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

/** Stacks each word on its own line, as in the mockup's edge marks. */
function Mark({ text, light }: { text: string; light?: boolean }) {
  return (
    <p className={light ? "tag tag--light mark" : "tag mark"}>
      {text.split(" ").map((word) => (
        <span key={word}>{word}</span>
      ))}
    </p>
  );
}

function Figure({
  src,
  alt,
  className,
  mark,
}: {
  src: string | null;
  alt: string;
  className?: string;
  mark?: string;
}) {
  return (
    <div className={className ? `figure ${className}` : "figure"}>
      {src ? <img src={src} alt={alt} /> : null}
      {mark ? (
        <div className="figure__marks">
          <Mark text={mark} light />
          <hr className="rule" />
        </div>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <div className="site-surface">
        <Header />

        <section className="hero" id="top">
          <div className="hero__bg" aria-hidden="true">
            <Image
              className="hero__photo"
              src={heroPhoto}
              alt=""
              fill
              priority
              sizes="100vw"
              placeholder="blur"
            />
          </div>
          <div className="hero__scrim" aria-hidden="true" />

          <div className="hero__inner shell">
            <div className="hero__copy">
              <h1>
                Websites built around <em>you.</em>
              </h1>
              <hr className="rule rule--tight" />
              <p className="tag">Strategic. Clean. Built to last.</p>
              <p className="hero__lede">
                I design and build websites for people who need one — storage
                facilities, counseling practices, ABA centers, coaches, course
                creators, and more. Every site is built around what your business
                actually needs, not a template with the name swapped out.
              </p>
              <p className="hero__seo">
                I don&rsquo;t do SEO. If ranking on Google is your main goal,
                I&rsquo;ll tell you straight and point you toward someone who does.
              </p>
              <div className="hero__cta">
                <a className="btn" href="#contact">
                  Let&rsquo;s Build Yours <Arrow />
                </a>
              </div>
              <div className="hero__foot">
                <hr className="rule" />
                <p className="tag">Ideas to real impact</p>
              </div>
            </div>

            <div className="hero__frame" aria-hidden="true" />
          </div>

          <div className="hero__marks" aria-hidden="true">
            <div>
              <Mark text="A clearer online presence" />
              <hr className="rule" />
            </div>
            <div>
              <Mark text="Built for what's next" />
              <hr className="rule" />
            </div>
          </div>
        </section>

        <PricingTicker />

        <main>
          <section className="section section--cream" id="pricing">
            <div className="shell">
              <div className="head-split">
                <h2>What it costs</h2>
                <p className="head-split__intro">
                  Floors, not fixed prices. Every site includes up to five rounds
                  of revisions before launch. After that, changes are priced per
                  request — if your business changes, I&rsquo;ll change the site.
                </p>
              </div>

              <ul className="tiers">
                {tiers.map((tier, i) => (
                  <li className="tier" key={tier.name}>
                    <h3 className="tier__name">{tier.name}</h3>
                    <p className="tier__price">
                      From <strong>${tier.price}</strong>
                    </p>
                    <ul className="tier__includes">
                      {tier.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                    <span className="tier__rule" aria-hidden="true" />
                    <span className="tier__num" aria-hidden="true">
                      0{i + 1}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="split section--light" id="timeline">
            <div className="split__copy">
              <h2>How long it takes</h2>
              <hr className="rule" />
              <p className="split__lede">How fast this goes is mostly up to you.</p>
              <p className="split__body">
                If you have your text, logo, photos, and logins ready, I can have a
                site running in about a week. If you don&rsquo;t, that&rsquo;s
                completely fine — but that&rsquo;s where the time goes. The
                building isn&rsquo;t the slow part.
              </p>
            </div>
            <Figure
              src={PHOTOS.timeline}
              alt=""
              className="split__figure"
              mark="Good ideas deserve a great home"
            />
          </section>

          <section className="section section--cream" id="needs">
            <div className="shell">
              <div className="head-split">
                <h2>What I need from you</h2>
              </div>

              <div className="needs-grid">
                <ul className="needs">
                  {needs.map(([label, detail], i) => (
                    <li key={label}>
                      <span className="needs__num" aria-hidden="true">
                        0{i + 1}
                      </span>
                      <span>
                        <span className="needs__label">{label}</span>
                        {detail ? (
                          <span className="muted"> — {detail}</span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="aside">
                  <p>
                    Don&rsquo;t worry if you don&rsquo;t have all of this yet. Tell
                    me where you&rsquo;re at and we&rsquo;ll work it out.
                  </p>
                  <div className="aside__media">
                    <Figure src={PHOTOS.aside} alt="" className="aside__figure" />
                    <div className="aside__mark">
                      <Mark text="Simple inputs mean a smoother build" />
                      <hr className="rule" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="section section--light" id="contact">
            <div className="shell">
              <div className="contact-grid">
                <div>
                  <h2>Tell me what you need</h2>
                  <p className="contact__body">
                    Tell me roughly what you need and I&rsquo;ll get back to you
                    within two working days. We can talk through the details after
                    — I&rsquo;d rather have a conversation than make you fill out a
                    questionnaire.
                  </p>
                  <p className="contact__like">I like doing this.</p>
                </div>

                <div className="contact__actions">
                  <a className="btn" href={`mailto:${CONTACT_EMAIL}`}>
                    Start the Conversation <Arrow />
                  </a>
                  <a
                    className="contact__mail link"
                    href={`mailto:${CONTACT_EMAIL}`}
                  >
                    <MailIcon />
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <TidalRevealFooter />
    </>
  );
}
