import KalamsBrowse, { kalamsMetadata, resolveKalamsPage } from "@/components/listings/KalamsBrowse";

export const revalidate = 604800;

/** Nothing is prerendered. The first request caches the page (ISR). */
export function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return kalamsMetadata(resolveKalamsPage(page));
}

export default async function KalamsPaged({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  return <KalamsBrowse currentPage={resolveKalamsPage(page)} />;
}
