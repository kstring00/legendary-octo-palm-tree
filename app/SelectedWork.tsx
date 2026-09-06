"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
    image: null,
  },
  {
    number: "04",
    name: "Yours Here",
    category: "—",
    year: "—",
    status: "PENDING",
    href: "#quick-contact",
    image: null,
    pending: true,
  },
];

function RowText({ row, gold = false }: { row: LedgerRow; gold?: boolean }) {
  return (
    <div className={`${styles.rowText} ${gold ? styles.goldEcho : ""}`} aria-hidden={gold || undefined}>
      <span className={styles.number}>{row.number}</span>
      <span className={styles.projectName}>{row.name}</span>
      <span className={styles.category}>{row.category}</span>
      <span className={styles.year}>{row.year}</span>
      <span className={styles.status}>
        <i aria-hidden="true" />
        {row.status}
      </span>
    </div>
  );
}

export default function SelectedWork() {
  const [activeRow, setActiveRow] = useState<number | null>(null);
  const [loadedRows, setLoadedRows] = useState<Set<number>>(() => new Set());

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
    const touchQuery = window.matchMedia("(hover: none), (pointer: coarse)");

    const loadTouchImages = () => {
      if (!touchQuery.matches) return;
      setLoadedRows(new Set(rows.flatMap((row, index) => (row.image ? [index] : []))));
    };

    loadTouchImages();
    touchQuery.addEventListener?.("change", loadTouchImages);

    return () => touchQuery.removeEventListener?.("change", loadTouchImages);
  }, []);

  return (
    <section className={styles.section} id="featured-work" aria-labelledby="selected-work-heading">
      <div className={styles.inner}>
        <div className={styles.headingRow}>
          <p className={styles.eyebrow}>Selected work</p>
          <h2 id="selected-work-heading">Proof before pricing.</h2>
        </div>

        <div className={styles.ledger}>
          {rows.map((row, index) => {
            const active = activeRow === index;
            const shouldRenderImage = Boolean(row.image && loadedRows.has(index));

            return (
              <Link
                className={`${styles.ledgerRow} ${active ? styles.active : ""} ${row.pending ? styles.pending : ""}`}
                href={row.href}
                key={row.number}
                onMouseEnter={() => {
                  ensureImage(index);
                  setActiveRow(index);
                }}
                onMouseLeave={() => setActiveRow((current) => (current === index ? null : current))}
                onFocus={() => {
                  ensureImage(index);
                  setActiveRow(index);
                }}
                onBlur={() => setActiveRow((current) => (current === index ? null : current))}
              >
                {shouldRenderImage ? (
                  <img
                    className={styles.rowImage}
                    src={row.image as string}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                ) : null}

                <span className={styles.imageWash} aria-hidden="true" />
                <span className={styles.filament} aria-hidden="true" />

                <RowText row={row} />
                <RowText row={row} gold />
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
