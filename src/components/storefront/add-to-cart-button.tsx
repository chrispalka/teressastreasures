"use client";

import { useState, useCallback } from "react";
import { Minus, Plus, Check, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { GoldButton } from "@/components/brand/gold-button";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";

interface AddToCartProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  stock: number;
}

interface AddToCartButtonProps {
  product: AddToCartProduct;
  selectedVariant?: string;
}

export function AddToCartButton({ product, selectedVariant }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const maxQty = product.stock;
  const isOutOfStock = maxQty <= 0;

  const decrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.max(1, prev - 1));
  }, []);

  const incrementQuantity = useCallback(() => {
    setQuantity((prev) => Math.min(maxQty, prev + 1));
  }, [maxQty]);

  function handleAddToCart() {
    if (isOutOfStock) return;

    addItem({
      id: `${product.id}${selectedVariant ? `-${selectedVariant}` : ""}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.image,
      quantity,
      variantInfo: selectedVariant,
      maxStock: maxQty,
    });

    setIsAdded(true);
    toast.success(`${product.name} added to your bag`, {
      description: `Quantity: ${quantity}`,
    });

    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  }

  if (isOutOfStock) {
    return (
      <div className="space-y-3">
        <GoldButton disabled className="w-full opacity-50">
          Out of Stock
        </GoldButton>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Quantity selector */}
      <div className="flex items-center gap-1">
        <span className="text-sm font-medium text-espresso mr-3">Quantity</span>
        <button
          type="button"
          onClick={decrementQuantity}
          disabled={quantity <= 1}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-blush text-espresso transition-colors hover:bg-blush disabled:opacity-40"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center font-sans text-sm font-semibold text-espresso">
          {quantity}
        </span>
        <button
          type="button"
          onClick={incrementQuantity}
          disabled={quantity >= maxQty}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-blush text-espresso transition-colors hover:bg-blush disabled:opacity-40"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
        {maxQty <= 5 && (
          <span className="ml-2 text-xs text-amber">
            Only {maxQty} left
          </span>
        )}
      </div>

      {/* Add to Bag button */}
      <GoldButton
        onClick={handleAddToCart}
        disabled={isAdded}
        className={cn(
          "w-full gap-2 transition-all duration-300",
          isAdded && "bg-success text-ivory hover:brightness-100"
        )}
        size="lg"
      >
        {isAdded ? (
          <>
            <Check className="h-5 w-5" />
            Added!
          </>
        ) : (
          <>
            <ShoppingBag className="h-5 w-5" />
            Add to Bag
          </>
        )}
      </GoldButton>
    </div>
  );
}
