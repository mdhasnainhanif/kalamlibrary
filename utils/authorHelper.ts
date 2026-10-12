/**
 * Helper utilities for author profiles and Urdu script titles.
 * Maps digitized poets to their authentic Urdu titles and avoids
 * unintended Latin string duplication / left-edge truncation.
 */

/** Roman names that should resolve to a canonical authors.name_roman (same person). */
export const AUTHOR_ROMAN_ALIASES: Record<string, string> = {
  "Muhammad Ilyas Attar Qadri Razavi": "Muhammad Ilyas Attar Qadri",
  "Hazrat Allama Maulana Muhammad Ilyas Attar Qadri Razavi": "Muhammad Ilyas Attar Qadri",
  "Maulana Muhammad Ilyas Attar Qadri Razavi": "Muhammad Ilyas Attar Qadri",
  "Ilyas Attar Qadri Razavi": "Muhammad Ilyas Attar Qadri",
  "Ilyas Attar Qadri": "Muhammad Ilyas Attar Qadri",
};

export function canonicalAuthorRoman(nameRoman: string): string {
  return AUTHOR_ROMAN_ALIASES[nameRoman] ?? nameRoman;
}

/** Placeholder author rows from imports — hide in nav and UI. */
export function isPlaceholderAuthorName(name: string | null | undefined): boolean {
  if (!name?.trim()) return true;
  const n = name.trim().toLowerCase();
  return n === "unknown" || n === "unknown poet" || n === "anonymous" || n === "n/a";
}

export function filterListedAuthors<T extends { name_roman: string }>(authors: T[] | null | undefined): T[] {
  return (authors || []).filter((a) => !isPlaceholderAuthorName(a.name_roman));
}

/** Poets nav: A–Z, then these authors at the end (order preserved). */
export const POET_NAV_LAST_NAME = "Abu Al-Asar Hafeez Jalandhari";

function poetNavLastRank(nameRoman: string): number | null {
  const n = nameRoman.trim().toLowerCase();
  if (n.includes("busiri")) return 0;
  if (n.includes("hafeez jalandhari") || n === POET_NAV_LAST_NAME.toLowerCase()) return 1;
  return null;
}

function isPoetNavLastEntry(nameRoman: string): boolean {
  return poetNavLastRank(nameRoman) !== null;
}

export function sortAuthorsForPoetsNav<T extends { name_roman: string }>(authors: T[]): T[] {
  const pinned: T[] = [];
  const rest: T[] = [];
  for (const author of authors) {
    if (isPoetNavLastEntry(author.name_roman)) pinned.push(author);
    else rest.push(author);
  }
  rest.sort((a, b) => a.name_roman.localeCompare(b.name_roman, "en", { sensitivity: "base" }));
  pinned.sort(
    (a, b) =>
      (poetNavLastRank(a.name_roman) ?? 0) - (poetNavLastRank(b.name_roman) ?? 0) ||
      a.name_roman.localeCompare(b.name_roman, "en", { sensitivity: "base" }),
  );
  return [...rest, ...pinned];
}

/** Display name for cards/SEO, or empty when missing/placeholder. */
export function authorLabelFromRoman(name: string | null | undefined): string {
  if (isPlaceholderAuthorName(name)) return "";
  return name!.trim();
}

export const AUTHOR_URDU_NAMES: Record<string, string> = {
  "Imam Ahmad Raza Khan Qadri": "امام احمد رضا خان قادری",
  "Mustafa Raza Khan Qadri": "مصطفیٰ رضا خان قادری",
  "Mufti Ahmad Yar Khan Naeemi": "مفتی احمد یار خان نعیمی",
  "Muhammad Ilyas Attar Qadri": "محمد الیاس عطار قادری",
  "Allama Hasan Raza Khan": "علامہ حسن رضا خان",
  "Maulana Muhammad Jamil-ur-Rehman Razvi": "مولانا محمد جمیل الرحمٰن رضوی",
  "Molana Hamid Raza Khan": "مولانا حامد رضا خان",
  "Maulana Syed Muhammad Naeemuddin Muradabadi": "مولانا سید محمد نعيم الدين مراد آبادی",
};

export function getAuthorUrduName(author: { name_roman: string; name_urdu?: string | null }): string {
  const canonical = canonicalAuthorRoman(author.name_roman);
  if (AUTHOR_URDU_NAMES[canonical]) {
    return AUTHOR_URDU_NAMES[canonical];
  }
  // If author has name_urdu and it contains Arabic/Urdu unicode characters
  if (author.name_urdu && author.name_urdu !== author.name_roman && /[\u0600-\u06FF]/.test(author.name_urdu)) {
    return author.name_urdu;
  }
  return "";
}

export const AUTHOR_BIOS: Record<string, string> = {
  "Imam Ahmad Raza Khan Qadri":
    "Ala Hazrat Imam Ahmad Raza Khan Qadri (1856–1921) of Bareilly was a Hanafi jurist, theologian, and one of the most widely recited Naat poets in the subcontinent. His collection Hadaiq-e-Bakhshish — commonly published in two or three parts — includes Hamd, Naat, and Manqabat. Mustafa Jaan-e-Rehmat Pe Lakhon Salaam is among his best-known poems.",
  "Allama Hasan Raza Khan":
    "Allama Hasan Raza Khan (1859–1908), younger brother of Ala Hazrat, was a classical Urdu poet of Hamd and Naat. His odes in praise of the Prophet Muhammad ﷺ are preserved in later Bareilly collections and remain part of Mawlid gatherings.",
  "Mustafa Raza Khan Qadri":
    "Mufti-e-Azam Hind Mustafa Raza Khan Qadri (1892–1981), son of Ala Hazrat, was a leading Barelvi jurist and poet. His Naats and manqabat appear in Saman-e-Bakhshish and continue to be read in South Asian Sunni communities.",
  "Muhammad Ilyas Attar Qadri":
    "Maulana Muhammad Ilyas Attar Qadri is the founder of Dawat-e-Islami and the compiler of Wasail-e-Bakhshish, a contemporary collection of Hamd, Naat, and didactic poetry. These pages transcribe printed editions for study; they are not an official publication of the author.",
  "Mufti Ahmad Yar Khan Naeemi":
    "Mufti Ahmad Yar Khan Naeemi (1906–1971) was a Hanafi scholar and exegete from Badayun, known for accessible commentary and for Naat and manqabat that circulate in Indian and Pakistani Sunni circles.",
  "Molana Hamid Raza Khan":
    "Molana Hamid Raza Khan is a poet of Hamd and Naat whose kalams appear in Bayaz-e-Paak Hujjat-ul-Islam. Naghma-e-Tauheed and related odes in praise of Divine unity are among the works preserved in this archive.",
  "Maulana Syed Muhammad Naeemuddin Muradabadi":
    "Maulana Syed Muhammad Naeemuddin Muradabadi was a scholar-poet whose collection Riaz-e-Naeem gathers Hamd, Naat, manqabat, and ghazals in classical Urdu. These pages transcribe the printed edition for reading and study.",
};

export function getAuthorBio(author: { name_roman: string; bio?: string | null }): string {
  const canonical = canonicalAuthorRoman(author.name_roman);
  return AUTHOR_BIOS[canonical] || author.bio || "Poet of Hamd, Naat, and other Islamic devotional lyrics featured in the Kalam Library archive.";
}
