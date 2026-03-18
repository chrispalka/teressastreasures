import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { GoldButton } from "@/components/brand/gold-button";
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
import { Input } from "@/components/ui/input";

interface Props {
  searchParams: Promise<{
    sort?: string;
    order?: string;
    search?: string;
  }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const { sort = "name", order = "asc", search = "" } = await searchParams;

  const validSortFields = ["name", "price", "createdAt"] as const;
  const sortField = validSortFields.includes(sort as typeof validSortFields[number])
    ? sort
    : "name";
  const sortOrder = order === "desc" ? "desc" : "asc";

  const products = await db.product.findMany({
    where: search
      ? { name: { contains: search, mode: "insensitive" } }
      : undefined,
    include: {
      category: { select: { name: true } },
      images: { take: 1, orderBy: { sortOrder: "asc" } },
    },
    orderBy: { [sortField]: sortOrder },
  });

  function sortLink(field: string) {
    const newOrder = sort === field && order === "asc" ? "desc" : "asc";
    const params = new URLSearchParams();
    params.set("sort", field);
    params.set("order", newOrder);
    if (search) params.set("search", search);
    return `/admin/products?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold text-espresso">
            Products
          </h1>
          <p className="mt-1 text-sm text-espresso/60">
            {products.length} products total
          </p>
        </div>
        <Link href="/admin/products/new">
          <GoldButton size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </GoldButton>
        </Link>
      </div>

      <Card className="border-blush/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl text-espresso">
              All Products
            </CardTitle>
            <form action="/admin/products" method="GET">
              <Input
                name="search"
                placeholder="Search products..."
                defaultValue={search}
                className="w-64"
              />
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Image</TableHead>
                <TableHead>
                  <Link href={sortLink("name")} className="hover:text-champagne-gold">
                    Name {sort === "name" && (order === "asc" ? "\u2191" : "\u2193")}
                  </Link>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <Link href={sortLink("price")} className="hover:text-champagne-gold">
                    Price {sort === "price" && (order === "asc" ? "\u2191" : "\u2193")}
                  </Link>
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    {product.images[0] ? (
                      <Image
                        src={product.images[0].url}
                        alt={product.images[0].alt ?? product.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-md object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-warm-sand text-xs text-espresso/40">
                        No img
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-espresso/60">
                    {product.category.name}
                  </TableCell>
                  <TableCell>{formatCurrency(Number(product.price))}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.isActive ? "default" : "secondary"}
                      className={
                        product.isActive
                          ? "bg-success/20 text-success"
                          : "bg-charcoal/10 text-charcoal"
                      }
                    >
                      {product.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.isFeatured && (
                      <Badge className="bg-champagne-gold/20 text-champagne-gold">
                        Featured
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-sm font-medium text-champagne-gold hover:underline"
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center text-espresso/50"
                  >
                    No products found.
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
