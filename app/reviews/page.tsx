import type { Metadata } from "next";
import Link from "next/link";
import ReviewCard from "@/components/reviews/ReviewCard";
import ReviewForm from "@/components/reviews/ReviewForm";
import {
  REVIEWS_PAGE_SIZE,
  computeReviewStats,
  getApprovedReviewsPublic,
  pickDisplayReviews,
} from "@/utils/reviewsData";
import { SITE_CONFIG, buildCanonicalUrl } from "@/utils/seoConfig";

export const revalidate = 604800;

export const metadata: Metadata = {
  title: "Reader Reviews",
  description:
    "Reader reviews and feedback about Kalam Library — a multi-language naat and kalam lyrics archive in Urdu, Roman, Hindi, and Bangla.",
  alternates: { canonical: buildCanonicalUrl("/reviews") },
  robots: { index: true, follow: true },
  openGraph: {
    title: `Reader Reviews | ${SITE_CONFIG.name}`,
    description:
      "See what readers say about Kalam Library and share your own moderated testimonial.",
    url: buildCanonicalUrl("/reviews"),
  },
};

export default async function ReviewsPage() {
  const all = await getApprovedReviewsPublic();
  const stats = computeReviewStats(all);
  const pageItems = pickDisplayReviews(all, REVIEWS_PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(pickDisplayReviews(all, 9999).length / REVIEWS_PAGE_SIZE));

  return (
    <main id="main-content" className="container flex-grow py-8 md:py-12">
      <header className="mx-auto mb-8 max-w-3xl text-center">
        <h1 className="text-3xl font-semibold text-emerald-900 md:text-4xl dark:text-gold-500">Reader reviews</h1>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base dark:text-gray-300">
          Moderated feedback from visitors. Average scores count verified reviews only, not sample placeholders.
        </p>
        {stats.realCount > 0 && stats.averageRating != null ? (
          <p className="mt-2 text-sm font-medium text-gold-700 dark:text-gold-400">
            {stats.averageRating} ★ average · {stats.realCount} verified {stats.realCount === 1 ? "review" : "reviews"}
          </p>
        ) : null}
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_340px] lg:items-start">
        <section aria-label="Published reviews">
          {pageItems.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No published reviews yet.</p>
          ) : (
            <ul className="grid gap-5 sm:grid-cols-2">
              {pageItems.map((review) => (
                <li key={review.id}>
                  <ReviewCard review={review} />
                </li>
              ))}
            </ul>
          )}

          {totalPages > 1 ? (
            <nav className="mt-8 flex justify-center gap-2 text-sm" aria-label="Reviews pagination">
              <span className="rounded-lg border border-emerald-500/20 px-3 py-1.5 font-medium">1</span>
              {Array.from({ length: totalPages - 1 }, (_, i) => i + 2).map((p) => (
                <Link
                  key={p}
                  href={`/reviews/page/${p}`}
                  className="rounded-lg border border-transparent px-3 py-1.5 text-emerald-800 hover:border-emerald-500/20 dark:text-emerald-200"
                >
                  {p}
                </Link>
              ))}
            </nav>
          ) : null}
        </section>

        <section className="lg:sticky lg:top-24" aria-labelledby="submit-review-heading">
          <h2 id="submit-review-heading" className="mb-1 font-display text-xl font-semibold text-emerald-900 dark:text-gold-500">
            Share your experience
          </h2>
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">Takes about a minute. Your words help other readers.</p>
          <ReviewForm />
        </section>
      </div>
    </main>
  );
}
