"use client";

import { useEffect, useRef, useState } from "react";

import styles from "./RetroCRT.module.css";

type Channel = {
  label: string;
  src: string | null;
  alt: string;
};

const channels: Channel[] = [
  {
    label: "Common Ground",
    src: "/hero-crt/common-ground.png",
    alt: "Common Ground homepage showing autism support resources for Texas families",
  },
  {
    label: "BCBA Prep",
    src: "/hero-crt/bcba-prep.png",
    alt: "BCBA Prep study library homepage showing the nine BCBA exam domains",
  },
];

function MonitorFrame() {
  return (
    <svg
      className={styles.frame}
      viewBox="0 0 620 480"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <g stroke="currentColor" strokeWidth="1.35" vectorEffect="non-scaling-stroke">
        {/* Chassis depth sits on the right so the screen faces back toward the copy. */}
        <path d="M486 58 566 92v286l-80 42" />
        <path d="M510 74 590 106v244l-80 51" opacity=".68" />
        <path d="M486 58h-14M486 420h-14" opacity=".75" />

        <rect x="34" y="40" width="480" height="382" rx="14" />
        <rect x="46" y="52" width="456" height="356" rx="10" opacity=".68" />

        <path d="M70 78h372l24 20v238l-24 22H70L56 344V92L70 78Z" />
        <path d="M82 91h346l21 17v216l-21 19H82l-12-11V102L82 91Z" opacity=".72" />

        <path d="M56 374h414" opacity=".62" />
        <path d="M82 422v17h70l7-17M393 422l8 17h68v-17" opacity=".72" />

        <circle cx="431" cy="391" r="12" />
        <circle cx="467" cy="391" r="12" />
        <path d="M431 374v8M467 374v8" opacity=".75" />
      </g>
    </svg>
  );
}

function PowerGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v8" />
      <path d="M7.5 6.8a7 7 0 1 0 9 0" />
    </svg>
  );
}

export default function RetroCRT() {
  const [activeChannel, setActiveChannel] = useState(0);
  const [booting, setBooting] = useState(false);
  const bootTimer = useRef<number | null>(null);
  const channel = channels[activeChannel];

  useEffect(() => {
    return () => {
      if (bootTimer.current !== null) window.clearTimeout(bootTimer.current);
    };
  }, []);

  const runBoot = () => {
    if (typeof window === "undefined") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setBooting(false);
      return;
    }

    if (bootTimer.current !== null) window.clearTimeout(bootTimer.current);

    setBooting(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setBooting(true);
        bootTimer.current = window.setTimeout(() => {
          setBooting(false);
          bootTimer.current = null;
        }, 1220);
      });
    });
  };

  return (
    <div className={styles.crt}>
      <div className={styles.monitorRig}>
        <div className={styles.monitorStage}>
          <div
            className={`${styles.screen} ${booting ? styles.booting : ""}`}
            aria-live="polite"
            aria-label={`${channel.label} website preview`}
          >
            <div className={styles.screenContent} key={channel.label}>
              {channel.src ? (
                <img
                  className={styles.scrollImage}
                  src={channel.src}
                  alt={channel.alt}
                  loading={activeChannel === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              ) : (
                <div className={styles.pendingScreen} role="img" aria-label={channel.alt}>
                  <span>{String(activeChannel + 1).padStart(2, "0")}</span>
                  <strong>{channel.label}</strong>
                  <small>Screenshot ready to drop in</small>
                </div>
              )}
            </div>

            <span className={styles.bootLine} aria-hidden="true" />
            <span className={styles.flicker} aria-hidden="true" />
            <span className={styles.screenTreatment} aria-hidden="true" />
          </div>

          <MonitorFrame />
        </div>

        <div className={styles.controlDeck} aria-label="Project preview controls">
          <div
            className={styles.switches}
            style={{ gridTemplateColumns: `repeat(${channels.length}, minmax(0, 1fr))` }}
          >
            {channels.map((item, index) => {
              const active = index === activeChannel;

              return (
                <button
                  className={`${styles.channelSwitch} ${active ? styles.switchActive : ""}`}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setActiveChannel(index)}
                  key={item.label}
                >
                  <span className={styles.switchTravel} aria-hidden="true">
                    <span />
                  </span>
                  <span className={styles.switchCopy}>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                    <span>{item.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className={styles.powerButton}
            type="button"
            onClick={runBoot}
            aria-label="Restart CRT boot sequence"
          >
            <PowerGlyph />
            <span>Power</span>
          </button>
        </div>
      </div>

      <div className={styles.mobileStatic} aria-label={`${channels[0].label} website preview`}>
        {channels[0].src ? (
          <img src={channels[0].src} alt={channels[0].alt} loading="eager" decoding="async" />
        ) : (
          <div className={styles.mobilePending} role="img" aria-label={channels[0].alt}>
            <span>01</span>
            <strong>{channels[0].label}</strong>
            <small>Screenshot ready to drop in</small>
          </div>
        )}
      </div>
    </div>
  );
}
