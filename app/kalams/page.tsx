import KalamsBrowse, { kalamsMetadata } from "@/components/listings/KalamsBrowse";

export const revalidate = 604800;

export async function generateMetadata() {
  return kalamsMetadata(1);
}

export default function KalamsPage() {
  return <KalamsBrowse currentPage={1} />;
}
