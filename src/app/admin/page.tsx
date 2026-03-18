import { db } from "@/lib/db";
import { StatsCards } from "@/components/admin/stats-cards";
import {
  Package,
  CheckCircle,
  FolderTree,
  Star,
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
import { formatCurrency } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [totalProducts, activeProducts, totalCategories, featuredProducts, recentProducts] =
    await Promise.all([
      db.product.count(),
      db.product.count({ where: { isActive: true } }),
      db.category.count(),
      db.product.count({ where: { isFeatured: true } }),
      db.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          category: { select: { name: true } },
          images: { take: 1, orderBy: { sortOrder: "asc" } },
        },
      }),
    ]);

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toLocaleString(),
      icon: Package,
      bgColor: "bg-deep-olive/10",
    },
    {
      title: "Active Products",
      value: activeProducts.toLocaleString(),
      icon: CheckCircle,
      bgColor: "bg-champagne-gold/10",
    },
    {
      title: "Categories",
      value: totalCategories.toLocaleString(),
      icon: FolderTree,
      bgColor: "bg-amber/10",
    },
    {
      title: "Featured",
      value: featuredProducts.toLocaleString(),
      icon: Star,
      bgColor: "bg-blush",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-espresso/60">
          Welcome back. Here&apos;s an overview of your product catalog.
        </p>
      </div>

      <StatsCards stats={stats} />

      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-espresso">
            Recently Added Products
          </CardTitle>
          <CardDescription>Last 5 products added to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Added</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium text-champagne-gold hover:underline"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>{product.category.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        product.isActive
                          ? "bg-deep-olive/20 text-deep-olive"
                          : "bg-charcoal/10 text-charcoal"
                      }
                    >
                      {product.isActive ? "Active" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(Number(product.price))}
                  </TableCell>
                  <TableCell className="text-sm text-espresso/60">
                    {new Date(product.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {recentProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-espresso/50">
                    No products yet.
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
