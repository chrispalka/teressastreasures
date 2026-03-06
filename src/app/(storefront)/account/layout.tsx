import Link from "next/link";
import { redirect } from "next/navigation";
import { User, Package, Heart, Settings } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/account", icon: User, label: "Account" },
  { href: "/account/orders", icon: Package, label: "Orders" },
  { href: "/account/wishlist", icon: Heart, label: "Wishlist" },
  { href: "/account/settings", icon: Settings, label: "Settings" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Mobile: horizontal scroll tabs */}
      <nav className="mb-6 flex gap-1 overflow-x-auto border-b border-warm-sand/30 pb-3 md:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              "text-charcoal/60 hover:bg-champagne-gold/10 hover:text-espresso",
              "[&.active]:bg-champagne-gold/15 [&.active]:text-espresso"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden w-56 shrink-0 md:block">
          <nav className="sticky top-24 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  "text-charcoal/60 hover:bg-champagne-gold/10 hover:text-espresso"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          <div className="rounded-2xl bg-warm-sand/20 p-6 sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
