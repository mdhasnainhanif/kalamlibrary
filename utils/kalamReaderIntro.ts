/** Unique on-page copy for kalam pages (AdSense / SEO — not duplicated meta description). */
export function buildKalamReaderIntro(params: {
  titleRoman: string;
  authorName: string;
  sourceCollection?: string | null;
  activeLanguageLabel?: string;
  translationCount: number;
}): string {
  const { titleRoman, authorName, sourceCollection, activeLanguageLabel, translationCount } = params;

  const opening = `${titleRoman} is a devotional naat and kalam by ${authorName}.`;
  const source = sourceCollection
    ? ` The poem is associated with the published collection ${sourceCollection}.`
    : "";
  const lang =
    activeLanguageLabel && translationCount > 0
      ? ` You are reading the ${activeLanguageLabel} version; use the language tabs to open Urdu, Hindi, Bangla, or Roman English where available (${translationCount} variant${translationCount === 1 ? "" : "s"} on this page).`
      : translationCount > 1
        ? ` This page includes ${translationCount} language variants—switch tabs to read the same poem in another script.`
        : "";
  const note =
    " Lyrics are digitized from printed sources for personal reading and learning; they are not a certified critical edition. Please report transcription mistakes using the link below.";

  return `${opening}${source}${lang}${note}`;
}
