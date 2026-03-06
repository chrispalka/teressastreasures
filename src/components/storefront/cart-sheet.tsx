"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatCurrency } from "@/lib/utils";
import { GoldButton } from "@/components/brand/gold-button";
import { SectionDivider } from "@/components/brand/section-divider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FLAT_SHIPPING = 5.95;
const FREE_SHIPPING_THRESHOLD = 75;
const TAX_RATE = 0.08;

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const subtotal = useCartStore((s) => s.subtotal());

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + shipping + tax;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-serif text-xl text-espresso">
            Your Bag
          </SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"} in your bag
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
            <ShoppingBag className="h-16 w-16 text-champagne-gold/40" />
            <p className="font-serif text-lg italic text-espresso/60">
              Your bag is empty &mdash; time to treasure hunt!
            </p>
            <Link href="/products" onClick={() => onOpenChange(false)}>
              <GoldButton className="w-full">Browse Products</GoldButton>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart items */}
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-3 py-4">
                    {/* Thumbnail */}
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md bg-warm-sand/20">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={() => onOpenChange(false)}
                          className="text-sm font-medium text-espresso hover:text-champagne-gold"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="ml-2 text-muted-foreground transition-colors hover:text-red-500"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {item.variantInfo && (
                        <span className="text-xs text-muted-foreground">
                          {item.variantInfo}
                        </span>
                      )}

                      <div className="mt-1 flex items-center justify-between">
                        {/* Quantity stepper */}
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() =>
                              updateQuantity(item.productId, item.quantity + 1)
                            }
                            disabled={item.quantity >= item.maxStock}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>

                        {/* Line total */}
                        <span className="text-sm font-semibold text-espresso">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {index < items.length - 1 && (
                    <SectionDivider className="py-1" />
                  )}
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t px-4 pt-4">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-espresso">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    Estimated Shipping
                  </span>
                  <span className="text-espresso">
                    {shipping === 0 ? "Free" : formatCurrency(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="text-espresso">
                    {formatCurrency(tax)}
                  </span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span className="text-espresso">Total</span>
                  <span className="text-espresso">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>
            </div>

            <SheetFooter className="flex-col gap-2">
              <Link href="/checkout" onClick={() => onOpenChange(false)}>
                <GoldButton className="w-full">
                  Proceed to Checkout
                </GoldButton>
              </Link>
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => onOpenChange(false)}
              >
                Continue Shopping
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
