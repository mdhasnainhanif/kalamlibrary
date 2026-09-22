/** Google AdSense (Display). Override via env if you add more ad units later. */
export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "ca-pub-7173654343893692";

/** Ad unit: "First Add" (Display, auto, responsive) */
export const ADSENSE_SLOT_FIRST =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT ?? "3247691381";

/** Ad unit: KalamLeftSideAdd (Display, auto) */
export const ADSENSE_SLOT_VERTICAL_LEFT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_LEFT ?? "7331240777";

/** Ad unit: KalamRightSideAdd (Display, auto) */
export const ADSENSE_SLOT_VERTICAL_RIGHT =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_RIGHT ?? "2883448042";

export const ADSENSE_SCRIPT_SRC = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`;
