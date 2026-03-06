import Link from "next/link";
import { redirect } from "next/navigation";
import { Package, Heart, Settings, ChevronRight } from "lucide-react";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  const [orderCount, wishlistCount] = await Promise.all([
    db.order.count({ where: { userId: session.user.id } }),
    db.wishlistItem.count({ where: { userId: session.user.id } }),
  ]);

  const quickLinks = [
    {
      href: "/account/orders",
      icon: Package,
      label: "Orders",
      description: "View your order history",
    },
    {
      href: "/account/wishlist",
      icon: Heart,
      label: "Wishlist",
      description: "Items you've saved",
    },
    {
      href: "/account/settings",
      icon: Settings,
      label: "Settings",
      description: "Manage your profile",
    },
  ];

  return (
    <div>
      <h1 className="mb-2 font-serif text-3xl text-espresso">
        Welcome back, {session.user.name?.split(" ")[0] || "there"}!
      </h1>
      <p className="mb-8 text-charcoal/60">
        Manage your account and view your treasures.
      </p>

      {/* Quick Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-ivory p-6 shadow-sm">
          <p className="text-sm text-charcoal/60">Total Orders</p>
          <p className="mt-1 font-serif text-3xl text-espresso">
            {orderCount}
          </p>
        </div>
        <div className="rounded-xl bg-ivory p-6 shadow-sm">
          <p className="text-sm text-charcoal/60">Wishlist Items</p>
          <p className="mt-1 font-serif text-3xl text-espresso">
            {wishlistCount}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="space-y-3">
        {quickLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex items-center gap-4 rounded-xl bg-ivory p-4 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne-gold/10">
              <link.icon className="h-5 w-5 text-champagne-gold" />
            </div>
            <div className="flex-1">
              <p className="font-serif text-sm font-medium text-espresso">
                {link.label}
              </p>
              <p className="text-xs text-charcoal/50">{link.description}</p>
            </div>
            <ChevronRight className="h-4 w-4 text-charcoal/30" />
          </Link>
        ))}
      </div>
    </div>
  );
}
