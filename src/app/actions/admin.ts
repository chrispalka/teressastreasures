"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

// ─── Categories ─────────────────────────────────────

interface CategoryPayload {
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
}

export async function createCategory(data: CategoryPayload) {
  await requireAdmin();

  if (!data.name || !data.slug) {
    return { error: "Name and slug are required." };
  }

  try {
    await db.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        sortOrder: data.sortOrder,
      },
    });

    revalidatePath("/admin/categories");
    return {};
  } catch (error) {
    console.error("Create category error:", error);
    return { error: "Failed to create category. The name or slug may already exist." };
  }
}

export async function updateCategory(id: string, data: CategoryPayload) {
  await requireAdmin();

  if (!data.name || !data.slug) {
    return { error: "Name and slug are required." };
  }

  try {
    await db.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        image: data.image,
        sortOrder: data.sortOrder,
      },
    });

    revalidatePath("/admin/categories");
    return {};
  } catch (error) {
    console.error("Update category error:", error);
    return { error: "Failed to update category. The name or slug may already exist." };
  }
}

export async function deleteCategory(id: string) {
  await requireAdmin();

  try {
    // Check if category has products
    const productCount = await db.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      return {
        error: `Cannot delete category with ${productCount} product(s). Reassign them first.`,
      };
    }

    await db.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return {};
  } catch (error) {
    console.error("Delete category error:", error);
    return { error: "Failed to delete category." };
  }
}

// ─── Reviews ────────────────────────────────────────

export async function approveReview(id: string) {
  await requireAdmin();

  try {
    await db.review.update({
      where: { id },
      data: { status: "APPROVED" },
    });

    revalidatePath("/admin/reviews");
    return {};
  } catch (error) {
    console.error("Approve review error:", error);
    return { error: "Failed to approve review." };
  }
}

export async function rejectReview(id: string) {
  await requireAdmin();

  try {
    await db.review.update({
      where: { id },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin/reviews");
    return {};
  } catch (error) {
    console.error("Reject review error:", error);
    return { error: "Failed to reject review." };
  }
}
