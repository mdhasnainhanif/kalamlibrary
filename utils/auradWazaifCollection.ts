/** Curated Aurad o Wazaif kalams for /aurad-o-wazaif */

export const AURAD_WAZAIF_SLUGS = ["khatm-e-qadria"] as const;

export type AuradWazaifSlug = (typeof AURAD_WAZAIF_SLUGS)[number];

export const AURAD_WAZAIF_PAGE = {
  title: "Aurad o Wazaif",
  path: "/aurad-o-wazaif",
  description:
    "Aurad o Wazaif — Khatm-e-Qadria with Arabic text, Roman transliteration and English translation: Durood Sharif, Surah Yaseen, Qasida Ghausia and the Qadri wazaif for needs and difficulties.",
} as const;
