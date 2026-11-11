import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import {
  REVIEWS_PAGE_SIZE,
  computeReviewStats,
  getApprovedReviewsPublic,
  pickDisplayReviews,
} from "@/utils/reviewsData";
import { buildCanonicalUrl } from "@/utils/seoConfig";

export const revalidate = 604800;

type Props = { params: Promise<{ page: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { page } = await params;
  const current = parseInt(page, 10);
  if (!Number.isFinite(current) || current < 2) return {};

  return {
    title: `Reader Reviews (Page ${current})`,
    description: "Reader reviews and feedback about Kalam Library.",
    alternates: { canonical: buildCanonicalUrl(`/reviews/page/${current}`) },
    robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
  };
}

export default async function ReviewsPaginatedPage({ params }: Props) {
  const { page } = await params;
  const currentPage = parseInt(page, 10);
  if (!Number.isFinite(currentPage) || currentPage < 2) notFound();

  const all = await getApprovedReviewsPublic();
  const displayAll = pickDisplayReviews(all, 9999);
  const totalPages = Math.max(1, Math.ceil(displayAll.length / REVIEWS_PAGE_SIZE));
  if (currentPage > totalPages) notFound();

  const start = (currentPage - 1) * REVIEWS_PAGE_SIZE;
  const pageItems = displayAll.slice(start, start + REVIEWS_PAGE_SIZE);
  const stats = computeReviewStats(all);

  return (
    <main id="main-content" className="container flex-grow py-8 md:py-12">
      <header className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="text-3xl font-semibold text-emerald-900 md:text-4xl dark:text-gold-500">
          Reader reviews — page {currentPage}
        </h1>
        {stats.realCount > 0 && stats.averageRating != null ? (
          <p className="mt-2 text-sm text-gold-700 dark:text-gold-400">
            {stats.averageRating} ★ average · {stats.realCount} verified reviews
          </p>
        ) : null}
      </header>

      <ul className="mx-auto grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.map((review) => (
          <li key={review.id}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>

      <nav className="mx-auto mt-8 flex max-w-6xl flex-wrap justify-center gap-2 text-sm" aria-label="Reviews pagination">
        {currentPage > 1 ? (
          <Link href={currentPage === 2 ? "/reviews" : `/reviews/page/${currentPage - 1}`} className="rounded-lg px-3 py-1.5 border border-emerald-500/20">
            Previous
          </Link>
        ) : null}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Link
            key={p}
            href={p === 1 ? "/reviews" : `/reviews/page/${p}`}
            aria-current={p === currentPage ? "page" : undefined}
            className={`rounded-lg px-3 py-1.5 ${p === currentPage ? "border border-gold-500/40 font-semibold" : "border border-transparent hover:border-emerald-500/20"}`}
          >
            {p}
          </Link>
        ))}
      </nav>

      <section className="mx-auto mt-10 max-w-lg">
        <h2 className="mb-1 font-display text-xl font-semibold text-emerald-900 dark:text-gold-500">Share your experience</h2>
        <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Takes about a minute. Your words help other readers.</p>
        <ReviewForm />
      </section>
    </main>
  );
}
