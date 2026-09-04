"use client";

import { useEffect, useRef } from "react";
import styles from "./Shoreline.module.css";

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export default function Shoreline() {
  const shorelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shoreline = shorelineRef.current;
    if (!shoreline) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let lastScrollY = window.scrollY;
    let retreatTimer: number | undefined;
    let raf = 0;

    const distanceFromBottom = () =>
      document.documentElement.scrollHeight -
      (window.scrollY + window.innerHeight);

    const restingHeight = () => {
      const distance = distanceFromBottom();
      const proximity = clamp((180 - distance) / 180);
      return Math.round(proximity * 18);
    };

    const setHeight = (height: number, energy = 0) => {
      shoreline.style.setProperty("--tide-height", `${Math.max(0, height)}px`);
      shoreline.style.setProperty("--tide-energy", `${clamp(energy)}`);
    };

    const retreat = (delay = 520) => {
      window.clearTimeout(retreatTimer);
      retreatTimer = window.setTimeout(() => {
        setHeight(restingHeight(), 0);
      }, delay);
    };

    const surge = (strength = 1) => {
      const lift = 68 + 72 * clamp(strength);
      setHeight(lift, strength);
      retreat(680 + strength * 180);
    };

    const onScroll = () => {
      if (raf) return;

      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const currentY = window.scrollY;
        const distance = distanceFromBottom();
        const isNearBottom = distance < 120;
        const movedUp = currentY < lastScrollY - 2;

        if (isNearBottom && movedUp) {
          surge(0.72);
        } else if (!isNearBottom) {
          setHeight(restingHeight(), 0);
        } else if (!retreatTimer) {
          setHeight(restingHeight(), 0);
        }

        lastScrollY = currentY;
      });
    };

    const onWheel = (event: WheelEvent) => {
      const distance = distanceFromBottom();
      if (distance > 10) return;

      // At the end of the page, another push downward makes the tide run up
      // the shore. Reversing direction gives a smaller answering wash.
      if (event.deltaY > 6) {
        surge(clamp(Math.abs(event.deltaY) / 95, 0.62, 1));
      } else if (event.deltaY < -6) {
        surge(0.66);
      }
    };

    const onResize = () => setHeight(restingHeight(), 0);

    setHeight(restingHeight(), 0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(retreatTimer);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={shorelineRef} className={styles.shoreline} aria-hidden="true">
      <svg
        className={styles.water}
        viewBox="0 0 1600 220"
        preserveAspectRatio="none"
        role="presentation"
      >
        <defs>
          <linearGradient id="tide-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#28445b" stopOpacity="0.76" />
            <stop offset="38%" stopColor="#112d43" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#061827" stopOpacity="0.98" />
          </linearGradient>
          <linearGradient id="tide-water-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5b7180" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#0a2032" stopOpacity="0.76" />
          </linearGradient>
          <linearGradient id="tide-foam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#b78e4b" stopOpacity="0" />
            <stop offset="18%" stopColor="#e7cb91" stopOpacity="0.78" />
            <stop offset="50%" stopColor="#fff2c7" stopOpacity="1" />
            <stop offset="82%" stopColor="#d7ae65" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#a77c39" stopOpacity="0" />
          </linearGradient>
          <filter id="tide-glow" x="-20%" y="-300%" width="140%" height="700%">
            <feGaussianBlur stdDeviation="3.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className={styles.backWave}>
          <path
            d="M-120 96 C90 58 250 118 430 88 C610 56 790 112 970 80 C1160 48 1340 111 1720 68 L1720 230 L-120 230 Z"
            fill="url(#tide-water-back)"
          />
        </g>

        <g className={styles.frontWave}>
          <path
            d="M-120 112 C90 78 270 124 455 93 C638 61 806 122 992 91 C1172 61 1370 119 1720 82 L1720 230 L-120 230 Z"
            fill="url(#tide-water)"
          />
          <path
            className={styles.foamGlow}
            d="M-120 112 C90 78 270 124 455 93 C638 61 806 122 992 91 C1172 61 1370 119 1720 82"
            fill="none"
            stroke="url(#tide-foam)"
            strokeWidth="5"
            strokeLinecap="round"
            filter="url(#tide-glow)"
          />
          <path
            className={styles.foamLine}
            d="M-120 112 C90 78 270 124 455 93 C638 61 806 122 992 91 C1172 61 1370 119 1720 82"
            fill="none"
            stroke="#f3dca7"
            strokeOpacity="0.72"
            strokeWidth="1.15"
            strokeLinecap="round"
          />
        </g>
      </svg>

      <div className={styles.reflection} />
    </div>
  );
}
