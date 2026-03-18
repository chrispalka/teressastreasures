import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        variants: { orderBy: { sortOrder: "asc" } },
      },
    }),
    db.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice
      ? Number(product.compareAtPrice)
      : null,
    sku: product.sku,
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    material: product.material,
    weight: product.weight ? Number(product.weight) : null,
    categoryId: product.categoryId,
    tags: product.tags,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    images: product.images.map((img) => ({ url: img.url, alt: img.alt })),
    variants: product.variants.map((v) => ({
      name: v.name,
      value: v.value,
      sku: v.sku,
      price: v.price ? Number(v.price) : undefined,
    })),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Edit Product
        </h1>
        <p className="mt-1 text-sm text-espresso/60">
          Update product details for &ldquo;{product.name}&rdquo;.
        </p>
      </div>
      <ProductForm initialData={initialData} categories={categories} />
    </div>
  );
}
