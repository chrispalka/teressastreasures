import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrderStatus } from "@prisma/client";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber/20 text-amber",
  PAID: "bg-deep-olive/20 text-deep-olive",
  PROCESSING: "bg-champagne-gold/20 text-espresso",
  SHIPPED: "bg-blush text-espresso",
  DELIVERED: "bg-success/20 text-success",
  CANCELLED: "bg-error/20 text-error",
  REFUNDED: "bg-charcoal/10 text-charcoal",
};

const statusTabs: { label: string; value: string }[] = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
  { label: "Cancelled", value: "CANCELLED" },
];

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const { status = "ALL" } = await searchParams;

  const where =
    status !== "ALL" ? { status: status as OrderStatus } : undefined;

  const orders = await db.order.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  function OrderTable({ filteredOrders }: { filteredOrders: typeof orders }) {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                {order.orderNumber}
              </TableCell>
              <TableCell>
                {order.user.name ?? order.user.email}
              </TableCell>
              <TableCell>{order._count.items}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={statusColors[order.status] ?? ""}
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(order.total))}
              </TableCell>
              <TableCell className="text-sm text-espresso/60">
                {new Date(order.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-sm font-medium text-champagne-gold hover:underline"
                >
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
          {filteredOrders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-espresso/50">
                No orders found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">Orders</h1>
        <p className="mt-1 text-sm text-espresso/60">
          {orders.length} orders total
        </p>
      </div>

      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-espresso">
            All Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={status} className="space-y-4">
            <TabsList className="flex-wrap">
              {statusTabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} asChild>
                  <Link
                    href={
                      tab.value === "ALL"
                        ? "/admin/orders"
                        : `/admin/orders?status=${tab.value}`
                    }
                  >
                    {tab.label}
                  </Link>
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={status}>
              <OrderTable filteredOrders={orders} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
