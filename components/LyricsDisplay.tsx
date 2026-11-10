import KalamLyricsReader from "@/components/KalamLyricsReader";
import { parseKalamCouplets } from "@/utils/parseKalamCouplets";

interface LyricsDisplayProps {
  lyrics: string;
  title: string;
  author: string;
  lang: string;
  dir: "ltr" | "rtl";
}

/**
 * Server-rendered verses. The lyrics reach the browser once, as HTML; the client reader only adds
 * font sizing and couplet selection on top of these buttons.
 */
export default function LyricsDisplay({ lyrics, title, author, lang, dir }: LyricsDisplayProps) {
  const stanzas = parseKalamCouplets(lyrics);

  return (
    <KalamLyricsReader key={`${lang}:${title}`} title={title} author={author} lang={lang} dir={dir}>
      {stanzas.map((lines, i) => (
        // Kept attribute-light on purpose: every attribute here is repeated per verse in both the
        // HTML and the React payload. The reader adds aria-label/data-selected after hydration.
        <button key={i} type="button" className="kalam-stanza" data-stanza-index={i} aria-pressed="false">
          <span aria-hidden />
          {lines.map((line, j) => (
            <p key={j}>{line}</p>
          ))}
        </button>
      ))}
    </KalamLyricsReader>
  );
}
