/** Curated Durood & Salam kalams for /durood-o-salam */

export const DUROOD_SALAM_SLUGS = [
  "qasida-al-burda-imam-busiri",
  "salam-us-par-hafeez-jalandhari",
  "ya-nabi-salaam-alaika",
  "ae-madine-ke-tajdar-tujhe-ahl-e-imaan-salam-kehte-hain",
  "ae-shahanshah-e-madina-assalatu-wassalam",
  "tala-al-badru-alayna",
  "ay-saba-mustafa-se-kehdena",
  "mustafa-jaan-e-rehmat-pe-lakhon-salaam",
] as const;

export type DuroodSalamSlug = (typeof DUROOD_SALAM_SLUGS)[number];

export const DUROOD_SALAM_PAGE = {
  title: "Durood o Salam",
  description:
    "Classic durood, salam, and praise of the Prophet ﷺ — Qasida al-Burda, Mustafa Jaan-e-Rehmat, Tala'al al-Badru, and more in Urdu, Roman English, Hindi, and Bangla.",
} as const;
