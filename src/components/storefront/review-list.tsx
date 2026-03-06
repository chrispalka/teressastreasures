import { RatingStars } from "@/components/storefront/rating-stars";

interface ReviewUser {
  name?: string | null;
}

interface Review {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: Date;
  user: ReviewUser;
}

interface ReviewListProps {
  reviews: Review[];
  averageRating: number;
  reviewCount: number;
}

function formatUserName(name?: string | null): string {
  if (!name) return "Anonymous";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1].charAt(0)}.`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function RatingDistribution({ reviews, reviewCount }: { reviews: Review[]; reviewCount: number }) {
  const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const review of reviews) {
    const r = Math.max(1, Math.min(5, review.rating));
    counts[r] = (counts[r] || 0) + 1;
  }

  return (
    <div className="flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = counts[star];
        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;

        return (
          <div key={star} className="flex items-center gap-2 text-sm">
            <span className="w-6 text-right font-sans text-muted-foreground">
              {star}
            </span>
            <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-star-empty">
              <div
                className="h-full rounded-full bg-champagne-gold transition-all duration-300"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <span className="w-8 text-right font-sans text-xs text-muted-foreground">
              {count}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export function ReviewList({ reviews, averageRating, reviewCount }: ReviewListProps) {
  if (reviewCount === 0) {
    return (
      <div className="py-12 text-center">
        <p className="font-serif italic text-muted-foreground text-lg">
          No reviews yet &mdash; be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Summary section */}
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-10">
        {/* Average rating */}
        <div className="flex flex-col items-center gap-1">
          <span className="font-serif text-5xl font-bold text-espresso">
            {averageRating.toFixed(1)}
          </span>
          <RatingStars rating={averageRating} />
          <span className="text-sm text-muted-foreground">
            {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
          </span>
        </div>

        {/* Distribution bars */}
        <div className="flex-1 max-w-sm">
          <RatingDistribution reviews={reviews} reviewCount={reviewCount} />
        </div>
      </div>

      {/* Individual reviews */}
      <div className="divide-y divide-blush">
        {reviews.map((review) => (
          <div key={review.id} className="py-6 first:pt-0">
            <div className="flex items-center gap-3 mb-2">
              <RatingStars rating={review.rating} size="sm" />
              <span className="text-sm font-medium text-espresso">
                {formatUserName(review.user.name)}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatDate(review.createdAt)}
              </span>
            </div>

            {review.title && (
              <h4 className="font-sans text-sm font-semibold text-espresso mb-1">
                {review.title}
              </h4>
            )}

            <p className="font-sans text-sm leading-relaxed text-charcoal/80">
              {review.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
