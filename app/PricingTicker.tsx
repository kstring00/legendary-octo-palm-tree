const tickerItems = [
  "One page from $500",
  "Small site from $800",
  "Larger site from $1,200",
  "Custom builds",
  "Mobile ready",
  "Up to five revision rounds",
];

function TickerGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="pricingTicker__group" aria-hidden={hidden || undefined}>
      {tickerItems.map((item) => (
        <span className="pricingTicker__item" key={item}>
          <span className="pricingTicker__spark" aria-hidden="true" />
          {item}
        </span>
      ))}
    </div>
  );
}

export default function PricingTicker() {
  return (
    <section className="pricingTicker" aria-label="Website pricing highlights">
      <div className="pricingTicker__edge pricingTicker__edge--left" aria-hidden="true" />
      <div className="pricingTicker__viewport">
        <div className="pricingTicker__track">
          <TickerGroup />
          <TickerGroup hidden />
        </div>
      </div>
      <div className="pricingTicker__edge pricingTicker__edge--right" aria-hidden="true" />
    </section>
  );
}
