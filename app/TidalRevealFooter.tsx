"use client";

import { useEffect, useRef } from "react";

const MIN_SCROLL_DISTANCE = 520;
const EFFECT_STRENGTH = 1;

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value));

export default function TidalRevealFooter() {
  const zoneRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    const footer = footerRef.current;
    if (!zone || !footer) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    if (reducedMotion.matches) {
      footer.style.setProperty("--p", "1");
      return;
    }

    let raf = 0;

    const update = () => {
      raf = 0;

      const documentHeight = document.documentElement.scrollHeight;
      const availableScroll = documentHeight - window.innerHeight;
      const footerTop = zone.getBoundingClientRect().top + window.scrollY;
      const footerHeight = zone.offsetHeight;

      if (availableScroll < MIN_SCROLL_DISTANCE) {
        footer.style.setProperty("--p", "1");
        return;
      }

      // 0 when the reveal zone first touches the viewport bottom,
      // 1 after one footer-height of travel. Everything visual reads --p.
      const progress = clamp(
        (window.scrollY + window.innerHeight - footerTop) / footerHeight,
      );

      footer.style.setProperty("--p", progress.toFixed(4));
    };

    const scheduleUpdate = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={zoneRef} className="tideRevealZone">
      <footer
        ref={footerRef}
        className="tideRevealFooter"
        style={{ "--strength": EFFECT_STRENGTH } as React.CSSProperties}
      >
        <div className="tideRevealFooter__glow" aria-hidden="true" />

        <div className="tideRevealFooter__waves" aria-hidden="true">
          <div className="tideRevealFooter__waveLift tideRevealFooter__waveLift--back">
            <div className="tideRevealFooter__waveDrift tideRevealFooter__waveDrift--back">
              <svg viewBox="0 0 1800 260" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ks-wave-back" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#425B6F" stopOpacity="0.58" />
                    <stop offset="100%" stopColor="#0A2237" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                <path
                  d="M-160 116 C80 60 250 154 470 100 C690 46 855 145 1080 92 C1308 38 1488 126 1960 67 L1960 280 L-160 280 Z"
                  fill="url(#ks-wave-back)"
                />
              </svg>
            </div>
          </div>

          <div className="tideRevealFooter__waveLift tideRevealFooter__waveLift--front">
            <div className="tideRevealFooter__waveDrift tideRevealFooter__waveDrift--front">
              <svg viewBox="0 0 1800 280" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="ks-wave-front" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#29485F" stopOpacity="0.96" />
                    <stop offset="54%" stopColor="#102D43" stopOpacity="0.96" />
                    <stop offset="100%" stopColor="#061827" stopOpacity="1" />
                  </linearGradient>
                  <linearGradient id="ks-wave-foam" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A08348" stopOpacity="0" />
                    <stop offset="16%" stopColor="#C2A072" stopOpacity="0.55" />
                    <stop offset="46%" stopColor="#F4DDA9" stopOpacity="1" />
                    <stop offset="72%" stopColor="#D6BB80" stopOpacity="0.82" />
                    <stop offset="100%" stopColor="#A08348" stopOpacity="0" />
                  </linearGradient>
                  <filter id="ks-wave-glow" x="-10%" y="-400%" width="120%" height="900%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <path
                  d="M-160 126 C72 84 268 150 480 109 C700 66 886 153 1102 105 C1328 55 1522 140 1960 86 L1960 300 L-160 300 Z"
                  fill="url(#ks-wave-front)"
                />
                <path
                  d="M-160 126 C72 84 268 150 480 109 C700 66 886 153 1102 105 C1328 55 1522 140 1960 86"
                  fill="none"
                  stroke="url(#ks-wave-foam)"
                  strokeWidth="7"
                  strokeLinecap="round"
                  filter="url(#ks-wave-glow)"
                  className="tideRevealFooter__foamGlow"
                />
                <path
                  d="M-160 126 C72 84 268 150 480 109 C700 66 886 153 1102 105 C1328 55 1522 140 1960 86"
                  fill="none"
                  stroke="#F5E3BB"
                  strokeOpacity="0.76"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="tideRevealFooter__orbit tideRevealFooter__orbit--one" aria-hidden="true" />
        <div className="tideRevealFooter__orbit tideRevealFooter__orbit--two" aria-hidden="true" />
        <div className="tideRevealFooter__ghost" aria-hidden="true">KS</div>

        <div className="tideRevealFooter__inner">
          <div className="tideRevealFooter__eyebrow">
            <span>KS / DIGITAL</span>
            <span className="tideRevealFooter__eyebrowRule" aria-hidden="true" />
            <span>BUILT AROUND YOU</span>
          </div>

          <div className="tideRevealFooter__wordmarkLayer">
            <p className="tideRevealFooter__wordmark">Kyle Stringham</p>
          </div>

          <div className="tideRevealFooter__lower">
            <div className="tideRevealFooter__statementLayer">
              <p className="tideRevealFooter__statement">
                I build websites for people who need one.
              </p>
              <p className="tideRevealFooter__aside">
                Thoughtful websites. Clear decisions. No template with your name
                swapped in.
              </p>
            </div>

            <nav className="tideRevealFooter__linksLayer" aria-label="Footer">
              <a href="mailto:stringham00@gmail.com">stringham00@gmail.com</a>
              <a href="#top">
                Back to top
                <span aria-hidden="true">↗</span>
              </a>
            </nav>
          </div>

          <div className="tideRevealFooter__baseLayer">
            <span>© {new Date().getFullYear()} Kyle Stringham</span>
            <span>Web design + build</span>
          </div>
        </div>

        <style>{`
          .site-surface {
            position: relative;
            z-index: 2;
            background: var(--cream-light, #faf8f4);
            box-shadow: 0 32px 90px rgba(5, 23, 47, 0.2);
          }

          .tideRevealZone {
            position: relative;
            z-index: 0;
            height: clamp(34rem, 72vh, 46rem);
            background: #05172f;
          }

          .tideRevealFooter {
            --p: 0;
            --strength: 1;
            position: sticky;
            bottom: 0;
            z-index: 1;
            height: clamp(34rem, 72vh, 46rem);
            overflow: hidden;
            isolation: isolate;
            background:
              radial-gradient(circle at 86% 16%, rgba(194, 160, 114, 0.09), transparent 24%),
              linear-gradient(180deg, #071a2d 0%, #05172f 58%, #03111f 100%);
            color: #ffffff;
            font-family: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
          }

          .tideRevealFooter__inner {
            position: relative;
            z-index: 5;
            width: min(100%, 76rem);
            height: 100%;
            margin: 0 auto;
            padding: clamp(2rem, 5vw, 4.5rem) var(--gutter, clamp(1.25rem, 5vw, 4rem)) 2rem;
            display: flex;
            flex-direction: column;
          }

          .tideRevealFooter__glow {
            position: absolute;
            z-index: 0;
            left: 50%;
            bottom: -48%;
            width: min(118rem, 140vw);
            height: 96%;
            border-radius: 50% 50% 0 0;
            transform-origin: 50% 100%;
            transform: translateX(-50%) scaleX(calc(0.9 + (var(--p) * 0.1))) scaleY(calc(0.26 + (var(--p) * 0.74)));
            opacity: calc(0.1 + (var(--p) * 0.26));
            background:
              radial-gradient(ellipse at 50% 100%,
                rgba(214, 187, 128, 0.45) 0%,
                rgba(194, 160, 114, 0.28) 28%,
                rgba(160, 131, 72, 0.12) 51%,
                rgba(160, 131, 72, 0) 74%);
            will-change: transform;
          }

          .tideRevealFooter__waves {
            position: absolute;
            z-index: 3;
            inset: 0;
            overflow: hidden;
            pointer-events: none;
            -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 38%, #000 57%);
            mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.15) 38%, #000 57%);
          }

          .tideRevealFooter__waveLift {
            position: absolute;
            left: -9%;
            width: 118%;
            height: 43%;
            bottom: -8%;
            transform-origin: center bottom;
            will-change: transform;
          }

          .tideRevealFooter__waveLift--back {
            opacity: calc(0.12 + (var(--p) * 0.56));
            transform: translate3d(0, calc(155px - (var(--p) * 132px)), 0) scaleY(calc(0.88 + (var(--p) * 0.12)));
          }

          .tideRevealFooter__waveLift--front {
            opacity: calc(0.18 + (var(--p) * 0.82));
            transform: translate3d(0, calc(178px - (var(--p) * 162px)), 0) scaleY(calc(0.82 + (var(--p) * 0.18)));
          }

          .tideRevealFooter__waveDrift {
            width: 112%;
            height: 100%;
            margin-left: -6%;
            will-change: transform;
          }

          .tideRevealFooter__waveDrift svg {
            display: block;
            width: 100%;
            height: 100%;
            overflow: visible;
          }

          .tideRevealFooter__waveDrift--front {
            animation: ksTideFront 7.8s ease-in-out infinite alternate;
          }

          .tideRevealFooter__waveDrift--back {
            animation: ksTideBack 11.5s ease-in-out infinite alternate;
          }

          .tideRevealFooter__foamGlow {
            opacity: calc(0.5 + (var(--p) * 0.5));
          }

          @keyframes ksTideFront {
            0% { transform: translate3d(-2.6%, 0, 0) scaleX(1.025); }
            42% { transform: translate3d(0.7%, -5px, 0) scaleX(1.01); }
            100% { transform: translate3d(2.2%, 2px, 0) scaleX(1.035); }
          }

          @keyframes ksTideBack {
            0% { transform: translate3d(2%, 4px, 0) scaleX(1.02); }
            50% { transform: translate3d(-0.7%, -4px, 0) scaleX(1.045); }
            100% { transform: translate3d(-2.3%, 2px, 0) scaleX(1.025); }
          }

          .tideRevealFooter__orbit {
            position: absolute;
            z-index: 1;
            right: -12vw;
            bottom: -36vw;
            width: min(67rem, 72vw);
            aspect-ratio: 1;
            border: 1px solid rgba(214, 187, 128, 0.16);
            border-radius: 50%;
            transform-origin: 50% 50%;
            will-change: transform;
          }

          .tideRevealFooter__orbit--one {
            transform: rotate(calc(-20deg + (var(--p) * 12deg))) scale(calc(0.91 + (var(--p) * 0.09)));
          }

          .tideRevealFooter__orbit--two {
            right: -6vw;
            bottom: -31vw;
            width: min(56rem, 61vw);
            border-color: rgba(194, 160, 114, 0.09);
            transform: rotate(calc(14deg - (var(--p) * 9deg))) scale(calc(0.95 + (var(--p) * 0.05)));
          }

          .tideRevealFooter__ghost {
            position: absolute;
            z-index: 1;
            right: clamp(-1rem, 2vw, 2rem);
            top: 2%;
            font-family: var(--font-cormorant), Georgia, serif;
            font-size: clamp(11rem, 28vw, 31rem);
            font-weight: 300;
            line-height: 0.8;
            letter-spacing: -0.12em;
            color: rgba(255,255,255,0.035);
            transform: translateY(calc(42px - (var(--p) * 42px))) rotate(calc(2deg - (var(--p) * 2deg)));
            will-change: transform;
            user-select: none;
          }

          .tideRevealFooter__eyebrow {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            color: #d6bb80;
            font-size: 0.67rem;
            font-weight: 600;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            transform: translateY(calc(24px - (var(--p) * 24px)));
            opacity: calc(0.38 + (var(--p) * 0.62));
            will-change: transform;
          }

          .tideRevealFooter__eyebrowRule {
            width: 2.8rem;
            height: 1px;
            background: rgba(214, 187, 128, 0.58);
          }

          .tideRevealFooter__wordmarkLayer {
            margin-top: auto;
            transform: translateY(calc(82px - (var(--p) * 82px)));
            opacity: calc(0.2 + (var(--p) * 0.8));
            will-change: transform;
          }

          .tideRevealFooter__wordmark {
            margin: 0;
            max-width: 100%;
            color: #ffffff;
            font-family: var(--font-cormorant), Georgia, serif;
            font-size: clamp(4.2rem, 11.2vw, 9rem);
            font-weight: 300;
            line-height: 0.82;
            letter-spacing: -0.045em;
            white-space: nowrap;
          }

          .tideRevealFooter__lower {
            display: grid;
            grid-template-columns: minmax(0, 1.45fr) minmax(16rem, 0.7fr);
            gap: clamp(2rem, 6vw, 6rem);
            align-items: end;
            margin-top: clamp(2rem, 5vw, 3.7rem);
          }

          .tideRevealFooter__statementLayer {
            transform: translateY(calc(48px - (var(--p) * 48px)));
            opacity: calc(0.22 + (var(--p) * 0.78));
            will-change: transform;
          }

          .tideRevealFooter__statement {
            margin: 0;
            max-width: 31rem;
            color: #ffffff;
            font-family: var(--font-cormorant), Georgia, serif;
            font-size: clamp(1.7rem, 3.4vw, 2.75rem);
            font-weight: 300;
            line-height: 1.04;
          }

          .tideRevealFooter__aside {
            margin: 1rem 0 0;
            max-width: 41rem;
            color: #cbd3da;
            font-size: 0.84rem;
            line-height: 1.75;
          }

          .tideRevealFooter__linksLayer {
            display: flex;
            flex-direction: column;
            gap: 0.55rem;
            transform: translateY(calc(28px - (var(--p) * 28px)));
            opacity: calc(0.28 + (var(--p) * 0.72));
            will-change: transform;
          }

          .tideRevealFooter__linksLayer a {
            min-height: 44px;
            display: inline-flex;
            align-items: center;
            justify-content: space-between;
            gap: 1rem;
            padding: 0.55rem 0;
            color: #ffffff;
            font-size: 0.9rem;
            border-bottom: 1px solid rgba(214, 187, 128, 0.24);
            text-decoration: none;
          }

          .tideRevealFooter__linksLayer a:hover,
          .tideRevealFooter__linksLayer a:focus-visible {
            color: #f3dfb5;
            border-bottom-color: #d6bb80;
          }

          .tideRevealFooter__baseLayer {
            display: flex;
            justify-content: space-between;
            gap: 1rem;
            margin-top: clamp(2rem, 4vw, 3rem);
            padding-top: 1rem;
            border-top: 1px solid rgba(255,255,255,0.12);
            color: #cbd3da;
            font-size: 0.66rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            transform: translateY(calc(16px - (var(--p) * 16px)));
            opacity: calc(0.45 + (var(--p) * 0.55));
            will-change: transform;
          }

          @media (max-width: 47.99rem) {
            .tideRevealZone,
            .tideRevealFooter {
              height: 42rem;
            }

            .tideRevealFooter__inner {
              padding-top: 2rem;
              padding-bottom: 1.4rem;
            }

            .tideRevealFooter__eyebrow {
              flex-wrap: wrap;
              row-gap: 0.45rem;
            }

            .tideRevealFooter__wordmark {
              font-size: clamp(3.5rem, 17vw, 5.2rem);
              white-space: normal;
              max-width: 7ch;
            }

            .tideRevealFooter__lower {
              grid-template-columns: 1fr;
              gap: 1.6rem;
              margin-top: 2rem;
            }

            .tideRevealFooter__statement {
              font-size: clamp(1.65rem, 8vw, 2.25rem);
            }

            .tideRevealFooter__baseLayer {
              margin-top: auto;
              flex-direction: column;
              gap: 0.35rem;
            }

            .tideRevealFooter__ghost {
              right: -3rem;
              top: 12%;
              font-size: clamp(12rem, 58vw, 20rem);
            }

            .tideRevealFooter__orbit {
              width: 135vw;
              right: -58vw;
              bottom: -62vw;
            }

            .tideRevealFooter__waveLift {
              left: -18%;
              width: 136%;
              height: 35%;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .tideRevealFooter {
              --p: 1 !important;
            }

            .tideRevealFooter__waveDrift--front,
            .tideRevealFooter__waveDrift--back {
              animation: none;
            }

            .tideRevealFooter__glow,
            .tideRevealFooter__waveLift,
            .tideRevealFooter__waveDrift,
            .tideRevealFooter__orbit,
            .tideRevealFooter__ghost,
            .tideRevealFooter__eyebrow,
            .tideRevealFooter__wordmarkLayer,
            .tideRevealFooter__statementLayer,
            .tideRevealFooter__linksLayer,
            .tideRevealFooter__baseLayer {
              will-change: auto;
            }
          }
        `}</style>
      </footer>
    </div>
  );
}
