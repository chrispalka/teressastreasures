import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  slug: z.string().min(2),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional().nullable(),
  sku: z.string().min(1, "SKU is required"),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  material: z.string().optional().nullable(),
  weight: z.coerce.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required"),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
