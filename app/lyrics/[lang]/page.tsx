import { LYRIC_LANGUAGES } from "@/utils/kalam";
import LyricsBrowse, { lyricsMetadata, resolveLyricsRoute } from "@/components/listings/LyricsBrowse";

export const revalidate = 604800;

export function generateStaticParams() {
  return Object.keys(LYRIC_LANGUAGES).map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const route = resolveLyricsRoute({ lang });
  return lyricsMetadata(route.lang, route.currentPage, route.letter);
}

export default async function LyricsLanguagePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  return <LyricsBrowse {...resolveLyricsRoute({ lang })} />;
}
