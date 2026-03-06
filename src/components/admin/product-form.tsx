"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { productSchema } from "@/lib/validators";
import { slugify } from "@/lib/utils";
import { createProduct, updateProduct, deleteProduct } from "@/app/actions/products";
import { GoldButton } from "@/components/brand/gold-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ImageInput {
  url: string;
  alt: string | null;
}

interface VariantInput {
  name: string;
  value: string;
  sku: string;
  price?: number;
  stock: number;
}

interface ProductData {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  sku: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  material: string | null;
  weight: number | null;
  categoryId: string;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  images: ImageInput[];
  variants: VariantInput[];
}

interface ProductFormProps {
  initialData?: ProductData;
  categories: { id: string; name: string }[];
}

export function ProductForm({ initialData, categories }: ProductFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const isEditing = !!initialData?.id;

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    initialData?.compareAtPrice?.toString() ?? ""
  );
  const [sku, setSku] = useState(initialData?.sku ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "0");
  const [material, setMaterial] = useState(initialData?.material ?? "");
  const [weight, setWeight] = useState(initialData?.weight?.toString() ?? "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [tags, setTags] = useState(initialData?.tags?.join(", ") ?? "");
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initialData?.metaDescription ?? ""
  );
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured ?? false);
  const [images, setImages] = useState<ImageInput[]>(
    initialData?.images ?? [{ url: "", alt: "" }]
  );
  const [variants, setVariants] = useState<VariantInput[]>(
    initialData?.variants ?? []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleNameChange(value: string) {
    setName(value);
    if (!isEditing) {
      setSlug(slugify(value));
    }
  }

  function addImage() {
    setImages([...images, { url: "", alt: "" }]);
  }

  function removeImage(index: number) {
    setImages(images.filter((_, i) => i !== index));
  }

  function updateImage(index: number, field: keyof ImageInput, value: string) {
    const updated = [...images];
    updated[index] = { ...updated[index], [field]: value };
    setImages(updated);
  }

  function addVariant() {
    setVariants([
      ...variants,
      { name: "", value: "", sku: "", price: undefined, stock: 0 },
    ]);
  }

  function removeVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index));
  }

  function updateVariant(
    index: number,
    field: keyof VariantInput,
    value: string | number
  ) {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const data = {
      name,
      slug,
      description,
      price: parseFloat(price),
      compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
      sku,
      stock: parseInt(stock, 10),
      isActive,
      isFeatured,
      material: material || null,
      weight: weight ? parseFloat(weight) : null,
      categoryId,
      tags: tagsArray,
      metaTitle: metaTitle || null,
      metaDescription: metaDescription || null,
    };

    const result = productSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      toast.error("Please fix the validation errors.");
      return;
    }

    const validImages = images.filter((img) => img.url.trim() !== "");
    const validVariants = variants.filter(
      (v) => v.name.trim() !== "" && v.value.trim() !== "" && v.sku.trim() !== ""
    );

    startTransition(async () => {
      try {
        const payload = {
          ...data,
          images: validImages,
          variants: validVariants,
        };

        let res: { error?: string };
        if (isEditing && initialData?.id) {
          res = await updateProduct(initialData.id, payload);
        } else {
          res = await createProduct(payload);
        }

        if (res?.error) {
          toast.error(res.error);
          return;
        }

        toast.success(
          isEditing ? "Product updated successfully." : "Product created successfully."
        );
        router.push("/admin/products");
        router.refresh();
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  function handleDelete() {
    if (!initialData?.id) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    startTransition(async () => {
      try {
        const res = await deleteProduct(initialData.id!);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Product deleted.");
        router.push("/admin/products");
      } catch {
        toast.error("Failed to delete product.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-espresso">
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Gold Leopard Earrings"
            />
            {errors.name && (
              <p className="text-xs text-error">{errors.name}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="auto-generated-slug"
            />
            <p className="text-xs text-espresso/50">
              Preview: /products/{slug || "..."}
            </p>
            {errors.slug && (
              <p className="text-xs text-error">{errors.slug}</p>
            )}
          </div>
          <div className="col-span-full space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Describe the product..."
            />
            {errors.description && (
              <p className="text-xs text-error">{errors.description}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pricing & Inventory */}
      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-espresso">
            Pricing &amp; Inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            {errors.price && (
              <p className="text-xs text-error">{errors.price}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="compareAtPrice">Compare At Price ($)</Label>
            <Input
              id="compareAtPrice"
              type="number"
              step="0.01"
              min="0"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sku">SKU</Label>
            <Input
              id="sku"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="TT-001"
            />
            {errors.sku && (
              <p className="text-xs text-error">{errors.sku}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              min="0"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-espresso">
            Details
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-xs text-error">{errors.categoryId}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. 14k Gold Plated"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (oz)</Label>
            <Input
              id="weight"
              type="number"
              step="0.01"
              min="0"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma-separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="leopard, gold, earrings"
            />
          </div>
          <div className="flex items-center gap-4 pt-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(checked === true)}
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                Active
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isFeatured"
                checked={isFeatured}
                onCheckedChange={(checked) => setIsFeatured(checked === true)}
              />
              <Label htmlFor="isFeatured" className="cursor-pointer">
                Featured
              </Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO */}
      <Card className="border-blush/50">
        <CardHeader>
          <CardTitle className="font-serif text-lg text-espresso">
            SEO
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Optional SEO title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Input
              id="metaDescription"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="Optional SEO description"
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="border-blush/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg text-espresso">
              Images
            </CardTitle>
            <button
              type="button"
              onClick={addImage}
              className="flex items-center gap-1 text-sm text-champagne-gold hover:underline"
            >
              <Plus className="h-4 w-4" /> Add Image
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {images.map((img, index) => (
            <div key={index} className="flex gap-3 items-end">
              <div className="flex-1 space-y-1">
                <Label>URL</Label>
                <Input
                  value={img.url}
                  onChange={(e) => updateImage(index, "url", e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label>Alt Text</Label>
                <Input
                  value={img.alt ?? ""}
                  onChange={(e) => updateImage(index, "alt", e.target.value)}
                  placeholder="Image description"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="mb-0.5 rounded-md p-2 text-error hover:bg-error/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {images.length === 0 && (
            <p className="text-sm text-espresso/50">No images added yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Variants */}
      <Card className="border-blush/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-lg text-espresso">
              Variants
            </CardTitle>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-1 text-sm text-champagne-gold hover:underline"
            >
              <Plus className="h-4 w-4" /> Add Variant
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {variants.map((variant, index) => (
            <div key={index} className="flex flex-wrap gap-3 items-end">
              <div className="w-32 space-y-1">
                <Label>Name</Label>
                <Input
                  value={variant.name}
                  onChange={(e) =>
                    updateVariant(index, "name", e.target.value)
                  }
                  placeholder="Color"
                />
              </div>
              <div className="w-32 space-y-1">
                <Label>Value</Label>
                <Input
                  value={variant.value}
                  onChange={(e) =>
                    updateVariant(index, "value", e.target.value)
                  }
                  placeholder="Gold"
                />
              </div>
              <div className="w-32 space-y-1">
                <Label>SKU</Label>
                <Input
                  value={variant.sku}
                  onChange={(e) =>
                    updateVariant(index, "sku", e.target.value)
                  }
                  placeholder="TT-001-GLD"
                />
              </div>
              <div className="w-24 space-y-1">
                <Label>Price</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={variant.price ?? ""}
                  onChange={(e) =>
                    updateVariant(
                      index,
                      "price",
                      e.target.value ? parseFloat(e.target.value) : ""
                    )
                  }
                  placeholder="Optional"
                />
              </div>
              <div className="w-20 space-y-1">
                <Label>Stock</Label>
                <Input
                  type="number"
                  min="0"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, "stock", parseInt(e.target.value, 10) || 0)
                  }
                />
              </div>
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="mb-0.5 rounded-md p-2 text-error hover:bg-error/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          {variants.length === 0 && (
            <p className="text-sm text-espresso/50">
              No variants. Product will be sold as a single item.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <GoldButton type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Product"}
        </GoldButton>
        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isPending}
            className="rounded-lg px-4 py-2 text-sm font-medium text-error hover:bg-error/10 disabled:opacity-50"
          >
            Delete Product
          </button>
        )}
      </div>
    </form>
  );
}
