import HomeTestimonialsCarousel from "@/components/reviews/HomeTestimonialsCarousel";
import Button from "@/components/ui/Button";
import {
  REVIEWS_HOME_MAX,
  computeReviewStats,
  getApprovedReviewsPublic,
  pickDisplayReviews,
} from "@/utils/reviewsData";

export default async function HomeTestimonialsSection() {
  const all = await getApprovedReviewsPublic();
  const cards = pickDisplayReviews(all, REVIEWS_HOME_MAX);
  if (cards.length === 0) return null;

  const stats = computeReviewStats(all);

  return (
    <section
      className="page-section-alt w-full border-y border-emerald-500/10 py-10 md:py-12"
      aria-labelledby="home-testimonials-heading"
    >
      <div className="container mx-auto max-w-6xl px-3 sm:px-4">
        <div className="mb-6 flex flex-col gap-2 text-center md:mb-8">
          <h2 id="home-testimonials-heading" className="text-2xl font-semibold text-emerald-900 md:text-3xl dark:text-gold-500">
            What Readers Say
          </h2>
          {stats.realCount > 0 && stats.averageRating != null ? (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-gold-600 dark:text-gold-500">{stats.averageRating}</span>
              <span aria-hidden> ★</span> average from {stats.realCount} verified {stats.realCount === 1 ? "review" : "reviews"}
            </p>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-300">Reader feedback on Kalam Library</p>
          )}
        </div>

        <HomeTestimonialsCarousel reviews={cards} />

        <div className="mt-8 text-center">
          <Button href="/reviews" variant="outline" shape="pill" size="md">
            See all reviews
            <span aria-hidden>→</span>
          </Button>
        </div>
      </div>
    </section>
  );
}
