"use client";

import { useEffect, useRef } from "react";

import styles from "./ProcessTimesheet.module.css";

const entries = [
  {
    date: "09/02",
    phase: "Design",
    description: "Homepage layout and type scale",
    hours: 2.5,
  },
  {
    date: "09/02",
    phase: "Design",
    description: "Revision pass on hero section",
    hours: 1,
  },
  {
    date: "09/03",
    phase: "Build",
    description: "Responsive breakpoints, mobile nav",
    hours: 3,
  },
  {
    date: "09/04",
    phase: "Build",
    description: "Booking integration + testing",
    hours: 2,
  },
  {
    date: "09/05",
    phase: "Build",
    description: "Contact form validation",
    hours: 1.5,
  },
] as const;

export default function ProcessTimesheet() {
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const totalRef = useRef<HTMLSpanElement | null>(null);
  const checkinLineRef = useRef<HTMLDivElement | null>(null);
  const checkinLabelRef = useRef<HTMLDivElement | null>(null);
  const checkinCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );

    let runId = 0;
    let disposed = false;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => window.setTimeout(resolve, ms));

    const setTotal = (value: number) => {
      if (!totalRef.current) return;

      const formatted = Number(value).toFixed(1);
      totalRef.current.textContent = formatted;
      totalRef.current.setAttribute("aria-label", `${formatted} total hours`);
    };

    const showStaticState = () => {
      runId += 1;

      rowRefs.current.forEach((row) => row?.classList.add(styles.visible));
      checkinLineRef.current?.classList.add(styles.visible);
      checkinLabelRef.current?.classList.add(styles.visible);
      checkinCardRef.current?.classList.add(styles.visible);

      setTotal(10);
    };

    const reset = () => {
      rowRefs.current.forEach((row) => row?.classList.remove(styles.visible));
      checkinLineRef.current?.classList.remove(styles.visible);
      checkinLabelRef.current?.classList.remove(styles.visible);
      checkinCardRef.current?.classList.remove(styles.visible);

      setTotal(0);
    };

    const runSequence = async () => {
      const thisRun = ++runId;

      reset();

      // Allow the browser to paint the reset state.
      await wait(500);

      let total = 0;

      for (let index = 0; index < entries.length; index += 1) {
        if (
          disposed ||
          thisRun !== runId ||
          !motionQuery.matches
        ) {
          return;
        }

        rowRefs.current[index]?.classList.add(styles.visible);

        total += entries[index].hours;
        setTotal(total);

        await wait(200);
      }

      if (disposed || thisRun !== runId) return;

      await wait(300);
      checkinLineRef.current?.classList.add(styles.visible);

      await wait(280);

      if (disposed || thisRun !== runId) return;
      checkinLabelRef.current?.classList.add(styles.visible);

      await wait(650);

      if (disposed || thisRun !== runId) return;
      checkinCardRef.current?.classList.add(styles.visible);

      // Completed-state pause before looping.
      await wait(2800);

      if (
        disposed ||
        thisRun !== runId ||
        !motionQuery.matches
      ) {
        return;
      }

      reset();

      await wait(850);

      if (!disposed && thisRun === runId && motionQuery.matches) {
        void runSequence();
      }
    };

    const handleMotionPreference = () => {
      if (motionQuery.matches) {
        void runSequence();
      } else {
        showStaticState();
      }
    };

    handleMotionPreference();

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener("change", handleMotionPreference);
    } else {
      motionQuery.addListener(handleMotionPreference);
    }

    return () => {
      disposed = true;
      runId += 1;

      if (motionQuery.removeEventListener) {
        motionQuery.removeEventListener("change", handleMotionPreference);
      } else {
        motionQuery.removeListener(handleMotionPreference);
      }
    };
  }, []);

  return (
    <div className={styles.processLog} aria-label="Project work log">
      <div className={styles.topbar}>
        <div>
          <p className={styles.eyebrow}>Logged hours · Visible progress</p>
          <h3 className={styles.label}>Project work log</h3>
        </div>

        <div className={styles.hoursTotal} aria-live="polite">
          <span
            className={styles.hoursValue}
            ref={totalRef}
            aria-label="10.0 total hours"
          >
            10.0
          </span>
          <span className={styles.hoursUnit}>hours logged</span>
        </div>
      </div>

      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <colgroup>
            <col className={styles.colDate} />
            <col className={styles.colPhase} />
            <col className={styles.colDescription} />
            <col className={styles.colHours} />
          </colgroup>

          <thead>
            <tr>
              <th scope="col" className={styles.dateCell}>
                Date
              </th>
              <th scope="col">Phase</th>
              <th scope="col">Description of work</th>
              <th scope="col">Hours</th>
            </tr>
          </thead>

          <tbody>
            {entries.map((entry, index) => (
              <tr
                className={styles.row}
                key={`${entry.date}-${entry.description}`}
                ref={(node) => {
                  rowRefs.current[index] = node;
                }}
              >
                <td className={`${styles.date} ${styles.dateCell}`}>
                  {entry.date}
                </td>
                <td className={styles.phase}>{entry.phase}</td>
                <td className={styles.description}>{entry.description}</td>
                <td className={styles.hours}>{entry.hours.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.checkin}>
        <div className={styles.checkinMarker} aria-hidden="true">
          <div className={styles.checkinLine} ref={checkinLineRef} />
          <div className={styles.checkinLabel} ref={checkinLabelRef}>
            Check-in — 10 hours
          </div>
        </div>

        <div className={styles.checkinCard} ref={checkinCardRef}>
          <p>
            Timesheet sent <span>·</span> Progress recap <span>·</span> What&apos;s
            next
          </p>
        </div>
      </div>
    </div>
  );
}
