"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Menu,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const isActive =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-l-3 border-champagne-gold bg-champagne-gold/10 text-champagne-gold"
                : "text-ivory/70 hover:bg-ivory/5 hover:text-ivory"
            )}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function SidebarNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-charcoal lg:flex">
        <div className="flex h-16 items-center border-b border-ivory/10 px-6">
          <Link
            href="/admin"
            className="font-serif text-xl font-bold text-champagne-gold"
          >
            Teressa&apos;s Admin
          </Link>
        </div>
        <NavLinks />
      </aside>

      {/* Mobile hamburger */}
      <div className="fixed top-0 left-0 z-40 flex h-14 w-full items-center bg-charcoal px-4 lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="text-ivory hover:text-champagne-gold">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 border-none bg-charcoal p-0">
            <div className="flex h-16 items-center justify-between border-b border-ivory/10 px-6">
              <span className="font-serif text-xl font-bold text-champagne-gold">
                Admin
              </span>
              <button
                onClick={() => setOpen(false)}
                className="text-ivory hover:text-champagne-gold"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <NavLinks onClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <span className="ml-3 font-serif text-lg font-bold text-champagne-gold">
          Teressa&apos;s Admin
        </span>
      </div>
    </>
  );
}
