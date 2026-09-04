"use client";

import { useEffect, useRef, useState } from "react";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

/** Reveal threshold in px — small enough to feel immediate, large enough that
 *  trackpad jitter and iOS rubber-banding don't flicker the bar. */
const DELTA = 6;

function Arrow() {
  return (
    <svg width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden="true">
      <path d="M0 5h16M12 1l4 4-4 4" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>(NAV[0].href);
  const lastY = useRef(0);

  // Hide on scroll down, reveal on scroll up.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    lastY.current = window.scrollY;
    let queued = false;

    const update = () => {
      queued = false;
      const y = window.scrollY;
      const delta = y - lastY.current;

      // Never hide at the top of the page, and never hide for anyone who has
      // asked for reduced motion.
      if (y < 96 || reduced.matches) setHidden(false);
      else if (delta > DELTA) setHidden(true);
      else if (delta < -DELTA) setHidden(false);

      lastY.current = y;
    };

    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A hidden bar is translated off-screen, not removed, so its links stay
  // focusable — bring it back when focus lands inside it.
  const onFocusCapture = () => setHidden(false);

  // Mark the section currently under the middle of the viewport.
  useEffect(() => {
    const targets = NAV.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => el !== null,
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.id) {
            setActive(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={hidden ? "masthead is-hidden" : "masthead"}
      onFocusCapture={onFocusCapture}
    >
      <div className="masthead__bar">
        <a className="masthead__brand" href="#top">
          <span className="masthead__monogram" aria-hidden="true">
            KS
          </span>
          <span className="masthead__divider" aria-hidden="true" />
          <span className="masthead__name">Kyle Stringham</span>
        </a>

        <nav className="masthead__nav" aria-label="Sections">
          {NAV.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={isActive ? "is-active" : undefined}
                aria-current={isActive ? "true" : undefined}
              >
                {item.label}
                <span className="masthead__dot" aria-hidden="true" />
              </a>
            );
          })}
        </nav>

        <div className="masthead__end">
          <span className="masthead__divider" aria-hidden="true" />
          <a className="btn btn--gold" href="#contact">
            Get Started <Arrow />
          </a>
        </div>
      </div>
    </header>
  );
}
