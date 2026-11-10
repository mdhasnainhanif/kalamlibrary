import LyricsBrowse, { lyricsMetadata, resolveLyricsRoute } from "@/components/listings/LyricsBrowse";

export const revalidate = 604800;

export function generateStaticParams() {
  return [];
}

type Params = { params: Promise<{ lang: string; letter: string }> };

export async function generateMetadata({ params }: Params) {
  const route = resolveLyricsRoute(await params);
  return lyricsMetadata(route.lang, route.currentPage, route.letter);
}

export default async function LyricsLetterPage({ params }: Params) {
  return <LyricsBrowse {...resolveLyricsRoute(await params)} />;
}
