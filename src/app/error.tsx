"use client";

import { GoldButton } from "@/components/brand/gold-button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-warm-sand px-4">
      <div className="text-center">
        <h1 className="font-serif text-5xl text-champagne-gold">Oops</h1>
        <h2 className="mt-4 font-serif text-xl text-espresso">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-espresso/60">
          We hit an unexpected snag. Please try again.
        </p>
        <div className="mt-8">
          <GoldButton onClick={() => reset()}>Try Again</GoldButton>
        </div>
      </div>
    </main>
  );
}
