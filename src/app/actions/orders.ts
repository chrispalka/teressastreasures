"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return session;
}

const validStatuses: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

export async function updateOrderStatus(
  orderId: string,
  status: string,
  trackingNumber?: string,
  notes?: string
) {
  await requireAdmin();

  if (!validStatuses.includes(status as OrderStatus)) {
    return { error: "Invalid order status." };
  }

  try {
    await db.order.update({
      where: { id: orderId },
      data: {
        status: status as OrderStatus,
        ...(trackingNumber !== undefined && { trackingNumber }),
        ...(notes !== undefined && { notes }),
      },
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return {};
  } catch (error) {
    console.error("Update order status error:", error);
    return { error: "Failed to update order status." };
  }
}
