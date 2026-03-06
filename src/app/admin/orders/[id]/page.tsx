import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { OrderStatusForm } from "@/components/admin/order-status-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber/20 text-amber",
  PAID: "bg-deep-olive/20 text-deep-olive",
  PROCESSING: "bg-champagne-gold/20 text-espresso",
  SHIPPED: "bg-blush text-espresso",
  DELIVERED: "bg-success/20 text-success",
  CANCELLED: "bg-error/20 text-error",
  REFUNDED: "bg-charcoal/10 text-charcoal",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;

  const order = await db.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true } },
      items: {
        include: {
          product: {
            select: { name: true, slug: true, images: { take: 1 } },
          },
        },
      },
      shippingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="flex items-center gap-1 text-sm text-espresso/60 hover:text-espresso"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Orders
        </Link>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Order {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-espresso/60">
            Placed on {new Date(order.createdAt).toLocaleDateString()}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`text-sm ${statusColors[order.status] ?? ""}`}
        >
          {order.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Order Info */}
        <Card className="border-blush/50">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-espresso">
              Customer
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="font-medium">{order.user.name ?? "No name"}</p>
            <p className="text-espresso/60">{order.user.email}</p>
          </CardContent>
        </Card>

        <Card className="border-blush/50">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-espresso">
              Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {order.shippingAddress ? (
              <div className="space-y-1">
                <p className="font-medium">{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.line1}</p>
                {order.shippingAddress.line2 && (
                  <p>{order.shippingAddress.line2}</p>
                )}
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                  {order.shippingAddress.postalCode}
                </p>
              </div>
            ) : (
              <p className="text-espresso/50">No shipping address on file.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-blush/50">
          <CardHeader>
            <CardTitle className="font-serif text-lg text-espresso">
              Order Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-espresso/60">Subtotal</span>
              <span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso/60">Shipping</span>
              <span>{formatCurrency(Number(order.shipping))}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-espresso/60">Tax</span>
              <span>{formatCurrency(Number(order.tax))}</span>
            </div>
            <div className="flex justify-between border-t border-blush pt-2 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(Number(order.total))}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-espresso">
            Items
          </CardTitle>
          <CardDescription>
            {order.items.length} item{order.items.length !== 1 ? "s" : ""} in
            this order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Variant</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {item.product.name}
                  </TableCell>
                  <TableCell className="text-espresso/60">
                    {item.variantInfo ?? "-"}
                  </TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(item.unitPrice))}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(item.total))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Status Update */}
      <OrderStatusForm
        orderId={order.id}
        currentStatus={order.status}
        trackingNumber={order.trackingNumber ?? ""}
        notes={order.notes ?? ""}
      />
    </div>
  );
}
