import styles from "./PricingTicker.module.css";

const tickerItems = [
  "Focused Site from $1,125",
  "Custom Business Site from $2,050",
  "Advanced Build from $3,750",
  "Custom builds",
  "Mobile ready",
  "Up to three revision rounds",
];

function TickerGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {tickerItems.map((item) => (
        <span className={styles.item} key={item}>
          <span className={styles.spark} aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function PricingTicker() {
  return (
    <section className={styles.ticker} aria-label="Website pricing highlights">
      <div className={`${styles.edge} ${styles.edgeLeft}`} aria-hidden="true" />
      <div className={styles.viewport}>
        <div className={styles.track}>
          <TickerGroup />
          <TickerGroup hidden />
        </div>
      </div>
      <div className={`${styles.edge} ${styles.edgeRight}`} aria-hidden="true" />
    </section>
  );
}
