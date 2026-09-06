"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./PricingConfigurator.module.css";
import compact from "./PricingConfiguratorCompact.module.css";

type TierId = "focused" | "business" | "advanced";
type AddOnId =
  | "clarity"
  | "extra-page"
  | "copy-polish"
  | "booking-flow"
  | "intake-flow"
  | "cms"
  | "crm"
  | "automation"
  | "payments"
  | "ai"
  | "portal"
  | "revision";
type CareId = "none" | "launch" | "growth";

const tiers = [
  {
    id: "focused" as TierId,
    name: "Focused Site",
    price: 1250,
    kicker: "A strong start online",
    description: "A polished, conversion-ready site for a business that needs to look credible and start generating inquiries.",
    recommended: false,
  },
  {
    id: "business" as TierId,
    name: "Custom Business Site",
    price: 2000,
    kicker: "Recommended",
    description: "A multi-page business site with the structure, lead capture, analytics and integrations needed to actively support growth.",
    recommended: true,
  },
  {
    id: "advanced" as TierId,
    name: "Advanced Build",
    price: 3500,
    kicker: "Website + business systems",
    description: "For businesses that need custom functionality such as portals, databases, payments, automations or AI-assisted experiences.",
    recommended: false,
  },
] as const;

const featureGroups = [
  {
    label: "Foundation included",
    note: "Everything needed for a professional, high-performing launch.",
    rows: [
      ["Custom visual direction tailored to the business", true, true, true],
      ["Responsive build for desktop, tablet and phone", true, true, true],
      ["Conversion CTA plus contact or inquiry flow", true, true, true],
      ["Foundational on-page SEO and metadata", true, true, true],
      ["Domain connection, launch support and 3 revision rounds", true, true, true],
    ],
  },
  {
    label: "Added in Custom Business",
    note: "The site becomes a more capable sales and lead-generation asset.",
    rows: [
      ["Up to 5 strategically structured core pages", false, true, true],
      ["Messaging and content-structure guidance", false, true, true],
      ["Custom lead capture or intake flow", false, true, true],
      ["CMS / editable content capability", false, true, true],
      ["CRM or email-platform integration", false, true, true],
      ["Microsoft Clarity installation and event-ready analytics", false, true, true],
    ],
  },
  {
    label: "Advanced systems",
    note: "Architecture for custom workflows and functionality beyond a standard marketing site.",
    rows: [
      ["Custom back-end or database architecture", false, false, true],
      ["Secure portal, member area or gated experience", false, false, true],
      ["Payments, subscriptions or custom checkout flow", false, false, true],
      ["Workflow automation and third-party integrations", false, false, true],
      ["AI-assisted features or custom internal tools", false, false, true],
    ],
  },
] as const;

const addOns = [
  { id: "clarity" as AddOnId, name: "Microsoft Clarity setup", price: 150, note: "Session recordings, heatmaps and analytics configured correctly." },
  { id: "extra-page" as AddOnId, name: "Additional page", price: 250, note: "A fully designed and responsive page added to your selected build." },
  { id: "copy-polish" as AddOnId, name: "Copy & content polish", price: 350, note: "Tighten hierarchy, calls to action and key sales messaging." },
  { id: "booking-flow" as AddOnId, name: "Booking flow integration", price: 250, note: "Scheduling embedded into the experience instead of sending visitors away." },
  { id: "intake-flow" as AddOnId, name: "Advanced intake flow", price: 550, note: "Conditional questions, qualification logic or structured onboarding." },
  { id: "cms" as AddOnId, name: "Blog / CMS module", price: 1200, note: "Content schema, templates, and an editing interface your team can actually use without me." },
  { id: "crm" as AddOnId, name: "CRM / email integration", price: 450, note: "Route qualified leads into the system you already use." },
  { id: "automation" as AddOnId, name: "Workflow automation", price: null, note: "Remove repetitive handoffs with a focused automated workflow." },
  { id: "payments" as AddOnId, name: "Payments / checkout", price: 1200, note: "Stripe integration with webhooks, failed-payment handling, and access syncing — not just a checkout button." },
  { id: "ai" as AddOnId, name: "AI-assisted feature", price: null, note: "A focused AI experience designed around a real business use case." },
  { id: "portal" as AddOnId, name: "Client portal foundation", price: 2500, note: "Authentication, database, per-client data separation, and an admin area. This is a small application, scoped individually." },
  { id: "revision" as AddOnId, name: "Additional revision round", price: 250, note: "One additional consolidated revision cycle beyond the 3 included rounds." },
] as const;

const carePlans = [
  { id: "none" as CareId, name: "No care plan", monthly: 0, note: "Launch handoff only. Future work is quoted as requested." },
  { id: "launch" as CareId, name: "Launch Care", monthly: 95, note: "Hosting support, dependency updates, uptime checks and small fixes." },
  { id: "growth" as CareId, name: "Growth Care", monthly: 195, note: "Launch Care plus Clarity review, site-health checks and one small content update each month." },
] as const;

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

export default function PricingConfigurator() {
  const [tierId, setTierId] = useState<TierId>("business");
  const [selectedAddOns, setSelectedAddOns] = useState<AddOnId[]>([]);
  const [careId, setCareId] = useState<CareId>("none");
  const [showFeatures, setShowFeatures] = useState(false);
  const [expandedAddOn, setExpandedAddOn] = useState<AddOnId | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");

  const tier = tiers.find((item) => item.id === tierId) ?? tiers[1];
  const care = carePlans.find((item) => item.id === careId) ?? carePlans[0];
  const chosenAddOns = addOns.filter((item) => selectedAddOns.includes(item.id));
  const hasConsultationPricedItems = chosenAddOns.some((item) => item.price === null);
  const projectFloor = useMemo(
    () => tier.price + chosenAddOns.reduce((sum, item) => sum + (item.price ?? 0), 0),
    [tier, chosenAddOns],
  );

  function toggleAddOn(id: AddOnId) {
    setSelectedAddOns((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  async function submitQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");

    const data = new FormData(event.currentTarget);
    const payload = {
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      business: String(data.get("business") || ""),
      notes: String(data.get("notes") || ""),
      website: String(data.get("website") || ""),
      tierId,
      addOnIds: selectedAddOns,
      careId,
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok?: boolean; error?: string; reference?: string };
      if (!response.ok || !result.ok) throw new Error(result.error || "I couldn’t send that configuration just now.");
      setReference(result.reference || "");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "I couldn’t send that configuration just now.");
    }
  }

  return (
    <section className={`${styles.pricing} ${compact.pricing}`} id="pricing">
      <div className={styles.shell}>
        <div className={`${styles.header} ${compact.header}`}>
          <div>
            <span className={styles.eyebrow}>Pricing</span>
            <h2>Build your website.</h2>
          </div>
          <div className={styles.headerCopy}>
            <strong>Start with the right foundation, then configure what your business actually needs.</strong>
            <p>These are project floors, not checkout prices. Pick a package, add individual systems, then send me the build. I review it like a configured order and return a tailored quote.</p>
          </div>
        </div>

        <div className={`${styles.comparisonWrap} ${compact.comparisonWrap}`}>
          <div className={`${styles.comparisonHeader} ${compact.comparisonHeader}`}>
            {tiers.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`${styles.tierHead} ${compact.tierHead} ${tierId === item.id ? styles.tierHeadSelected : ""} ${item.recommended ? styles.tierHeadRecommended : ""}`}
                onClick={() => setTierId(item.id)}
                aria-pressed={tierId === item.id}
              >
                {item.recommended && <span className={styles.recommended}>Recommended</span>}
                <span className={styles.tierKicker}>{item.kicker}</span>
                <strong>{item.name}</strong>
                <span className={styles.tierPrice}>from {money(item.price)}</span>
                <small>{item.description}</small>
                <span className={styles.selectLabel}>{tierId === item.id ? "Selected" : "Select build"}</span>
              </button>
            ))}
          </div>

          <button
            type="button"
            className={compact.compareToggle}
            onClick={() => setShowFeatures((current) => !current)}
            aria-expanded={showFeatures}
            aria-controls="pricing-feature-table"
          >
            <span>{showFeatures ? "Hide feature comparison" : "Compare all features"}</span>
            <span className={showFeatures ? compact.toggleArrowOpen : compact.toggleArrow} aria-hidden="true">→</span>
          </button>

          {showFeatures && (
            <div className={compact.featureScroller} id="pricing-feature-table">
              <div className={styles.featureTable}>
                {featureGroups.map((group) => (
                  <div className={styles.featureGroup} key={group.label}>
                    <div className={styles.groupLabel}>
                      <span>{group.label}</span>
                      <small>{group.note}</small>
                    </div>
                    {group.rows.map(([label, focused, business, advanced]) => (
                      <div className={styles.featureRow} key={label}>
                        <span className={styles.featureName}>{label}</span>
                        {[focused, business, advanced].map((included, index) => (
                          <span className={styles.featureCell} key={`${label}-${index}`} aria-label={included ? "Included" : "Not included"}>
                            {included ? <b>✓</b> : <i>—</i>}
                          </span>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <p className={styles.scopeNote}>Advanced features are scoped to the actual build. The $3,500 figure is an entry floor, not a promise that every advanced system above is included at that price.</p>
            </div>
          )}
        </div>

        <div className={`${styles.configureHeader} ${compact.configureHeader}`}>
          <div>
            <span className={styles.eyebrow}>Configure your build</span>
            <h3>Make it yours.</h3>
          </div>
          <p>Think of these like options on a vehicle. Add only what solves a real problem. You do not have to move into a larger package just to request one specific capability.</p>
        </div>

        <div className={`${styles.builderGrid} ${compact.builderGrid}`}>
          <div className={`${styles.optionsColumn} ${compact.optionsColumn}`}>
            <div className={`${styles.optionSection} ${compact.optionSection}`}>
              <div className={`${styles.optionTitleRow} ${compact.optionTitleRow}`}>
                <div>
                  <span>01</span>
                  <h4>Add-ons</h4>
                </div>
                <p>Starting prices. Final scope is confirmed before work begins.</p>
              </div>

              <div className={compact.addOnGrid}>
                {addOns.map((item) => {
                  const checked = selectedAddOns.includes(item.id);
                  const expanded = expandedAddOn === item.id;
                  return (
                    <div className={`${compact.addOnRow} ${checked ? compact.addOnRowSelected : ""}`} key={item.id}>
                      <button
                        type="button"
                        className={compact.addOnSelect}
                        onClick={() => toggleAddOn(item.id)}
                        aria-pressed={checked}
                        title={item.note}
                      >
                        <strong>{item.name}</strong>
                        <span className={`${compact.addOnPrice} ${item.price === null ? compact.addOnPriceQuoted : ""}`}>
                          {item.price === null ? "Quoted after consultation" : `from ${money(item.price)}`}
                        </span>
                        <span className={compact.addOnCheck}>{checked ? "✓" : "+"}</span>
                      </button>
                      <button
                        type="button"
                        className={compact.addOnDetails}
                        onClick={() => setExpandedAddOn(expanded ? null : item.id)}
                        aria-expanded={expanded}
                        aria-controls={`addon-note-${item.id}`}
                        aria-label={`${expanded ? "Hide" : "Show"} details for ${item.name}`}
                      >
                        i
                      </button>
                      {expanded && (
                        <p className={compact.addOnNote} id={`addon-note-${item.id}`}>{item.note}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={`${styles.optionSection} ${compact.optionSection}`}>
              <div className={`${styles.optionTitleRow} ${compact.optionTitleRow}`}>
                <div>
                  <span>02</span>
                  <h4>Care plan</h4>
                </div>
                <p>Optional ongoing support after launch.</p>
              </div>
              <div className={`${styles.careGrid} ${compact.careGrid}`}>
                {carePlans.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className={`${styles.careCard} ${compact.careCard} ${careId === item.id ? styles.careCardSelected : ""}`}
                    onClick={() => setCareId(item.id)}
                    aria-pressed={careId === item.id}
                  >
                    <span className={styles.radio} />
                    <strong>{item.name}</strong>
                    <span className={styles.carePrice}>{item.monthly ? `${money(item.monthly)}/mo` : "No monthly fee"}</span>
                    <small>{item.note}</small>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <aside className={`${styles.cart} ${compact.cart}`} aria-label="Configured quote summary">
            <div className={styles.cartTopline}>
              <span>Your build</span>
              <span>{1 + chosenAddOns.length + (care.monthly ? 1 : 0)} item{1 + chosenAddOns.length + (care.monthly ? 1 : 0) === 1 ? "" : "s"}</span>
            </div>

            <div className={styles.cartPackage}>
              <small>Base package</small>
              <div>
                <strong>{tier.name}</strong>
                <span>{money(tier.price)}</span>
              </div>
            </div>

            {chosenAddOns.length > 0 && (
              <div className={styles.cartLines}>
                <small>Configured options</small>
                {chosenAddOns.map((item) => (
                  <div className={styles.cartLine} key={item.id}>
                    <span>{item.name}</span>
                    <strong className={item.price === null ? compact.cartQuoted : undefined}>
                      {item.price === null ? "Quoted after consultation" : `+${money(item.price)}`}
                    </strong>
                  </div>
                ))}
                {hasConsultationPricedItems && (
                  <p className={compact.consultationNote}>Includes items scoped after consultation.</p>
                )}
              </div>
            )}

            <div className={styles.cartTotal}>
              <small>Estimated project floor</small>
              <strong>{money(projectFloor)}+</strong>
              <span>Final pricing follows a scope review.</span>
            </div>

            <div className={styles.monthlyLine}>
              <span>Ongoing care</span>
              <strong>{care.monthly ? `${money(care.monthly)}/mo` : "Not selected"}</strong>
            </div>

            {!showForm && status !== "sent" && (
              <button type="button" className={styles.primaryCta} onClick={() => setShowForm(true)}>
                <span>Review & send build</span>
                <b>→</b>
              </button>
            )}

            {showForm && status !== "sent" && (
              <form className={styles.quoteForm} onSubmit={submitQuote}>
                <div className={styles.formHeading}>
                  <strong>Where should I send the quote?</strong>
                  <button type="button" onClick={() => setShowForm(false)} aria-label="Close quote form">×</button>
                </div>
                <label>
                  <span>Name</span>
                  <input name="name" autoComplete="name" required />
                </label>
                <label>
                  <span>Email</span>
                  <input name="email" type="email" autoComplete="email" required />
                </label>
                <div className={styles.formSplit}>
                  <label>
                    <span>Business</span>
                    <input name="business" autoComplete="organization" />
                  </label>
                  <label>
                    <span>Phone</span>
                    <input name="phone" type="tel" autoComplete="tel" />
                  </label>
                </div>
                <label>
                  <span>Anything I should know?</span>
                  <textarea name="notes" rows={3} placeholder="Deadline, must-have feature, existing site, context…" />
                </label>
                <label className={styles.honeypot} aria-hidden="true">
                  Website
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                {status === "error" && <p className={styles.formError}>{error}</p>}
                <button className={styles.primaryCta} type="submit" disabled={status === "sending"}>
                  <span>{status === "sending" ? "Sending configuration…" : "Send configuration for quote"}</span>
                  <b>→</b>
                </button>
                <p className={styles.formFinePrint}>This is not a checkout or binding estimate. I review the configuration personally and send back a scoped proposal.</p>
              </form>
            )}

            {status === "sent" && (
              <div className={styles.success}>
                <span className={styles.successMark}>✓</span>
                <strong>Configuration received.</strong>
                <p>I have the build you configured. I’ll review the scope and send a tailored quote to your email.</p>
                {reference && <small>Reference {reference}</small>}
              </div>
            )}

            <p className={styles.cartFoot}>No card required. No automatic purchase. You are building a quote request, not checking out.</p>
          </aside>
        </div>

        <div className={styles.brandLine} aria-hidden="true">
          <span>Built around your business</span>
          <span>Strategy / Design / Development / Growth</span>
        </div>
      </div>
    </section>
  );
}
