"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SiteMotion() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      // 1) HERO — quiet entrance plus a very small amount of scroll depth.
      const heroCopy = document.querySelector(".hero__copy");
      const heroPhoto = document.querySelector<HTMLElement>(".hero__photo");
      const heroFrame = document.querySelector<HTMLElement>(".hero__frame");

      if (heroCopy) {
        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .from(".hero__copy h1", {
            y: 34,
            autoAlpha: 0,
            duration: 1.05,
          })
          .from(
            ".hero__copy .rule--tight",
            {
              scaleX: 0,
              transformOrigin: "left center",
              duration: 0.7,
            },
            "-=0.66",
          )
          .from(
            [
              ".hero__copy > .tag",
              ".hero__lede",
              ".hero__seo",
              ".hero__cta",
              ".hero__foot",
            ],
            {
              y: 18,
              autoAlpha: 0,
              duration: 0.72,
              stagger: 0.075,
            },
            "-=0.48",
          );
      }

      if (heroPhoto) {
        gsap.fromTo(
          heroPhoto,
          { scale: 1.02, yPercent: -1.5 },
          {
            scale: 1.075,
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero",
              start: "top top",
              end: "bottom top",
              scrub: 1.15,
            },
          },
        );
      }

      if (heroFrame) {
        gsap.to(heroFrame, {
          yPercent: -7,
          rotate: -1.4,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1.25,
          },
        });
      }

      // 2) PRICING — reveal as a group, then let the gold edge travel around
      // the hovered card instead of just making the whole card brighter.
      const pricingCards = gsap.utils.toArray<HTMLElement>(".tier");

      if (pricingCards.length) {
        gsap.from(pricingCards, {
          y: 44,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".tiers",
            start: "top 82%",
            once: true,
          },
        });

        pricingCards.forEach((card) => {
          gsap.set(card, {
            "--glow-angle": "-70deg",
            "--glow-opacity": 0,
          });

          const enter = () => {
            gsap.killTweensOf(card);
            gsap.set(card, { "--glow-opacity": 1, "--glow-angle": "-70deg" });
            gsap.to(card, {
              y: -7,
              boxShadow: "0 22px 58px rgba(160, 131, 72, 0.16)",
              duration: 0.38,
              ease: "power2.out",
            });
            gsap.to(card, {
              "--glow-angle": "290deg",
              duration: 1.15,
              ease: "power2.inOut",
            });
          };

          const leave = () => {
            gsap.killTweensOf(card);
            gsap.to(card, {
              y: 0,
              boxShadow: "0 0 0 rgba(160, 131, 72, 0)",
              "--glow-opacity": 0,
              duration: 0.42,
              ease: "power2.out",
            });
          };

          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", enter);
            card.removeEventListener("pointerleave", leave);
          });
        });
      }

      // 3) PROCESS — the left side resolves in sequence while the visual panel
      // moves at a slower rate. That keeps the section feeling like progress,
      // not like four cards appearing at once.
      const timeline = document.querySelector<HTMLElement>("#timeline");
      if (timeline) {
        const heading = timeline.querySelector(".timeline-heading");
        const copy = timeline.querySelector(".timeline-copy");
        const steps = timeline.querySelectorAll<HTMLElement>(".timeline-step");
        const visual = timeline.querySelector<HTMLElement>(".timeline-visual");
        const orbs = timeline.querySelectorAll<HTMLElement>(".timeline-orb");

        const processTl = gsap.timeline({
          scrollTrigger: {
            trigger: timeline,
            start: "top 76%",
            once: true,
          },
          defaults: { ease: "power3.out" },
        });

        if (heading) {
          processTl.from(heading, {
            y: 46,
            autoAlpha: 0,
            duration: 0.95,
          });
        }

        if (copy) {
          processTl.from(
            copy,
            {
              y: 24,
              autoAlpha: 0,
              duration: 0.72,
            },
            "-=0.52",
          );
        }

        if (steps.length) {
          processTl.from(
            steps,
            {
              y: 30,
              autoAlpha: 0,
              duration: 0.72,
              stagger: 0.09,
            },
            "-=0.34",
          );
        }

        if (orbs.length) {
          processTl.from(
            orbs,
            {
              scale: 0.45,
              autoAlpha: 0,
              duration: 0.68,
              stagger: 0.12,
              transformOrigin: "50% 50%",
            },
            "-=0.72",
          );
        }

        if (visual) {
          gsap.fromTo(
            visual,
            { xPercent: 3.5, scale: 1.018 },
            {
              xPercent: 0,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: timeline,
                start: "top 92%",
                end: "bottom 28%",
                scrub: 0.9,
              },
            },
          );
        }
      }

      // 4) REMAINING SECTIONS — stagger the copy and actions without turning
      // the whole page into an animation demo.
      const revealSections = ["#needs", "#contact"];

      revealSections.forEach((selector) => {
        const section = document.querySelector<HTMLElement>(selector);
        if (!section) return;

        const heading = section.querySelector("h2");
        const supporting = section.querySelectorAll<HTMLElement>(
          ".needs li, .aside, .contact__body, .contact__like, .contact__actions",
        );

        if (heading) {
          gsap.from(heading, {
            y: 40,
            autoAlpha: 0,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          });
        }

        if (supporting.length) {
          gsap.from(supporting, {
            y: 26,
            autoAlpha: 0,
            duration: 0.78,
            stagger: 0.065,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 74%",
              once: true,
            },
          });
        }
      });
    });

    ScrollTrigger.refresh();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return (
    <style>{`
      @property --glow-angle {
        syntax: "<angle>";
        inherits: false;
        initial-value: 0deg;
      }

      @property --glow-opacity {
        syntax: "<number>";
        inherits: false;
        initial-value: 0;
      }

      .tier {
        --glow-angle: 0deg;
        --glow-opacity: 0;
        isolation: isolate;
        will-change: transform;
      }

      .tier::before {
        content: "";
        position: absolute;
        inset: -1px;
        z-index: 4;
        padding: 1px;
        pointer-events: none;
        opacity: var(--glow-opacity);
        background: conic-gradient(
          from var(--glow-angle),
          transparent 0deg,
          transparent 214deg,
          rgba(194, 160, 114, 0.28) 242deg,
          rgba(243, 220, 167, 0.96) 270deg,
          rgba(194, 160, 114, 0.48) 298deg,
          transparent 330deg,
          transparent 360deg
        );
        -webkit-mask:
          linear-gradient(#000 0 0) content-box,
          linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
      }

      .tier > h3,
      .tier > p,
      .tier > ul {
        position: relative;
        z-index: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        .tier {
          will-change: auto;
        }

        .tier::before {
          display: none;
        }
      }
    `}</style>
  );
}
