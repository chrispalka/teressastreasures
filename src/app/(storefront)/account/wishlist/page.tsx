import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import { GoldButton } from "@/components/brand/gold-button";

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const wishlistItems = await db.wishlistItem.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: true,
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
      },
    },
  });

  const products = wishlistItems.map((item) => {
    const ratings = item.product.reviews.map((r) => r.rating);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;

    return {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      compareAtPrice: item.product.compareAtPrice
        ? Number(item.product.compareAtPrice)
        : null,
      images: item.product.images.map((img) => ({
        url: img.url,
        alt: img.alt,
      })),
      category: { name: item.product.category.name },
      averageRating,
      reviewCount: ratings.length,
    };
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-espresso">My Wishlist</h1>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-ivory py-16 text-center shadow-sm">
          <Heart className="mb-4 h-12 w-12 text-champagne-gold/50" />
          <p className="font-serif text-lg text-espresso">
            Your wishlist is empty
          </p>
          <p className="mt-1 mb-6 text-sm text-charcoal/50">
            Your wishlist is empty &mdash; start exploring!
          </p>
          <Link href="/products">
            <GoldButton>Browse Products</GoldButton>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
