import { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductFilters } from "@/components/storefront/product-filters";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop All Products | Teressa's Treasures",
  description:
    "Browse our full collection of curated jewelry, accessories, and luxury goods at Teressa's Treasures.",
};

const PRODUCTS_PER_PAGE = 20;

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    material?: string;
    sort?: string;
    search?: string;
    page?: string;
  }>;
}

export default async function ProductsPage(props: ProductsPageProps) {
  const searchParams = await props.searchParams;

  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  const skip = (page - 1) * PRODUCTS_PER_PAGE;

  // Build Prisma where clause
  const where: Record<string, unknown> = {
    isActive: true,
  };

  // Category filter (comma-separated slugs)
  if (searchParams.category) {
    const categorySlugs = searchParams.category.split(",");
    where.category = { slug: { in: categorySlugs } };
  }

  // Price range
  if (searchParams.minPrice || searchParams.maxPrice) {
    const priceFilter: Record<string, unknown> = {};
    if (searchParams.minPrice) {
      priceFilter.gte = parseFloat(searchParams.minPrice);
    }
    if (searchParams.maxPrice) {
      priceFilter.lte = parseFloat(searchParams.maxPrice);
    }
    where.price = priceFilter;
  }

  // Material filter (comma-separated)
  if (searchParams.material) {
    const materials = searchParams.material.split(",");
    where.material = { in: materials };
  }

  // Search text
  if (searchParams.search) {
    where.OR = [
      { name: { contains: searchParams.search, mode: "insensitive" } },
      { description: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (searchParams.sort) {
    case "price-asc":
      orderBy = { price: "asc" };
      break;
    case "price-desc":
      orderBy = { price: "desc" };
      break;
    case "newest":
    default:
      orderBy = { createdAt: "desc" };
      break;
  }

  // Fetch products and categories in parallel
  const [rawProducts, totalCount, categories] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip,
      take: PRODUCTS_PER_PAGE,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        compareAtPrice: true,
        material: true,
        images: {
          take: 2,
          orderBy: { sortOrder: "asc" },
          select: { url: true, alt: true },
        },
        category: {
          select: { name: true },
        },
      },
    }),
    db.product.count({ where }),
    db.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  // Transform products to the shape ProductCard expects
  const products = rawProducts.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    images: p.images.map((img) => ({
      url: img.url,
      alt: img.alt ?? p.name,
    })),
    category: p.category,
    material: p.material,
  }));

  const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

  // Build pagination URLs
  function buildPageUrl(pageNum: number) {
    const params = new URLSearchParams();
    if (searchParams.category) params.set("category", searchParams.category);
    if (searchParams.minPrice) params.set("minPrice", searchParams.minPrice);
    if (searchParams.maxPrice) params.set("maxPrice", searchParams.maxPrice);
    if (searchParams.material) params.set("material", searchParams.material);
    if (searchParams.sort) params.set("sort", searchParams.sort);
    if (searchParams.search) params.set("search", searchParams.search);
    if (pageNum > 1) params.set("page", pageNum.toString());
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="min-h-screen bg-warm-sand">
      {/* Breadcrumbs */}
      <div className="mx-auto max-w-7xl px-4 pt-6">
        <nav aria-label="Breadcrumb" className="text-sm text-espresso/60">
          <ol className="flex items-center gap-1.5">
            <li>
              <Link href="/" className="transition-colors hover:text-espresso">
                Home
              </Link>
            </li>
            <li className="text-espresso/40">/</li>
            <li className="font-medium text-espresso">Products</li>
          </ol>
        </nav>
      </div>

      {/* Page header */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="font-serif text-3xl text-espresso md:text-4xl">
          Shop All Products
        </h1>
        <p className="mt-2 text-sm text-espresso/60">
          {totalCount} {totalCount === 1 ? "product" : "products"} found
        </p>
      </div>

      {/* Main content: filters + grid */}
      <div className="mx-auto flex max-w-7xl gap-8 px-4 pb-16">
        {/* Filter sidebar */}
        <ProductFilters categories={categories} searchParams={searchParams} />

        {/* Product grid area */}
        <div className="flex-1">
          {/* Mobile filter trigger row */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <ProductFilters
              categories={categories}
              searchParams={searchParams}
            />
            <span className="text-xs text-espresso/50">
              {totalCount} results
            </span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl bg-ivory py-20">
              <p className="font-serif text-xl text-espresso/70">
                No products found
              </p>
              <p className="mt-2 text-sm text-espresso/50">
                Try adjusting your filters or search terms.
              </p>
              <Button asChild variant="outline" className="mt-6">
                <Link href="/products">Clear Filters</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Product grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="Pagination"
                  className="mt-10 flex items-center justify-center gap-3"
                >
                  {page > 1 ? (
                    <Button asChild variant="outline" size="sm" className="border-espresso/20 text-espresso hover:bg-blush">
                      <Link href={buildPageUrl(page - 1)}>
                        <ChevronLeft className="size-4" />
                        Previous
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="border-espresso/10 text-espresso/30">
                      <ChevronLeft className="size-4" />
                      Previous
                    </Button>
                  )}

                  <span className="text-sm text-espresso/70">
                    Page {page} of {totalPages}
                  </span>

                  {page < totalPages ? (
                    <Button asChild variant="outline" size="sm" className="border-espresso/20 text-espresso hover:bg-blush">
                      <Link href={buildPageUrl(page + 1)}>
                        Next
                        <ChevronRight className="size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="border-espresso/10 text-espresso/30">
                      Next
                      <ChevronRight className="size-4" />
                    </Button>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
