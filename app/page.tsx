import BottomCapture from "./BottomCapture";
import Header from "./Header";
import HeroShowcase from "./HeroShowcase";
import PricingConfigurator from "./PricingConfigurator";
import PricingTicker from "./PricingTicker";
import SelectedWork from "./SelectedWork";
import SiteMotion from "./SiteMotion";
import TimelineShowcase from "./TimelineShowcase";

export default function Home() {
  return (
    <>
      <Header />
      <HeroShowcase />

      <main>
        <SelectedWork />
        <TimelineShowcase />
        <PricingTicker />
        <PricingConfigurator />
        <BottomCapture />
      </main>

      <SiteMotion />
    </>
  );
}
