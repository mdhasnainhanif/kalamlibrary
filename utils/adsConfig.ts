/** Google AdSense (Display). Override via env if you add more ad units later. */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7173654343893692";

/** Ad unit: "First Add" (Display, auto, responsive) */
export const ADSENSE_SLOT_FIRST =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "3247691381";

/** Optional separate vertical slots for desktop sidebar gutters */
export const ADSENSE_SLOT_VERTICAL_LEFT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT ?? ADSENSE_SLOT_FIRST;

export const ADSENSE_SLOT_VERTICAL_RIGHT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT ?? ADSENSE_SLOT_FIRST;

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
