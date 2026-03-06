"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, User, Menu, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCartStore } from "@/stores/cart-store";

const navLinks = [
  { label: "Shop", href: "/products" },
  { label: "Rings", href: "/categories/rings" },
  { label: "Earrings", href: "/categories/earrings" },
  { label: "Necklaces", href: "/categories/necklaces" },
  { label: "Bracelets", href: "/categories/bracelets" },
  { label: "Scarves", href: "/categories/scarves" },
];

function Logo() {
  return (
    <Link href="/" className="flex items-baseline gap-1">
      <span className="font-serif text-2xl italic text-champagne-gold">
        Teressa&apos;s
      </span>
      <span className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-espresso">
        Treasures
      </span>
    </Link>
  );
}

function NavLink({
  href,
  children,
  className,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative font-sans text-sm text-espresso transition-colors hover:text-champagne-gold",
        className
      )}
    >
      {children}
      <span className="absolute -bottom-1 left-0 h-[1.5px] w-0 bg-champagne-gold transition-all duration-300 group-hover:w-full" />
    </Link>
  );
}

function CartBadge() {
  const itemCount = useCartStore((s) => s.itemCount());

  return (
    <Link href="/cart" className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="text-espresso hover:text-champagne-gold"
        asChild
      >
        <span>
          <ShoppingBag className="h-5 w-5" />
          <span className="sr-only">Cart</span>
        </span>
      </Button>
      {itemCount > 0 && (
        <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-champagne-gold text-[10px] font-semibold text-espresso">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-blush bg-ivory">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile hamburger */}
        <div className="flex lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-espresso hover:text-champagne-gold"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-ivory p-0">
              <SheetHeader className="border-b border-blush px-6 py-4">
                <SheetTitle asChild>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md px-3 py-2.5 font-sans text-sm text-espresso transition-colors hover:bg-warm-sand hover:text-champagne-gold"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="border-t border-blush px-4 py-4">
                <Link
                  href="/account/wishlist"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 font-sans text-sm text-espresso transition-colors hover:bg-warm-sand"
                >
                  <Heart className="h-4 w-4" />
                  Wishlist
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 font-sans text-sm text-espresso transition-colors hover:bg-warm-sand"
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Logo />

        {/* Desktop navigation */}
        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            className="text-espresso hover:text-champagne-gold"
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", {
                  key: "k",
                  metaKey: true,
                  bubbles: true,
                })
              );
            }}
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search (Cmd+K)</span>
          </Button>

          {/* User account dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden text-espresso hover:text-champagne-gold sm:inline-flex"
              >
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-ivory">
              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  My Account
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/orders" className="cursor-pointer">
                  Orders
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/wishlist" className="cursor-pointer">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/login" className="cursor-pointer">
                  Sign In
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <CartBadge />
        </div>
      </div>
    </header>
  );
}
