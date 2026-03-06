"use client";

import Link from "next/link";
import Image from "next/image";
import { cn, formatCurrency } from "@/lib/utils";
import { RatingStars } from "@/components/storefront/rating-stars";
import { WishlistButton } from "@/components/storefront/wishlist-button";

interface ProductImage {
  url: string;
  alt: string | null;
}

interface ProductCategory {
  name: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number | null;
  images: ProductImage[];
  category: ProductCategory;
  material?: string | null;
  averageRating?: number;
  reviewCount?: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const {
    id,
    name,
    slug,
    price,
    compareAtPrice,
    images,
    category,
    averageRating,
    reviewCount,
  } = product;

  const isOnSale = compareAtPrice != null && compareAtPrice > price;
  const hasMultipleImages = images.length >= 2;

  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden rounded-xl bg-ivory shadow-sm transition-shadow duration-300 hover:shadow-md"
    >
      {/* Image section */}
      <div className="relative aspect-square overflow-hidden">
        {/* Primary image */}
        {images[0] && (
          <Image
            src={images[0].url}
            alt={images[0].alt || name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-[1.03]",
              hasMultipleImages && "group-hover:opacity-0"
            )}
          />
        )}

        {/* Secondary image on hover */}
        {hasMultipleImages && (
          <Image
            src={images[1].url}
            alt={images[1].alt || name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-300 group-hover:scale-[1.03] group-hover:opacity-100"
          />
        )}

        {/* Sale badge */}
        {isOnSale && (
          <span className="absolute left-3 top-3 rounded-full bg-amber px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ivory">
            Sale
          </span>
        )}

        {/* Wishlist button */}
        <div className="absolute right-3 top-3">
          <WishlistButton productId={id} />
        </div>
      </div>

      {/* Details section */}
      <div className="flex flex-col gap-1.5 p-4">
        {/* Category */}
        <span className="text-xs text-muted-foreground">
          {category.name}
        </span>

        {/* Product name */}
        <h3 className="font-serif text-base leading-snug text-espresso line-clamp-2">
          {name}
        </h3>

        {/* Price */}
        <div className="flex items-center gap-2">
          {isOnSale ? (
            <>
              <span className="font-sans text-sm font-semibold text-amber">
                {formatCurrency(price)}
              </span>
              <span className="font-sans text-xs text-muted-foreground line-through">
                {formatCurrency(compareAtPrice)}
              </span>
            </>
          ) : (
            <span className="font-sans text-sm font-semibold text-espresso">
              {formatCurrency(price)}
            </span>
          )}
        </div>

        {/* Rating */}
        {averageRating != null && averageRating > 0 && (
          <div className="flex items-center gap-1.5">
            <RatingStars rating={averageRating} size="sm" />
            {reviewCount != null && reviewCount > 0 && (
              <span className="text-xs text-muted-foreground">
                ({reviewCount})
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
