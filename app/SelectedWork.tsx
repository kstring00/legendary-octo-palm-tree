"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MouseEvent as ReactMouseEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import styles from "./SelectedWork.module.css";

type LedgerRow = {
  number: string;
  name: string;
  category: string;
  year: string;
  status: string;
  href: string;
  image: string | null;
  pending?: boolean;
};

const rows: LedgerRow[] = [
  {
    number: "01",
    name: "Common Ground",
    category: "ABA / autism support",
    year: "2026",
    status: "IN PILOT",
    href: "/work/common-ground",
    image: "/hero-crt/common-ground.png",
  },
  {
    number: "02",
    name: "BCBA Prep",
    category: "Exam prep · licensing",
    year: "2026",
    status: "LAUNCHING SOON",
    href: "/work/bcba-prep",
    image: "/hero-crt/bcba-prep.png",
  },
  {
    number: "03",
    name: "Lake City Self Storage",
    category: "Self storage",
    year: "2025",
    status: "CASE STUDY",
    href: "/work/lake-city-self-storage",
    image: "/work/lake-city-self-storage/home.webp",
  },
  {
    number: "04",
    name: "With Little",
    category: "Personal project",
    year: "2026",
    status: "LIVE",
    href: "/work/with-little",
    image: "/work/with-little/dashboard.webp",
  },
  {
    number: "05",
    name: "Yours Here",
    category: "—",
    year: "—",
    status: "PENDING",
    href: "#quick-contact",
    image: null,
    pending: true,
  },
];

function Status({ text }: { text: string }) {
  return (
    <span className={styles.status}>
      <i aria-hidden="true" />
      {text}
    </span>
  );
}

function Metadata({ row, gold = false }: { row: LedgerRow; gold?: boolean }) {
  return (
    <div
      className={`${styles.metaTrack} ${gold ? styles.goldMetaTrack : ""}`}
      aria-hidden={gold || undefined}
    >
      <span className={styles.category}>{row.category}</span>
      <span className={styles.year}>{row.year}</span>
      <Status text={row.status} />
    </div>
  );
}

export default function SelectedWork() {
  const router = useRouter();
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [loadedRows, setLoadedRows] = useState<Set<number>>(() => new Set());
  const [navigatingRow, setNavigatingRow] = useState<number | null>(null);
  const navigationTimer = useRef<number | null>(null);

  const ensureImage = (index: number) => {
    if (!rows[index]?.image) return;

    setLoadedRows((current) => {
      if (current.has(index)) return current;
      const next = new Set(current);
      next.add(index);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (navigationTimer.current !== null) {
        window.clearTimeout(navigationTimer.current);
      }
    };
  }, []);

  const handleNavigate = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    row: LedgerRow,
    index: number,
  ) => {
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const touchLike = window.matchMedia(
      "(hover: none), (pointer: coarse)",
    ).matches;

    if (reducedMotion || touchLike || row.pending || !row.image) return;

    event.preventDefault();
    ensureImage(index);
    setActiveRow(index);
    setNavigatingRow(index);

    if (navigationTimer.current !== null) {
      window.clearTimeout(navigationTimer.current);
    }

    navigationTimer.current = window.setTimeout(() => {
      router.push(row.href);
      navigationTimer.current = null;
    }, 300);
  };

  return (
    <section
      className={styles.section}
      id="featured-work"
      aria-labelledby="selected-work-heading"
    >
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 id="selected-work-heading">Proof before pricing.</h2>
        </div>

        <div className={styles.ledger}>
          {rows.map((row, index) => {
            const active = activeRow === index;
            const navigating = navigatingRow === index;
            const imageLoaded = loadedRows.has(index);

            return (
              <Link
                className={`${styles.ledgerRow} ${active ? styles.active : ""} ${row.pending ? styles.pending : ""} ${navigating ? styles.navigating : ""}`}
                href={row.href}
                key={row.number}
                onClick={(event) => handleNavigate(event, row, index)}
                onMouseEnter={() => {
                  ensureImage(index);
                  setActiveRow(index);
                }}
                onMouseLeave={() => {
                  if (navigating) return;
                  setActiveRow((current) => current === index ? null : current);
                }}
                onFocus={() => {
                  ensureImage(index);
                  setActiveRow(index);
                }}
                onBlur={() => {
                  if (navigating) return;
                  setActiveRow((current) => current === index ? null : current);
                }}
              >
                {row.image ? (
                  <span className={styles.previewSlot} aria-hidden="true">
                    {imageLoaded ? (
                      <img className={styles.rowImage} src={row.image} alt="" loading="lazy" decoding="async" />
                    ) : null}
                    <span className={styles.previewCream} />
                  </span>
                ) : null}

                {row.pending ? (
                  <span className={styles.pendingPreview} aria-hidden="true">
                    <span>A place for what&apos;s next</span>
                  </span>
                ) : null}

                <span className={styles.filament} aria-hidden="true" />

                <div className={styles.rowText}>
                  <span className={styles.number}>{row.number}</span>
                  <span className={styles.projectName}>{row.name}</span>
                  <span className={styles.metaViewport}>
                    <Metadata row={row} />
                    <Metadata row={row} gold />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <Link className={styles.viewAll} href="/work">
          View all work <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
