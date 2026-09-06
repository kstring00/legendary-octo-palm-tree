import AIIntakeSection from "./AIIntakeSection";
import BottomCapture from "./BottomCapture";
import Header from "./Header";
import HeroShowcase from "./HeroShowcase";
import PricingConfigurator from "./PricingConfigurator";
import PricingTicker from "./PricingTicker";
import SiteMotion from "./SiteMotion";
import TimelineShowcase from "./TimelineShowcase";

export default function Home() {
  return (
    <>
      <Header />
      <HeroShowcase />
      <PricingTicker />

      <main>
        <PricingConfigurator />
        <TimelineShowcase />
        <AIIntakeSection />
        <BottomCapture />
      </main>

      <SiteMotion />
    </>
  );
}
