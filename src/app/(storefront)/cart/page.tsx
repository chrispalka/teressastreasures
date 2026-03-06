"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { GoldButton } from "@/components/brand/gold-button";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FLAT_SHIPPING = 5.95;
const FREE_SHIPPING_THRESHOLD = 75;
const TAX_RATE = 0.08;

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  if (items.length === 0) {
    return (
      <main className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-20 text-center sm:px-6 lg:px-8">
        <ShoppingBag className="mb-6 h-24 w-24 text-champagne-gold/30" />
        <h1 className="font-serif text-2xl text-espresso md:text-3xl">
          Your Bag is Empty
        </h1>
        <p className="mt-3 max-w-md font-serif italic text-espresso/60">
          It looks like you haven&apos;t found your treasure yet. Start
          exploring our collection and find something you love.
        </p>
        <Link href="/products" className="mt-8">
          <GoldButton>Explore the Collection</GoldButton>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="mb-8 font-serif text-2xl text-espresso md:text-3xl">
        Your Bag
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items list */}
        <div className="lg:col-span-2">
          <div className="divide-y divide-warm-sand/30">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                {/* Thumbnail */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-warm-sand/20 sm:h-28 sm:w-28">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 96px, 112px"
                      className="object-cover"
                    />
                  )}
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-serif text-base font-medium text-espresso hover:text-champagne-gold"
                      >
                        {item.name}
                      </Link>
                      {item.variantInfo && (
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {item.variantInfo}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatCurrency(item.price)} each
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground transition-colors hover:text-red-500"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <span className="w-10 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.maxStock}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    {/* Line total */}
                    <span className="text-sm font-semibold text-espresso">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-warm-sand/30">
            <CardHeader>
              <CardTitle className="font-serif text-lg text-espresso">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-espresso">
                  {formatCurrency(subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Estimated Shipping
                </span>
                <span className="text-espresso">
                  {shipping === 0 ? "Free" : formatCurrency(shipping)}
                </span>
              </div>
              {shipping === 0 && (
                <p className="text-xs text-deep-olive">
                  You qualify for free shipping!
                </p>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Tax</span>
                <span className="text-espresso">{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span className="text-espresso">Total</span>
                <span className="text-espresso">{formatCurrency(total)}</span>
              </div>

              <Link href="/checkout" className="mt-4 block">
                <GoldButton className="w-full">
                  Proceed to Checkout
                </GoldButton>
              </Link>

              <Link href="/products">
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                >
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
