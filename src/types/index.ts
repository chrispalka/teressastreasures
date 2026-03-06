import type { Decimal } from "@prisma/client/runtime/library";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  variantInfo?: string;
  maxStock: number;
}

export interface ProductWithDetails {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: Decimal;
  compareAtPrice: Decimal | null;
  sku: string;
  stock: number;
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
    stock: number;
  }[];
  reviews: {
    rating: number;
  }[];
}

export interface FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  inStock?: boolean;
  sort?: "newest" | "price-asc" | "price-desc" | "top-rated";
  page?: number;
  search?: string;
}
