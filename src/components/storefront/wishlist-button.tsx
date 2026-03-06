"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  initialWishlisted?: boolean;
}

export function WishlistButton({
  productId,
  initialWishlisted = false,
}: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setWishlisted((prev) => !prev);
      }}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
      data-product-id={productId}
      className={cn(
        "inline-flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2",
        wishlisted
          ? "bg-ivory/90 text-error"
          : "bg-ivory/70 text-muted-foreground hover:text-error"
      )}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          wishlisted && "fill-error animate-heart-pop"
        )}
      />
    </button>
  );
}
