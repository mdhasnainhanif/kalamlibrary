import SiteLoader from "@/components/ui/SiteLoader";

/** Full-height kalam route fallback — keeps footer off-screen until lyrics render. */
export default function KalamPageLoading() {
  return (
    <main
      id="main-content"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading naat lyrics"
      className="flex min-h-[calc(100dvh-4.5rem)] flex-1 flex-col md:min-h-[calc(100dvh-5rem)]"
    >
      <SiteLoader label="Loading kalam" />
    </main>
  );
}
