"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  size?: "sm" | "md";
}

export function RatingStars({ rating, size = "md" }: RatingStarsProps) {
  const clampedRating = Math.max(0, Math.min(5, rating));
  const starSize = size === "sm" ? "h-3.5 w-3.5" : "h-4.5 w-4.5";

  return (
    <div className="inline-flex items-center gap-0.5" role="img" aria-label={`${clampedRating} out of 5 stars`}>
      <span className="sr-only">{clampedRating} out of 5 stars</span>
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.max(0, Math.min(1, clampedRating - i));

        if (fill >= 1) {
          // Full star
          return (
            <Star
              key={i}
              className={cn(starSize, "fill-star-filled text-star-filled")}
              aria-hidden="true"
            />
          );
        }

        if (fill > 0) {
          // Partial star (half)
          return (
            <span key={i} className={cn("relative inline-block", starSize)} aria-hidden="true">
              {/* Empty star background */}
              <Star className={cn(starSize, "absolute inset-0 fill-star-empty text-star-empty")} />
              {/* Clipped filled star */}
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fill * 100}%` }}
              >
                <Star className={cn(starSize, "fill-star-filled text-star-filled")} />
              </span>
            </span>
          );
        }

        // Empty star
        return (
          <Star
            key={i}
            className={cn(starSize, "fill-star-empty text-star-empty")}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
