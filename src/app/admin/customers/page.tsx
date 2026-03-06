import { db } from "@/lib/db";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";

interface Props {
  searchParams: Promise<{ search?: string }>;
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const { search = "" } = await searchParams;

  const customers = await db.user.findMany({
    where: {
      role: "CUSTOMER",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: {
      orders: {
        select: { total: true },
      },
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const customersWithStats = customers.map((customer) => ({
    id: customer.id,
    name: customer.name,
    email: customer.email,
    orderCount: customer._count.orders,
    totalSpent: customer.orders.reduce(
      (sum, order) => sum + Number(order.total),
      0
    ),
    joinDate: customer.createdAt,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Customers
        </h1>
        <p className="mt-1 text-sm text-espresso/60">
          {customersWithStats.length} customers total
        </p>
      </div>

      <Card className="border-blush/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl text-espresso">
              All Customers
            </CardTitle>
            <form action="/admin/customers" method="GET">
              <Input
                name="search"
                placeholder="Search by name or email..."
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-center">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersWithStats.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.name ?? "No name"}
                  </TableCell>
                  <TableCell className="text-espresso/60">
                    {customer.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.orderCount}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(customer.totalSpent)}
                  </TableCell>
                  <TableCell className="text-sm text-espresso/60">
                    {new Date(customer.joinDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {customersWithStats.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-espresso/50"
                  >
                    No customers found.
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
