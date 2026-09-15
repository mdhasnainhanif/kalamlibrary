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
