import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewModeration } from "@/components/admin/review-moderation";
import Link from "next/link";
import type { ReviewStatus } from "@prisma/client";

interface Props {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: Props) {
  const { status = "PENDING" } = await searchParams;

  const validStatuses = ["PENDING", "APPROVED", "REJECTED"];
  const filterStatus = validStatuses.includes(status) ? status : "PENDING";

  const reviews = await db.review.findMany({
    where: { status: filterStatus as ReviewStatus },
    include: {
      product: { select: { name: true, slug: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold text-espresso">
          Reviews
        </h1>
        <p className="mt-1 text-sm text-espresso/60">
          Moderate customer reviews.
        </p>
      </div>

      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-xl text-espresso">
            Review Moderation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={filterStatus} className="space-y-4">
            <TabsList>
              <TabsTrigger value="PENDING" asChild>
                <Link href="/admin/reviews?status=PENDING">Pending</Link>
              </TabsTrigger>
              <TabsTrigger value="APPROVED" asChild>
                <Link href="/admin/reviews?status=APPROVED">Approved</Link>
              </TabsTrigger>
              <TabsTrigger value="REJECTED" asChild>
                <Link href="/admin/reviews?status=REJECTED">Rejected</Link>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={filterStatus}>
              <ReviewModeration
                reviews={reviews.map((r) => ({
                  id: r.id,
                  rating: r.rating,
                  title: r.title,
                  body: r.body,
                  status: r.status,
                  createdAt: r.createdAt.toISOString(),
                  productName: r.product.name,
                  customerName: r.user.name ?? r.user.email,
                }))}
                currentStatus={filterStatus}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
