import Link from "next/link";
import { kalamHref } from "@/utils/kalam";

type Translation = {
  language: string;
  title: string;
  lyrics: string;
};

const LANG_META: Record<
  string,
  { path: string; label: string; dir: "ltr" | "rtl"; htmlLang: string; fontClass: string }
> = {
  roman_english: {
    path: "roman-english",
    label: "Roman English",
    dir: "ltr",
    htmlLang: "en",
    fontClass: "font-sans",
  },
  urdu: {
    path: "urdu",
    label: "Urdu (Nastaliq)",
    dir: "rtl",
    htmlLang: "ur",
    fontClass: "font-urdu kalam-urdu-lyrics",
  },
  hindi: {
    path: "hindi",
    label: "Hindi (Devanagari)",
    dir: "ltr",
    htmlLang: "hi",
    fontClass: "font-devanagari",
  },
  bangla: {
    path: "bangla",
    label: "Bangla (Bengali)",
    dir: "ltr",
    htmlLang: "bn",
    fontClass: "font-bengali",
  },
};

/**
 * Renders every translation in the initial HTML (inside <details>) so crawlers
 * can index Urdu/Hindi/Bangla text even when only one tab is active.
 */
export default function KalamTranslationsIndex({
  slug,
  translations,
  activeLanguage,
}: {
  slug: string;
  translations: Translation[];
  activeLanguage?: string;
}) {
  if (translations.length <= 1) return null;

  const ordered = ["urdu", "roman_english", "hindi", "bangla"]
    .map((code) => translations.find((t) => t.language === code))
    .filter(Boolean) as Translation[];

  return (
    <section
      aria-label="All language versions"
      className="mt-10 pt-8 border-t border-emerald-500/10 w-full text-left"
    >
      <h2 className="text-lg font-bold text-gray-200 mb-4">All language versions</h2>
      <p className="text-xs text-gray-400 mb-4 max-w-2xl">
        Full lyrics for each script are included below. Urdu and other scripts are present in the
        page source for search indexing.
      </p>
      <div className="flex flex-col gap-3">
        {ordered.map((translation) => {
          const meta = LANG_META[translation.language];
          if (!meta) return null;
          const isActive = translation.language === activeLanguage;
          const href =
            translation.language === "roman_english"
              ? kalamHref(slug)
              : kalamHref(slug, meta.path);

          return (
            <details
              key={translation.language}
              open={isActive || translation.language === "urdu"}
              className="rounded-xl bg-emerald-900/10 border border-emerald-500/10 overflow-hidden"
            >
              <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-200 hover:text-gold-500 transition-colors list-none [&::-webkit-details-marker]:hidden">
                {meta.label}
                {isActive ? " (current view)" : ""}
              </summary>
              <article
                lang={meta.htmlLang}
                dir={meta.dir}
                className={`px-4 pb-4 text-sm text-gray-300 whitespace-pre-line leading-relaxed ${meta.fontClass}`}
              >
                {translation.lyrics}
                <p className="mt-4 pt-3 border-t border-emerald-500/10">
                  <Link href={href} className="text-xs text-emerald-400 hover:text-gold-500 font-medium">
                    Open dedicated {meta.label} page →
                  </Link>
                </p>
              </article>
            </details>
          );
        })}
      </div>
    </section>
  );
}
