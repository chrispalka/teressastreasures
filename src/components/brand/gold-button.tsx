"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface GoldButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "default" | "lg" | "sm";
}

export const GoldButton = forwardRef<HTMLButtonElement, GoldButtonProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "gold-foil relative inline-flex items-center justify-center rounded-full bg-champagne-gold font-sans text-sm font-semibold uppercase tracking-[0.05em] text-espresso transition-all hover:scale-[1.02] hover:brightness-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-espresso focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          size === "sm" && "h-9 px-5 text-xs",
          size === "default" && "h-11 px-8",
          size === "lg" && "h-13 px-10 text-base",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

GoldButton.displayName = "GoldButton";
