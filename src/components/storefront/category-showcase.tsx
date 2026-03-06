import Link from "next/link";
import { SectionDivider } from "@/components/brand/section-divider";

const categories = [
  { name: "Rings", slug: "rings" },
  { name: "Earrings", slug: "earrings" },
  { name: "Bracelets", slug: "bracelets" },
  { name: "Necklaces", slug: "necklaces" },
  { name: "Scarves", slug: "scarves" },
  { name: "Hats & Gloves", slug: "hats-gloves" },
];

export function CategoryShowcase() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section heading */}
        <h2 className="font-serif text-3xl text-espresso text-center">
          Explore by Category
        </h2>
        <SectionDivider />

        {/* Category grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="relative overflow-hidden rounded-xl aspect-[3/4] cursor-pointer group block"
            >
              {/* Placeholder image background */}
              <div className="absolute inset-0 bg-blush flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <span className="font-sans text-sm text-espresso/25">
                  {category.name}
                </span>
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso/60 to-transparent" />

              {/* Category name */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3
                  className="font-serif text-xl text-white"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}
                >
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
