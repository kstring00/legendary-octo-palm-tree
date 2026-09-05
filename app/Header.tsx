"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Header.module.css";

const NAV = [
  { label: "Home", href: "#top" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#timeline" },
  { label: "Contact", href: "#contact" },
];

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

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    lastY.current = window.scrollY;
    let queued = false;

    const update = () => {
      queued = false;
      const y = window.scrollY;
      const delta = y - lastY.current;

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

  const onFocusCapture = () => setHidden(false);

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

  const onNavPointerMove = (event: React.PointerEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    event.currentTarget.style.setProperty("--mouse-x", `${x}%`);
  };

  return (
    <header
      className={`${styles.masthead}${hidden ? ` ${styles.hidden}` : ""}`}
      onFocusCapture={onFocusCapture}
    >
      <div className={styles.bar}>
        <a className={styles.brand} href="#top" aria-label="Kyle Stringham, home">
          <span className={styles.monogramShell} aria-hidden="true">
            <span className={styles.monogram}>KS</span>
          </span>
          <span className={styles.brandRule} aria-hidden="true" />
          <span className={styles.brandCopy}>
            <span className={styles.name}>Kyle Stringham</span>
            <span className={styles.role}>Web design &amp; development</span>
          </span>
        </a>

        <nav className={styles.nav} aria-label="Sections">
          {NAV.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.label}
                href={item.href}
                className={`${styles.navLink}${isActive ? ` ${styles.active}` : ""}`}
                aria-current={isActive ? "page" : undefined}
                onPointerMove={onNavPointerMove}
              >
                <span className={styles.navTextWrap}>
                  <span className={styles.navText}>{item.label}</span>
                  <span className={styles.navTextGhost} aria-hidden="true">
                    {item.label}
                  </span>
                </span>
              </a>
            );
          })}
        </nav>

        <div className={styles.end}>
          <span className={styles.endRule} aria-hidden="true" />
          <a className={styles.getStarted} href="#contact">
            <span>Start a Project</span>
            <span className={styles.arrowShell} aria-hidden="true">
              <Arrow />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
