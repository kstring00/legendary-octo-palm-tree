import Image from "next/image";

import AIIntakeSection from "./AIIntakeSection";
import BottomCapture from "./BottomCapture";
import Header from "./Header";
import PricingTicker from "./PricingTicker";
import SiteMotion from "./SiteMotion";
import TimelineShowcase from "./TimelineShowcase";
import pricingStyles from "./PricingShowcase.module.css";

import heroPhoto from "./hero.png";

const tiers = [
  {
    name: "Focused Site",
    price: "1,125",
    description:
      "For a business that needs a strong, polished web presence without a large build.",
    includes: [
      "Focused page structure and content direction",
      "Custom responsive design for desktop, tablet, and phone",
      "Primary contact form or conversion call-to-action",
      "Domain launch and up to three revision rounds",
    ],
  },
  {
    name: "Custom Business Site",
    price: "2,050",
    description:
      "Multi-page design built around the business, audience, and conversion goals.",
    includes: [
      "Multi-page information architecture and custom visual direction",
      "Responsive layouts built around your audience and goals",
      "Forms and practical integrations scoped to the project",
      "Domain launch and up to three revision rounds",
    ],
  },
  {
    name: "Advanced Build",
    price: "3,750",
    description:
      "Custom functionality, integrations, AI, portals, databases, payments, or more complex workflows.",
    includes: [
      "Custom feature planning and technical architecture",
      "AI, databases, portals, payments, or advanced integrations as needed",
      "Responsive front-end design plus back-end implementation",
      "Testing, launch support, and up to three revision rounds",
    ],
  },
];

function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
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

export default function Home() {
  return (
    <>
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
        <section className={`section ${pricingStyles.pricing}`} id="pricing">
          <div className={`shell ${pricingStyles.inner}`}>
            <div className={pricingStyles.header}>
              <div className={pricingStyles.titleBlock}>
                <span className={pricingStyles.eyebrow}>Pricing</span>
                <h2>What it costs</h2>
              </div>
              <p className={pricingStyles.intro}>
                Floors, not fixed prices. Every project includes up to three
                revision rounds before launch. After that, changes are priced
                per request — if your business changes, I&rsquo;ll change the site.
              </p>
            </div>

            <ul className={`tiers ${pricingStyles.cards}`}>
              {tiers.map((tier, i) => (
                <li className={`tier ${pricingStyles.card}`} key={tier.name}>
                  <h3 className="tier__name">{tier.name}</h3>
                  <p className="tier__price">
                    From <strong>${tier.price}</strong>
                  </p>
                  <p className="tier__description">{tier.description}</p>
                  <ul className="tier__includes">
                    {tier.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <span className="tier__num" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <a className={pricingStyles.cardCta} href="#contact">
                    <span>Start your project</span>
                    <span className={pricingStyles.cardCtaIcon}>
                      <Arrow />
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className={pricingStyles.brandLine} aria-hidden="true">
              <span>Built around you</span>
              <span>KS / Digital</span>
            </div>
          </div>
        </section>

        <TimelineShowcase />
        <AIIntakeSection />
        <BottomCapture />
      </main>

      <SiteMotion />
    </>
  );
}
