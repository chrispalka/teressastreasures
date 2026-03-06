"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { approveReview, rejectReview } from "@/app/actions/admin";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Check, X } from "lucide-react";
import { toast } from "sonner";

interface ReviewData {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  status: string;
  createdAt: string;
  productName: string;
  customerName: string;
}

interface ReviewModerationProps {
  reviews: ReviewData[];
  currentStatus: string;
}

export function ReviewModeration({
  reviews,
  currentStatus,
}: ReviewModerationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleApprove(id: string) {
    startTransition(async () => {
      try {
        const res = await approveReview(id);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Review approved.");
        router.refresh();
      } catch {
        toast.error("Failed to approve review.");
      }
    });
  }

  function handleReject(id: string) {
    startTransition(async () => {
      try {
        const res = await rejectReview(id);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Review rejected.");
        router.refresh();
      } catch {
        toast.error("Failed to reject review.");
      }
    });
  }

  if (reviews.length === 0) {
    return (
      <p className="py-8 text-center text-espresso/50">
        No {currentStatus.toLowerCase()} reviews.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <Card key={review.id} className="border-blush/50">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? "fill-star-filled text-star-filled"
                            : "text-star-empty"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-espresso/50">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm font-medium text-espresso">
                  {review.productName}
                </p>
                {review.title && (
                  <p className="font-semibold text-espresso">{review.title}</p>
                )}
                <p className="text-sm text-espresso/70">{review.body}</p>
                <p className="text-xs text-espresso/50">
                  by {review.customerName}
                </p>
              </div>

              {currentStatus === "PENDING" && (
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleApprove(review.id)}
                    disabled={isPending}
                    className="flex items-center gap-1 rounded-lg bg-success/10 px-3 py-1.5 text-sm font-medium text-success hover:bg-success/20 disabled:opacity-50"
                  >
                    <Check className="h-4 w-4" /> Approve
                  </button>
                  <button
                    onClick={() => handleReject(review.id)}
                    disabled={isPending}
                    className="flex items-center gap-1 rounded-lg bg-error/10 px-3 py-1.5 text-sm font-medium text-error hover:bg-error/20 disabled:opacity-50"
                  >
                    <X className="h-4 w-4" /> Reject
                  </button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
