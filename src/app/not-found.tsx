import Link from "next/link";
import { GoldButton } from "@/components/brand/gold-button";
import { OrganicBlob } from "@/components/brand/organic-blob";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center bg-warm-sand px-4">
      <OrganicBlob
        variant={2}
        className="-right-32 -top-32 h-96 w-96"
        color="#E8CFC0"
        opacity={0.2}
      />
      <div className="relative z-10 text-center">
        <h1 className="font-serif text-7xl text-champagne-gold">404</h1>
        <h2 className="mt-4 font-serif text-2xl text-espresso">
          Treasure Not Found
        </h2>
        <p className="mt-2 font-serif text-lg italic text-espresso/60">
          This page seems to have wandered off the trail...
        </p>
        <div className="mt-8">
          <Link href="/">
            <GoldButton>Back to Home</GoldButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
