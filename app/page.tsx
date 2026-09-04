// TODO: replace with the real address before this goes to a custom domain.
const CONTACT_EMAIL = "you@example.com";

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

export default function Home() {
  return (
    <>
      <main>
        {/* 1 — What I do */}
        <section className="section hero">
          <div className="inner">
            <p className="hero__name">Kyle Stringham</p>
            <h1>I build websites for people who need one.</h1>
            <p className="lede">
              Storage facilities, counseling practices, ABA centers, people
              selling their own course material — I&rsquo;ve built for all of
              them. Every site gets built around what that business actually
              needs, not a template with the name swapped out.
            </p>
            <p className="muted">
              I don&rsquo;t do SEO. If ranking on Google is your main goal,
              I&rsquo;ll tell you straight and point you toward someone who
              does.
            </p>
            <p className="muted">I like doing this.</p>
          </div>
        </section>

        {/* 2 — What it costs */}
        <section className="section section--warm">
          <div className="inner">
            <div className="section__head">
              <hr className="rule" />
              <h2>What it costs</h2>
            </div>

            <ul className="tiers">
              {tiers.map((tier) => (
                <li className="tier" key={tier.name}>
                  <h3 className="tier__name">{tier.name}</h3>
                  <p className="tier__price">
                    <span className="tier__from">from </span>
                    <strong>${tier.price}</strong>
                  </p>
                  <ul className="tier__includes">
                    {tier.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="note">
              <p>
                Every site includes up to five rounds of revisions before
                launch. After that, changes are priced per request — if your
                business changes, I&rsquo;ll change the site.
              </p>
            </div>
          </div>
        </section>

        {/* 3 — How long it takes */}
        <section className="section">
          <div className="inner">
            <div className="section__head">
              <hr className="rule" />
              <h2>How long it takes</h2>
            </div>
            <p className="lede">How fast this goes is mostly up to you.</p>
            <p className="muted">
              If you have your text, logo, photos, and logins ready, I can have
              a site running in about a week. If you don&rsquo;t, that&rsquo;s
              completely fine — but that&rsquo;s where the time goes. The
              building isn&rsquo;t the slow part.
            </p>
          </div>
        </section>

        {/* 4 — What I need from you */}
        <section className="section section--warm">
          <div className="inner">
            <div className="section__head">
              <hr className="rule" />
              <h2>What I need from you</h2>
            </div>

            <ul className="needs">
              {needs.map(([label, detail]) => (
                <li key={label}>
                  <strong>{label}</strong>
                  {detail ? <span className="muted"> — {detail}</span> : null}
                </li>
              ))}
            </ul>

            <div className="note">
              <p>
                Don&rsquo;t worry if you don&rsquo;t have all of this yet. Tell
                me where you&rsquo;re at and we&rsquo;ll work it out.
              </p>
            </div>
          </div>
        </section>

        {/* 5 — Get in touch */}
        <section className="section" id="contact">
          <div className="inner">
            <div className="section__head">
              <hr className="rule" />
              <h2>Tell me what you need</h2>
            </div>
            <p className="contact__lede">
              Tell me roughly what you need and I&rsquo;ll get back to you
              within two working days. We can talk through the details after —
              I&rsquo;d rather have a conversation than make you fill out a
              questionnaire.
            </p>
            <p>
              <a className="contact__mail" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="inner">
          <p>Kyle Stringham</p>
        </div>
      </footer>
    </>
  );
}
