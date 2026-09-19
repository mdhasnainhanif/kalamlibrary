/**
 * Helper utilities for author profiles and Urdu script titles.
 * Maps digitized poets to their authentic Urdu titles and avoids
 * unintended Latin string duplication / left-edge truncation.
 */

export const AUTHOR_URDU_NAMES: Record<string, string> = {
  "Imam Ahmad Raza Khan Qadri": "امام احمد رضا خان قادری",
  "Mustafa Raza Khan Qadri": "مصطفیٰ رضا خان قادری",
  "Mufti Ahmad Yar Khan Naeemi": "مفتی احمد یار خان نعیمی",
  "Muhammad Ilyas Attar Qadri": "محمد الیاس عطار قادری",
  "Allama Hasan Raza Khan": "علامہ حسن رضا خان",
  "Maulana Muhammad Jamil-ur-Rehman Razvi": "مولانا محمد جمیل الرحمٰن رضوی",
};

export function getAuthorUrduName(author: { name_roman: string; name_urdu?: string | null }): string {
  if (AUTHOR_URDU_NAMES[author.name_roman]) {
    return AUTHOR_URDU_NAMES[author.name_roman];
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
};

export function getAuthorBio(author: { name_roman: string; bio?: string | null }): string {
  return AUTHOR_BIOS[author.name_roman] || author.bio || "Poet of Hamd, Naat, and other Islamic devotional lyrics featured in the Kalam Library archive.";
}
