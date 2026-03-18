"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { productSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

interface ImageInput {
  url: string;
  alt: string | null;
}

interface VariantInput {
  name: string;
  value: string;
  sku: string;
  price?: number;
}

interface ProductPayload {
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  material: string | null;
  weight: number | null;
  categoryId: string;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  images: ImageInput[];
  variants: VariantInput[];
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function createProduct(data: ProductPayload) {
  await requireAdmin();

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Validation failed." };
  }

  try {
    await db.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        sku: data.sku,
        isActive: data.isActive,
        isFeatured: data.isFeatured,
        material: data.material,
        weight: data.weight,
        categoryId: data.categoryId,
        tags: data.tags,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        images: {
          create: data.images.map((img, i) => ({
            url: img.url,
            alt: img.alt,
            sortOrder: i,
          })),
        },
        variants: {
          create: data.variants.map((v, i) => ({
            name: v.name,
            value: v.value,
            sku: v.sku,
            price: v.price ?? null,
            sortOrder: i,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    return {};
  } catch (error) {
    console.error("Create product error:", error);
    return { error: "Failed to create product. The slug or SKU may already exist." };
  }
}

export async function updateProduct(id: string, data: ProductPayload) {
  await requireAdmin();

  const result = productSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Validation failed." };
  }

  try {
    await db.$transaction(async (tx) => {
      // Delete existing images and variants
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.productVariant.deleteMany({ where: { productId: id } });

      // Update product with new images and variants
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          compareAtPrice: data.compareAtPrice,
          sku: data.sku,
          isActive: data.isActive,
          isFeatured: data.isFeatured,
          material: data.material,
          weight: data.weight,
          categoryId: data.categoryId,
          tags: data.tags,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          images: {
            create: data.images.map((img, i) => ({
              url: img.url,
              alt: img.alt,
              sortOrder: i,
            })),
          },
          variants: {
            create: data.variants.map((v, i) => ({
              name: v.name,
              value: v.value,
              sku: v.sku,
              price: v.price ?? null,
              sortOrder: i,
            })),
          },
        },
      });
    });

    revalidatePath("/admin/products");
    revalidatePath(`/admin/products/${id}/edit`);
    return {};
  } catch (error) {
    console.error("Update product error:", error);
    return { error: "Failed to update product. The slug or SKU may already exist." };
  }
}

export async function deleteProduct(id: string) {
  await requireAdmin();

  try {
    await db.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    return {};
  } catch (error) {
    console.error("Delete product error:", error);
    return { error: "Failed to delete product." };
  }
}
