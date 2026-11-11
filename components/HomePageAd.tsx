import AdSenseDisplay from "@/components/AdSenseDisplay";
import { ADSENSE_SLOT_FIRST } from "@/utils/adsConfig";

/** Primary display unit on the homepage (high-traffic entry point for AdSense review). */
export default function HomePageAd() {
  return (
    <section aria-label="Advertisement" className="container mx-auto w-full max-w-3xl px-4 py-1">
      <AdSenseDisplay
        slot={ADSENSE_SLOT_FIRST}
        format="auto"
        layout="inline"
        reserveSpace
        className="!my-2"
      />
    </section>
  );
}
