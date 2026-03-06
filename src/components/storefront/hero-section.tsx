import Link from "next/link";
import { OrganicBlob } from "@/components/brand/organic-blob";
import { GoldButton } from "@/components/brand/gold-button";

export function HeroSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center bg-warm-sand overflow-hidden">
      {/* Decorative blobs */}
      <OrganicBlob
        variant={1}
        className="top-[-10%] right-[-5%] h-[500px] w-[500px]"
        opacity={0.12}
      />
      <OrganicBlob
        variant={2}
        className="bottom-[-15%] left-[-8%] h-[600px] w-[600px]"
        opacity={0.1}
      />
      <OrganicBlob
        variant={3}
        className="top-[20%] left-[40%] h-[300px] w-[300px]"
        opacity={0.07}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left column — text */}
          <div className="flex flex-col gap-6">
            <h1 className="font-serif text-5xl md:text-7xl text-espresso leading-tight">
              Treasures Worth{" "}
              <span className="block italic text-champagne-gold">
                Discovering
              </span>
            </h1>

            <p className="font-sans text-lg text-espresso/70 max-w-md">
              Curated jewelry, accessories, and one-of-a-kind finds — each piece
              hand-selected with love by Teressa.
            </p>

            <div>
              <Link href="/products">
                <GoldButton size="lg">Shop the Collection</GoldButton>
              </Link>
            </div>
          </div>

          {/* Right column — placeholder image */}
          <div className="flex justify-center lg:justify-end">
            <div className="rounded-2xl bg-blush aspect-[4/5] w-full max-w-md flex items-center justify-center">
              <span className="font-serif text-xl text-espresso/30">
                Hero Image
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Leopard-pattern decorative band at bottom */}
      <div className="absolute bottom-0 left-0 h-3 w-full leopard-pattern opacity-[0.06]" />
    </section>
  );
}
