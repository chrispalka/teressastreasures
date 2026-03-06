"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Loader2, ArrowLeft } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { GoldButton } from "@/components/brand/gold-button";
import { formatCurrency } from "@/lib/utils";
import { createCheckoutSession } from "@/app/actions/checkout";

export default function CheckoutPage() {
  const { items, subtotal } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sub = subtotal();
  const shippingCost = sub >= 75 ? 0 : 5.95;
  const tax = sub * 0.08;
  const total = sub + shippingCost + tax;

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
        <ShoppingBag className="h-16 w-16 text-champagne-gold" />
        <h1 className="font-serif text-2xl text-espresso">
          Your cart is empty
        </h1>
        <p className="text-charcoal/60">
          Add some treasures before checking out.
        </p>
        <Link href="/products">
          <GoldButton>Browse Products</GoldButton>
        </Link>
      </div>
    );
  }

  async function handleCheckout() {
    setIsLoading(true);
    setError(null);

    try {
      const cartItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        name: item.name,
        price: item.price,
        image: item.image,
      }));

      const result = await createCheckoutSession(cartItems);

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <Link
        href="/cart"
        className="mb-8 inline-flex items-center gap-2 text-sm text-charcoal/60 transition-colors hover:text-espresso"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to cart
      </Link>

      <h1 className="mb-8 font-serif text-3xl text-espresso">Checkout</h1>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Order Items */}
        <div className="lg:col-span-3">
          <div className="rounded-xl bg-ivory p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-lg text-espresso">
              Order Items
            </h2>
            <div className="divide-y divide-warm-sand/40">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-warm-sand/20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-serif text-sm text-espresso">
                      {item.name}
                    </p>
                    {item.variantInfo && (
                      <p className="text-xs text-charcoal/50">
                        {item.variantInfo}
                      </p>
                    )}
                    <p className="text-xs text-charcoal/60">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 font-sans text-sm font-semibold text-espresso">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-xl bg-ivory p-6 shadow-sm">
            <h2 className="mb-4 font-serif text-lg text-espresso">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-charcoal/70">
                <span>Subtotal</span>
                <span>{formatCurrency(sub)}</span>
              </div>
              <div className="flex justify-between text-charcoal/70">
                <span>Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-deep-olive font-medium">Free</span>
                  ) : (
                    formatCurrency(shippingCost)
                  )}
                </span>
              </div>
              {shippingCost > 0 && (
                <p className="text-xs text-champagne-gold">
                  Free shipping on orders over $75
                </p>
              )}
              <div className="flex justify-between text-charcoal/70">
                <span>Tax (8%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div className="border-t border-warm-sand/40 pt-3">
                <div className="flex justify-between font-semibold text-espresso">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-red-50 p-3 text-xs text-red-600">
                {error}
              </p>
            )}

            <GoldButton
              className="mt-6 w-full"
              size="lg"
              onClick={handleCheckout}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting to Stripe...
                </>
              ) : (
                "Pay with Stripe"
              )}
            </GoldButton>

            <p className="mt-3 text-center text-xs text-charcoal/40">
              Secure payment powered by Stripe
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
