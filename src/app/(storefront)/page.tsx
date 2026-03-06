import { HeroSection } from "@/components/storefront/hero-section";
import { CategoryShowcase } from "@/components/storefront/category-showcase";
import { SectionDivider } from "@/components/brand/section-divider";
import { NewsletterSignup } from "@/components/storefront/newsletter-signup";

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

      {/* Testimonial */}
      <section className="bg-blush py-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-serif text-xl italic text-espresso/80 md:text-2xl">
            &ldquo;Every piece from Teressa&apos;s Treasures makes me feel like
            the boldest version of myself. The quality is incredible.&rdquo;
          </p>
          <p className="mt-4 font-sans text-sm font-semibold text-espresso/60">
            — Sarah M. ★★★★★
          </p>
        </div>
      </section>

      <NewsletterSignup />
    </>
  );
}
