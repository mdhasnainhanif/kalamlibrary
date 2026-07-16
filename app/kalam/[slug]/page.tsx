import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function KalamDefaultPage({ params }: PageProps) {
  const { slug } = await params;
  // Redirect to the default Roman English version
  redirect(`/kalam/${slug}/roman-english`);
}
