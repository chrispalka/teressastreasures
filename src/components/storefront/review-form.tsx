"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/brand/gold-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { reviewSchema } from "@/lib/validators";
import { toast } from "sonner";

interface ReviewFormProps {
  productId: string;
}

export function ReviewForm({ productId }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const displayRating = hoveredRating || rating;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const result = reviewSchema.safeParse({
      rating,
      title: title || undefined,
      body,
    });

    if (!result.success) {
      const issues = result.error.issues;
      toast.error(issues[0]?.message ?? "Invalid input");
      return;
    }

    setIsSubmitting(true);

    try {
      // Server action will be wired later
      toast.success("Thank you for your review! It will appear after approval.");
      setRating(0);
      setTitle("");
      setBody("");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg">
      <h3 className="font-serif text-xl text-espresso">Write a Review</h3>

      {/* Star rating selector */}
      <div className="space-y-1.5">
        <Label className="text-sm font-medium text-espresso">Rating</Label>
        <div
          className="inline-flex gap-1"
          onMouseLeave={() => setHoveredRating(0)}
        >
          {Array.from({ length: 5 }, (_, i) => {
            const starValue = i + 1;
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHoveredRating(starValue)}
                className="p-0.5 transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold rounded"
                aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
              >
                <Star
                  className={cn(
                    "h-7 w-7 transition-colors duration-150",
                    starValue <= displayRating
                      ? "fill-star-filled text-star-filled"
                      : "fill-star-empty text-star-empty"
                  )}
                />
              </button>
            );
          })}
        </div>
        {rating === 0 && (
          <p className="text-xs text-muted-foreground">Click to rate</p>
        )}
      </div>

      {/* Title input (optional) */}
      <div className="space-y-1.5">
        <Label htmlFor="review-title" className="text-sm font-medium text-espresso">
          Title <span className="text-muted-foreground font-normal">(optional)</span>
        </Label>
        <Input
          id="review-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your experience"
          maxLength={100}
          className="bg-ivory"
        />
      </div>

      {/* Body textarea (required) */}
      <div className="space-y-1.5">
        <Label htmlFor="review-body" className="text-sm font-medium text-espresso">
          Review
        </Label>
        <Textarea
          id="review-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Share your thoughts about this product..."
          rows={4}
          minLength={10}
          maxLength={2000}
          className="bg-ivory resize-none"
        />
        <p className="text-xs text-muted-foreground">
          {body.length}/2000 characters (minimum 10)
        </p>
      </div>

      {/* Submit */}
      <GoldButton
        type="submit"
        disabled={isSubmitting || rating === 0}
      >
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </GoldButton>
    </form>
  );
}
