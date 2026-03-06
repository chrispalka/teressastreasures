import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@prisma/client";

const statusConfig: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber/10 text-amber border-amber/30",
  },
  PAID: {
    label: "Paid",
    className: "bg-champagne-gold/10 text-champagne-gold border-champagne-gold/30",
  },
  PROCESSING: {
    label: "Processing",
    className: "bg-deep-olive/10 text-deep-olive border-deep-olive/30",
  },
  SHIPPED: {
    label: "Shipped",
    className: "bg-deep-olive/10 text-deep-olive border-deep-olive/30",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-green-100 text-green-700 border-green-300",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-300",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-red-100 text-red-700 border-red-300",
  },
};

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const orders = await db.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { items: true } },
    },
  });

  return (
    <div>
      <h1 className="mb-6 font-serif text-2xl text-espresso">Order History</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-ivory py-16 text-center shadow-sm">
          <Package className="mb-4 h-12 w-12 text-champagne-gold/50" />
          <p className="font-serif text-lg text-espresso">No orders yet</p>
          <p className="mt-1 text-sm text-charcoal/50">
            Your order history will appear here after your first purchase.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const config = statusConfig[order.status];
            return (
              <div
                key={order.id}
                className="rounded-xl bg-ivory p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-sans text-xs font-medium uppercase tracking-wider text-charcoal/50">
                      Order
                    </p>
                    <p className="font-serif text-base text-espresso">
                      {order.orderNumber}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={config.className}
                  >
                    {config.label}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-charcoal/60">
                  <span>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    {order._count.items}{" "}
                    {order._count.items === 1 ? "item" : "items"}
                  </span>
                  <span className="font-semibold text-espresso">
                    {formatCurrency(Number(order.total))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
