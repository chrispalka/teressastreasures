import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage(props: SearchPageProps) {
  const searchParams = await props.searchParams;
  const query = searchParams.q?.trim() ?? "";

  const products = query.length >= 2
    ? await db.product.findMany({
        where: {
          isActive: true,
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          images: { orderBy: { sortOrder: "asc" } },
          category: { select: { name: true } },
          reviews: { where: { status: "APPROVED" }, select: { rating: true } },
        },
        orderBy: { name: "asc" },
      })
    : [];

  const productsForCards = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images.map((img) => ({ url: img.url, alt: img.alt })),
    category: { name: p.category.name },
    material: p.material,
    averageRating:
      p.reviews.length > 0
        ? p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length
        : 0,
    reviewCount: p.reviews.length,
  }));

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {query ? (
        <>
          <h1 className="mb-8 font-serif text-2xl text-espresso md:text-3xl">
            {productsForCards.length}{" "}
            {productsForCards.length === 1 ? "result" : "results"} for{" "}
            <span className="italic">&ldquo;{query}&rdquo;</span>
          </h1>

          {productsForCards.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {productsForCards.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-20 text-center">
              <p className="font-serif text-lg italic text-espresso/60">
                No treasures matched your search.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a different keyword or browse our{" "}
                <a href="/products" className="text-champagne-gold underline">
                  full collection
                </a>
                .
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center py-20 text-center">
          <h1 className="font-serif text-2xl text-espresso">Search</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter a search term to find treasures.
          </p>
        </div>
      )}
    </main>
  );
}
