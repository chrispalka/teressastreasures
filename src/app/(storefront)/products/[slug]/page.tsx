import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Truck } from "lucide-react";

import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { RatingStars } from "@/components/storefront/rating-stars";
import { ReviewList } from "@/components/storefront/review-list";
import { ReviewForm } from "@/components/storefront/review-form";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { ProductCard } from "@/components/storefront/product-card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getProduct(slug: string) {
  const product = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" } },
      variants: { orderBy: { sortOrder: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  return product;
}

async function getRelatedProducts(categoryId: string, currentProductId: string) {
  const products = await db.product.findMany({
    where: {
      categoryId,
      isActive: true,
      id: { not: currentProductId },
    },
    include: {
      images: { orderBy: { sortOrder: "asc" }, take: 2 },
      category: { select: { name: true } },
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    take: 4,
  });

  return products;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.description.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.description.slice(0, 160),
      images: product.images[0]
        ? [{ url: product.images[0].url, alt: product.images[0].alt || product.name }]
        : undefined,
    },
  };
}

export default async function ProductDetailPage(props: PageProps) {
  const params = await props.params;
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  }

  const price = Number(product.price);
  const compareAtPrice = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const isOnSale = compareAtPrice != null && compareAtPrice > price;
  const weight = product.weight ? Number(product.weight) : null;

  // Calculate review stats
  const reviewCount = product.reviews.length;
  const averageRating =
    reviewCount > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;

  // Group variants by name
  const variantGroups: Record<string, typeof product.variants> = {};
  for (const variant of product.variants) {
    if (!variantGroups[variant.name]) {
      variantGroups[variant.name] = [];
    }
    variantGroups[variant.name].push(variant);
  }

  // Fetch related products
  const relatedProducts = await getRelatedProducts(product.categoryId, product.id);

  // JSON-LD Product structured data
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images[0]?.url,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: "Teressa's Treasures",
    },
    offers: {
      "@type": "Offer",
      url: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/products/${product.slug}`,
      priceCurrency: "USD",
      price: price.toFixed(2),
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    ...(reviewCount > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount,
      },
    }),
  };

  // JSON-LD BreadcrumbList
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category.name,
        item: `${process.env.NEXT_PUBLIC_BASE_URL || ""}/categories/${product.category.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
      },
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="transition-colors hover:text-espresso">
                Home
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li>
              <Link
                href={`/categories/${product.category.slug}`}
                className="transition-colors hover:text-espresso"
              >
                {product.category.name}
              </Link>
            </li>
            <li>
              <ChevronRight className="h-3.5 w-3.5" />
            </li>
            <li className="font-medium text-espresso">{product.name}</li>
          </ol>
        </nav>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Image Gallery */}
          <ProductGallery images={product.images} />

          {/* Right: Product Details */}
          <div className="flex flex-col gap-5">
            {/* Product name */}
            <h1 className="font-serif text-3xl text-espresso lg:text-4xl">
              {product.name}
            </h1>

            {/* Rating + review count */}
            {reviewCount > 0 && (
              <a
                href="#reviews"
                className="inline-flex items-center gap-2 w-fit transition-opacity hover:opacity-80"
              >
                <RatingStars rating={averageRating} />
                <span className="text-sm text-muted-foreground underline underline-offset-2">
                  {reviewCount} {reviewCount === 1 ? "review" : "reviews"}
                </span>
              </a>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {isOnSale ? (
                <>
                  <span className="font-sans text-2xl font-bold text-amber">
                    {formatCurrency(price)}
                  </span>
                  <span className="font-sans text-lg text-muted-foreground line-through">
                    {formatCurrency(compareAtPrice!)}
                  </span>
                </>
              ) : (
                <span className="font-sans text-2xl font-bold text-espresso">
                  {formatCurrency(price)}
                </span>
              )}
            </div>

            {/* Material badge */}
            {product.material && (
              <span className="inline-flex w-fit items-center rounded-full bg-deep-olive/10 px-3 py-1 text-xs font-medium text-deep-olive">
                {product.material}
              </span>
            )}

            {/* Variant selectors */}
            {Object.keys(variantGroups).length > 0 && (
              <div className="space-y-4">
                {Object.entries(variantGroups).map(([name, variants]) => (
                  <div key={name} className="space-y-2">
                    <span className="text-sm font-medium text-espresso">
                      {name}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => (
                        <button
                          key={variant.id}
                          className="rounded-full border border-blush px-4 py-1.5 text-sm text-espresso transition-all hover:border-champagne-gold hover:bg-champagne-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-gold"
                        >
                          {variant.value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add to Cart */}
            <AddToCartButton
              product={{
                id: product.id,
                name: product.name,
                slug: product.slug,
                price,
                image: product.images[0]?.url || "",
                stock: product.stock,
              }}
            />

            {/* Shipping estimate */}
            <div className="flex items-center gap-2 rounded-lg bg-warm-sand/50 px-4 py-3">
              <Truck className="h-4.5 w-4.5 text-deep-olive" />
              <span className="text-sm text-espresso">
                Free shipping on orders over $75
              </span>
            </div>
          </div>
        </div>

        {/* Tabs section */}
        <div className="mt-16">
          <Tabs defaultValue="description">
            <TabsList variant="line" className="w-full justify-start border-b border-blush">
              <TabsTrigger value="description" className="font-serif text-base">
                Description
              </TabsTrigger>
              <TabsTrigger value="details" className="font-serif text-base">
                Details &amp; Materials
              </TabsTrigger>
              <TabsTrigger value="reviews" className="font-serif text-base">
                Reviews ({reviewCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose prose-stone max-w-none font-sans text-charcoal/80 leading-relaxed">
                {product.description.split("\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="pt-6">
              <dl className="grid gap-4 sm:grid-cols-2 max-w-lg">
                {product.material && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Material</dt>
                    <dd className="mt-0.5 text-sm text-espresso">{product.material}</dd>
                  </div>
                )}
                {weight != null && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Weight</dt>
                    <dd className="mt-0.5 text-sm text-espresso">{weight} oz</dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">SKU</dt>
                  <dd className="mt-0.5 text-sm text-espresso">{product.sku}</dd>
                </div>
                {product.tags.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Tags</dt>
                    <dd className="mt-0.5 flex flex-wrap gap-1.5">
                      {product.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blush/50 px-2.5 py-0.5 text-xs text-espresso"
                        >
                          {tag}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6" id="reviews">
              <ReviewList
                reviews={product.reviews}
                averageRating={averageRating}
                reviewCount={reviewCount}
              />
              <div className="mt-10 border-t border-blush pt-8">
                <ReviewForm productId={product.id} />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 text-center font-serif text-2xl text-espresso lg:text-3xl">
              You May Also Love
            </h2>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
              {relatedProducts.map((related) => {
                const relatedReviewCount = related.reviews.length;
                const relatedAvgRating =
                  relatedReviewCount > 0
                    ? related.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      relatedReviewCount
                    : 0;

                return (
                  <ProductCard
                    key={related.id}
                    product={{
                      id: related.id,
                      name: related.name,
                      slug: related.slug,
                      price: Number(related.price),
                      compareAtPrice: related.compareAtPrice
                        ? Number(related.compareAtPrice)
                        : null,
                      images: related.images.map((img) => ({
                        url: img.url,
                        alt: img.alt || related.name,
                      })),
                      category: { name: related.category.name },
                      material: related.material || undefined,
                      averageRating: relatedAvgRating,
                      reviewCount: relatedReviewCount,
                    }}
                  />
                );
              })}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
