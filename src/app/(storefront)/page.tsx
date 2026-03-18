import { HeroSection } from "@/components/storefront/hero-section";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { SectionDivider } from "@/components/brand/section-divider";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryShowcase />

      {/* Featured Products - placeholder until we wire up DB */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <SectionDivider />
        <h2 className="text-center font-serif text-3xl text-espresso">
          Curated Picks
        </h2>
        <p className="mt-2 text-center text-sm text-espresso/60">
          Coming soon — our handpicked favorites will appear here.
        </p>
      </section>

    </>
  );
}
