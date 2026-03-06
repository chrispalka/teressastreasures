import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Teressa's Treasures database…");

  // ── Cleanup (order matters for FK constraints) ──────────────
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.product.deleteMany();
  console.log("  Cleared existing products & related records.");

  // ── Admin user ──────────────────────────────────────────────
  const hashedPassword = await bcrypt.hash("ChangeMe123!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@teressastreasures.com" },
    update: { password: hashedPassword, role: "ADMIN", name: "Teressa Admin" },
    create: {
      email: "admin@teressastreasures.com",
      password: hashedPassword,
      role: "ADMIN",
      name: "Teressa Admin",
    },
  });
  console.log(`  Admin user ready: ${admin.email}`);

  // ── Categories ──────────────────────────────────────────────
  const categoryData = [
    { name: "Rings", slug: "rings", description: "Handpicked rings that tell a story — from delicate stacking bands to bold statement pieces.", sortOrder: 1 },
    { name: "Earrings", slug: "earrings", description: "Earrings for every mood, from understated studs to show-stopping chandeliers.", sortOrder: 2 },
    { name: "Bracelets", slug: "bracelets", description: "Wrist-worthy treasures — cuffs, bangles, and chains to layer your way.", sortOrder: 3 },
    { name: "Necklaces", slug: "necklaces", description: "Necklaces crafted to sit beautifully at every length, from chokers to long pendants.", sortOrder: 4 },
    { name: "Scarves", slug: "scarves", description: "Luxurious scarves in sumptuous fabrics that add warmth and effortless elegance.", sortOrder: 5 },
    { name: "Hats", slug: "hats", description: "Chic hats and headwear to crown every outfit with character.", sortOrder: 6 },
    { name: "Gloves", slug: "gloves", description: "Refined gloves that pair timeless style with everyday comfort.", sortOrder: 7 },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoryData) {
    const result = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
    categories[cat.slug] = result.id;
  }
  console.log(`  ${Object.keys(categories).length} categories upserted.`);

  // ── Helper: placeholder image URL ───────────────────────────
  function img(name: string, idx: number): { url: string; alt: string; sortOrder: number } {
    const encoded = name.replace(/ /g, "+");
    return {
      url: `https://placehold.co/800x800/F5EDE3/3C2415?text=${encoded}`,
      alt: name,
      sortOrder: idx,
    };
  }

  // ── Products ────────────────────────────────────────────────
  interface SeedProduct {
    name: string;
    slug: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    stock: number;
    material: string;
    isFeatured?: boolean;
    categorySlug: string;
    tags: string[];
    images: { url: string; alt: string; sortOrder: number }[];
  }

  const products: SeedProduct[] = [
    // ── Rings ──
    {
      name: "Wild Heart Statement Ring",
      slug: "wild-heart-statement-ring",
      description: "Bold and unapologetic, the Wild Heart ring features a sculptural silhouette that catches the light from every angle. Crafted in polished sterling silver, it's the piece that starts conversations.",
      price: 36.0,
      sku: "TT-RN-001",
      stock: 28,
      material: "Sterling Silver",
      isFeatured: true,
      categorySlug: "rings",
      tags: ["statement", "silver", "bold", "bestseller"],
      images: [img("Wild+Heart+Ring", 0), img("Wild+Heart+Ring+Side", 1)],
    },
    {
      name: "Honeycomb Stacking Ring",
      slug: "honeycomb-stacking-ring",
      description: "Inspired by nature's geometry, this dainty hexagonal band is designed to stack and layer. Wear one for subtlety or three for a hive of style.",
      price: 24.0,
      sku: "TT-RN-002",
      stock: 45,
      material: "14K Gold Fill",
      categorySlug: "rings",
      tags: ["stacking", "gold", "minimalist", "dainty"],
      images: [img("Honeycomb+Ring", 0), img("Honeycomb+Ring+Stack", 1), img("Honeycomb+Ring+Detail", 2)],
    },
    {
      name: "Moonstone Reverie Ring",
      slug: "moonstone-reverie-ring",
      description: "A luminous rainbow moonstone sits nestled in a hand-set bezel, casting an ethereal blue flash. This ring feels like wearing a tiny piece of the sky on your finger.",
      price: 58.0,
      compareAtPrice: 72.0,
      sku: "TT-RN-003",
      stock: 12,
      material: "Sterling Silver with Moonstone",
      categorySlug: "rings",
      tags: ["gemstone", "moonstone", "boho", "sale"],
      images: [img("Moonstone+Ring", 0), img("Moonstone+Ring+Close", 1)],
    },
    {
      name: "Twisted Vine Band",
      slug: "twisted-vine-band",
      description: "Organic and elegant, the Twisted Vine band wraps around the finger like a tendril in a secret garden. Perfect as a wedding band or a timeless everyday ring.",
      price: 42.0,
      sku: "TT-RN-004",
      stock: 33,
      material: "Rose Gold Vermeil",
      categorySlug: "rings",
      tags: ["rose gold", "wedding", "organic", "everyday"],
      images: [img("Twisted+Vine+Band", 0), img("Twisted+Vine+Detail", 1), img("Twisted+Vine+Hand", 2)],
    },

    // ── Earrings ──
    {
      name: "Golden Hour Hoop Earrings",
      slug: "golden-hour-hoop-earrings",
      description: "These medium-sized hoops catch the warm light of late afternoon and hold it all day. Gold-plated brass with a satin finish gives them a lived-in luxury feel.",
      price: 42.0,
      sku: "TT-ER-001",
      stock: 38,
      material: "Gold-Plated Brass",
      isFeatured: true,
      categorySlug: "earrings",
      tags: ["hoops", "gold", "everyday", "bestseller"],
      images: [img("Golden+Hour+Hoops", 0), img("Golden+Hour+Hoops+Worn", 1), img("Golden+Hour+Hoops+Detail", 2)],
    },
    {
      name: "Petal Drop Earrings",
      slug: "petal-drop-earrings",
      description: "Delicate hammered petals dangle gracefully with every turn of your head. Lightweight enough for all-day wear, striking enough for evening plans.",
      price: 34.0,
      sku: "TT-ER-002",
      stock: 25,
      material: "Sterling Silver",
      categorySlug: "earrings",
      tags: ["drop", "silver", "hammered", "lightweight"],
      images: [img("Petal+Drop+Earrings", 0), img("Petal+Drop+Detail", 1)],
    },
    {
      name: "Celestial Stud Set",
      slug: "celestial-stud-set",
      description: "A trio of tiny studs — a crescent moon, a star, and a sun — so you can mix and match your cosmic mood. Sold as a set of three pairs.",
      price: 28.0,
      sku: "TT-ER-003",
      stock: 50,
      material: "Gold Vermeil",
      categorySlug: "earrings",
      tags: ["studs", "set", "celestial", "gold", "gift"],
      images: [img("Celestial+Studs", 0), img("Celestial+Studs+Flat", 1), img("Celestial+Studs+Worn", 2)],
    },
    {
      name: "Sahara Chandelier Earrings",
      slug: "sahara-chandelier-earrings",
      description: "Dripping with intricate metalwork inspired by Moroccan lanterns, these chandelier earrings are made for nights that turn into stories. Surprisingly light despite their dramatic silhouette.",
      price: 56.0,
      compareAtPrice: 68.0,
      sku: "TT-ER-004",
      stock: 9,
      material: "Antiqued Brass",
      categorySlug: "earrings",
      tags: ["chandelier", "statement", "boho", "sale"],
      images: [img("Sahara+Earrings", 0), img("Sahara+Earrings+Close", 1)],
    },

    // ── Bracelets ──
    {
      name: "Midnight Safari Cuff Bracelet",
      slug: "midnight-safari-cuff-bracelet",
      description: "Rich enamel in deep midnight tones wraps around a sturdy brass cuff adorned with subtle animal motifs. A wearable piece of art that pairs with everything from linen to leather.",
      price: 68.0,
      sku: "TT-BR-001",
      stock: 15,
      material: "Enamel on Brass",
      isFeatured: true,
      categorySlug: "bracelets",
      tags: ["cuff", "enamel", "statement", "bestseller"],
      images: [img("Midnight+Safari+Cuff", 0), img("Midnight+Safari+Detail", 1), img("Midnight+Safari+Worn", 2)],
    },
    {
      name: "Woven Friendship Bracelet",
      slug: "woven-friendship-bracelet",
      description: "Hand-braided cotton threads in sun-faded pastels give this bracelet carefree beach-day energy. Adjustable sliding knot fits every wrist.",
      price: 18.0,
      sku: "TT-BR-002",
      stock: 48,
      material: "Waxed Cotton Thread",
      categorySlug: "bracelets",
      tags: ["friendship", "cotton", "adjustable", "casual"],
      images: [img("Woven+Bracelet", 0), img("Woven+Bracelet+Close", 1)],
    },
    {
      name: "Chain Link Layering Bracelet",
      slug: "chain-link-layering-bracelet",
      description: "A modern flat chain in warm gold that sits beautifully alone or stacked alongside your watch. The lobster clasp and two-inch extender make it effortlessly adjustable.",
      price: 46.0,
      sku: "TT-BR-003",
      stock: 30,
      material: "18K Gold Plated Stainless Steel",
      categorySlug: "bracelets",
      tags: ["chain", "layering", "gold", "everyday"],
      images: [img("Chain+Link+Bracelet", 0), img("Chain+Link+Stack", 1), img("Chain+Link+Clasp", 2)],
    },

    // ── Necklaces ──
    {
      name: "Savanna Wrap Necklace",
      slug: "savanna-wrap-necklace",
      description: "A versatile gold vermeil chain that can be worn as a choker, doubled up, or draped long for effortless layering. One necklace, infinite possibilities.",
      price: 54.0,
      sku: "TT-NK-001",
      stock: 22,
      material: "Gold Vermeil",
      isFeatured: true,
      categorySlug: "necklaces",
      tags: ["wrap", "versatile", "gold", "layering"],
      images: [img("Savanna+Wrap+Necklace", 0), img("Savanna+Wrap+Styled", 1)],
    },
    {
      name: "Teardrop Pendant Necklace",
      slug: "teardrop-pendant-necklace",
      description: "A single polished teardrop pendant hangs from a fine cable chain, catching the light like a drop of morning dew. Understated elegance at its purest.",
      price: 38.0,
      sku: "TT-NK-002",
      stock: 35,
      material: "Sterling Silver",
      categorySlug: "necklaces",
      tags: ["pendant", "silver", "minimalist", "everyday"],
      images: [img("Teardrop+Pendant", 0), img("Teardrop+Pendant+Worn", 1), img("Teardrop+Pendant+Close", 2)],
    },
    {
      name: "Turquoise Horizon Necklace",
      slug: "turquoise-horizon-necklace",
      description: "Natural turquoise beads graduate in size across a delicate gold chain, evoking wide desert skies at dusk. Each stone is unique, making every piece one of a kind.",
      price: 72.0,
      compareAtPrice: 88.0,
      sku: "TT-NK-003",
      stock: 8,
      material: "Natural Turquoise on Gold Fill",
      categorySlug: "necklaces",
      tags: ["turquoise", "gemstone", "boho", "sale", "unique"],
      images: [img("Turquoise+Necklace", 0), img("Turquoise+Necklace+Detail", 1)],
    },
    {
      name: "Pearl Strand Classic",
      slug: "pearl-strand-classic",
      description: "Freshwater pearls hand-knotted on silk thread bring timeless grace to any neckline. A treasure you will reach for again and again, season after season.",
      price: 96.0,
      sku: "TT-NK-004",
      stock: 14,
      material: "Freshwater Pearl on Silk",
      categorySlug: "necklaces",
      tags: ["pearl", "classic", "bridal", "timeless"],
      images: [img("Pearl+Strand", 0), img("Pearl+Strand+Worn", 1), img("Pearl+Strand+Clasp", 2)],
    },

    // ── Scarves ──
    {
      name: "Cashmere Cloud Scarf",
      slug: "cashmere-cloud-scarf",
      description: "Unbelievably soft and feather-light, this pure cashmere scarf drapes like a dream. Available in a warm oatmeal hue that goes with absolutely everything in your closet.",
      price: 89.0,
      sku: "TT-SC-001",
      stock: 18,
      material: "100% Cashmere",
      categorySlug: "scarves",
      tags: ["cashmere", "luxury", "neutral", "gift"],
      images: [img("Cashmere+Cloud+Scarf", 0), img("Cashmere+Cloud+Draped", 1), img("Cashmere+Cloud+Texture", 2)],
    },
    {
      name: "Botanical Garden Silk Scarf",
      slug: "botanical-garden-silk-scarf",
      description: "A riot of hand-illustrated florals printed on lustrous silk twill. Wear it around your neck, tie it to your handbag, or frame it as art — it's that beautiful.",
      price: 64.0,
      sku: "TT-SC-002",
      stock: 20,
      material: "100% Silk Twill",
      categorySlug: "scarves",
      tags: ["silk", "floral", "printed", "versatile"],
      images: [img("Botanical+Silk+Scarf", 0), img("Botanical+Silk+Detail", 1)],
    },
    {
      name: "Oversized Plaid Blanket Scarf",
      slug: "oversized-plaid-blanket-scarf",
      description: "Wrap yourself in this generously sized blanket scarf on crisp autumn mornings. The heritage plaid in warm rusts and creams makes every coffee run feel like a countryside stroll.",
      price: 48.0,
      sku: "TT-SC-003",
      stock: 32,
      material: "Brushed Wool Blend",
      categorySlug: "scarves",
      tags: ["blanket", "plaid", "wool", "autumn", "cozy"],
      images: [img("Plaid+Blanket+Scarf", 0), img("Plaid+Blanket+Wrapped", 1), img("Plaid+Blanket+Folded", 2)],
    },

    // ── Hats ──
    {
      name: "Outback Wide Brim Fedora",
      slug: "outback-wide-brim-fedora",
      description: "A classic wool felt fedora with a wide brim that shades your eyes and frames your face beautifully. The leather band and brass buckle add an adventurous finish.",
      price: 56.0,
      sku: "TT-HT-001",
      stock: 16,
      material: "100% Wool Felt",
      categorySlug: "hats",
      tags: ["fedora", "wool", "wide brim", "classic"],
      images: [img("Outback+Fedora", 0), img("Outback+Fedora+Side", 1)],
    },
    {
      name: "Ribbed Knit Beanie",
      slug: "ribbed-knit-beanie",
      description: "Chunky ribbed merino wool keeps you warm without the itch. The relaxed slouchy fit works whether you are hitting the slopes or the farmers' market.",
      price: 32.0,
      sku: "TT-HT-002",
      stock: 40,
      material: "Merino Wool",
      categorySlug: "hats",
      tags: ["beanie", "knit", "merino", "winter", "cozy"],
      images: [img("Ribbed+Beanie", 0), img("Ribbed+Beanie+Worn", 1), img("Ribbed+Beanie+Flat", 2)],
    },
    {
      name: "Straw Sun Hat",
      slug: "straw-sun-hat",
      description: "Hand-woven natural straw with a floppy brim and grosgrain ribbon — the quintessential summer hat. UPF 50+ protection so you can soak up the sun worry-free.",
      price: 44.0,
      sku: "TT-HT-003",
      stock: 24,
      material: "Natural Straw",
      categorySlug: "hats",
      tags: ["sun hat", "straw", "summer", "UPF"],
      images: [img("Straw+Sun+Hat", 0), img("Straw+Sun+Hat+Beach", 1)],
    },

    // ── Gloves ──
    {
      name: "Buttery Leather Driving Gloves",
      slug: "buttery-leather-driving-gloves",
      description: "Supple lambskin leather with a cashmere lining gives these gloves an impossibly luxurious hand-feel. The open knuckle detail adds a vintage-inspired edge.",
      price: 78.0,
      sku: "TT-GL-001",
      stock: 10,
      material: "Lambskin Leather, Cashmere Lined",
      categorySlug: "gloves",
      tags: ["leather", "cashmere", "driving", "luxury"],
      images: [img("Driving+Gloves", 0), img("Driving+Gloves+Detail", 1)],
    },
    {
      name: "Touchscreen Knit Gloves",
      slug: "touchscreen-knit-gloves",
      description: "Stay connected without freezing your fingers off. Conductive yarn fingertips let you swipe and type while a cozy fleece lining keeps the cold at bay.",
      price: 28.0,
      sku: "TT-GL-002",
      stock: 42,
      material: "Merino Wool with Conductive Yarn",
      categorySlug: "gloves",
      tags: ["touchscreen", "knit", "tech", "practical"],
      images: [img("Touchscreen+Gloves", 0), img("Touchscreen+Gloves+Phone", 1), img("Touchscreen+Gloves+Flat", 2)],
    },
    {
      name: "Velvet Opera Gloves",
      slug: "velvet-opera-gloves",
      description: "Full-length velvet gloves in a deep burgundy that adds instant drama to any evening look. Stretchy velvet conforms to your arm for a sleek, seamless silhouette.",
      price: 52.0,
      sku: "TT-GL-003",
      stock: 7,
      material: "Stretch Velvet",
      categorySlug: "gloves",
      tags: ["velvet", "opera", "evening", "statement"],
      images: [img("Velvet+Opera+Gloves", 0), img("Velvet+Opera+Styled", 1)],
    },
  ];

  let created = 0;
  for (const p of products) {
    const { images, categorySlug, ...productData } = p;
    await prisma.product.create({
      data: {
        name: productData.name,
        slug: productData.slug,
        description: productData.description,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice ?? null,
        sku: productData.sku,
        stock: productData.stock,
        material: productData.material,
        isFeatured: productData.isFeatured ?? false,
        tags: productData.tags,
        categoryId: categories[categorySlug],
        images: {
          create: images,
        },
      },
    });
    created++;
  }

  console.log(`  ${created} products created with images.`);
  console.log("  Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
