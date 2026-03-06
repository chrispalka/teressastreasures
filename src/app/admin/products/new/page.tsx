import { db } from "@/lib/db";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await db.category.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Add Product
        </h1>
        <p className="mt-1 text-sm text-espresso/60">
          Create a new product listing.
        </p>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
