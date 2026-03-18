import type { Decimal } from "@prisma/client/runtime/library";

export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: Decimal;
  compareAtPrice: Decimal | null;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  material: string | null;
  weight: Decimal | null;
  categoryId: string;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  images: {
    id: string;
    url: string;
    alt: string | null;
    sortOrder: number;
  }[];
  variants: {
    id: string;
    name: string;
    value: string;
    sku: string;
    price: Decimal | null;
  }[];
}

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  sort?: "newest" | "price-asc" | "price-desc";
  page?: number;
  search?: string;
}
