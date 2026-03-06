import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import { StatsCards } from "@/components/admin/stats-cards";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber/20 text-amber",
  PAID: "bg-deep-olive/20 text-deep-olive",
  PROCESSING: "bg-champagne-gold/20 text-espresso",
  SHIPPED: "bg-blush text-espresso",
  DELIVERED: "bg-success/20 text-success",
  CANCELLED: "bg-error/20 text-error",
  REFUNDED: "bg-charcoal/10 text-charcoal",
};

export default async function AdminDashboardPage() {
  const [revenueResult, totalOrders, pendingOrders, lowStockCount, recentOrders] =
    await Promise.all([
      db.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["DELIVERED", "SHIPPED", "PROCESSING", "PAID"] } },
      }),
      db.order.count(),
      db.order.count({
        where: { status: { in: ["PENDING", "PAID"] } },
      }),
      db.product.count({
        where: { stock: { lt: 10 }, isActive: true },
      }),
      db.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

  const totalRevenue = Number(revenueResult._sum.total ?? 0);

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      bgColor: "bg-deep-olive/10",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      bgColor: "bg-champagne-gold/10",
    },
    {
      title: "Pending Orders",
      value: pendingOrders.toLocaleString(),
      icon: Clock,
      bgColor: "bg-amber/10",
    },
    {
      title: "Low Stock Products",
      value: lowStockCount.toLocaleString(),
      icon: AlertTriangle,
      bgColor: "bg-error/10",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-espresso/60">
          Welcome back. Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      <StatsCards stats={stats} />

      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-espresso">
            Recent Orders
          </CardTitle>
          <CardDescription>Last 5 orders placed in the store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-champagne-gold hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {order.user.name ?? order.user.email}
                  </TableCell>
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
                </TableRow>
              ))}
              {recentOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-espresso/50">
                    No orders yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
