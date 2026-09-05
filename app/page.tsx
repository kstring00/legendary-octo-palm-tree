import AIIntakeSection from "./AIIntakeSection";
import BottomCapture from "./BottomCapture";
import Header from "./Header";
import HeroShowcase from "./HeroShowcase";
import PricingTicker from "./PricingTicker";
import SiteMotion from "./SiteMotion";
import TimelineShowcase from "./TimelineShowcase";
import pricingStyles from "./PricingShowcase.module.css";

const tiers = [
  {
    name: "Focused Site",
    price: "1,250",
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
    price: "2,000",
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
    price: "3,500",
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

export default function Home() {
  return (
    <>
      <Header />
      <HeroShowcase />
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
