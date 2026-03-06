"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/app/actions/admin";
import { GoldButton } from "@/components/brand/gold-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  sortOrder: number;
  productCount: number;
}

interface CategoryActionsProps {
  categories: CategoryData[];
}

export function CategoryActions({ categories }: CategoryActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CategoryData | null>(null);

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState("0");

  function openCreate() {
    setEditing(null);
    setName("");
    setSlug("");
    setDescription("");
    setImage("");
    setSortOrder("0");
    setDialogOpen(true);
  }

  function openEdit(cat: CategoryData) {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description ?? "");
    setImage(cat.image ?? "");
    setSortOrder(cat.sortOrder.toString());
    setDialogOpen(true);
  }

  function handleNameChange(value: string) {
    setName(value);
    if (!editing) {
      setSlug(slugify(value));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name,
      slug,
      description: description || null,
      image: image || null,
      sortOrder: parseInt(sortOrder, 10) || 0,
    };

    startTransition(async () => {
      try {
        let res: { error?: string };
        if (editing) {
          res = await updateCategory(editing.id, payload);
        } else {
          res = await createCategory(payload);
        }

        if (res?.error) {
          toast.error(res.error);
          return;
        }

        toast.success(
          editing ? "Category updated." : "Category created."
        );
        setDialogOpen(false);
        router.refresh();
      } catch {
        toast.error("Something went wrong.");
      }
    });
  }

  function handleDelete(id: string, productCount: number) {
    if (productCount > 0) {
      toast.error("Cannot delete a category that has products.");
      return;
    }
    if (!confirm("Are you sure you want to delete this category?")) return;

    startTransition(async () => {
      try {
        const res = await deleteCategory(id);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Category deleted.");
        router.refresh();
      } catch {
        toast.error("Failed to delete category.");
      }
    });
  }

  return (
    <>
      <Card className="border-blush/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-serif text-xl text-espresso">
              All Categories
            </CardTitle>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <button onClick={openCreate}>
                  <GoldButton size="sm" type="button">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </GoldButton>
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-serif text-xl text-espresso">
                    {editing ? "Edit Category" : "New Category"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cat-name">Name</Label>
                    <Input
                      id="cat-name"
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="Category name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-slug">Slug</Label>
                    <Input
                      id="cat-slug"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="category-slug"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-desc">Description</Label>
                    <Textarea
                      id="cat-desc"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      placeholder="Optional description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-image">Image URL</Label>
                    <Input
                      id="cat-image"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cat-sort">Sort Order</Label>
                    <Input
                      id="cat-sort"
                      type="number"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    />
                  </div>
                  <GoldButton type="submit" disabled={isPending}>
                    {isPending
                      ? "Saving..."
                      : editing
                      ? "Update Category"
                      : "Create Category"}
                  </GoldButton>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Sort Order</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-espresso/60">{cat.slug}</TableCell>
                  <TableCell>{cat.productCount}</TableCell>
                  <TableCell>{cat.sortOrder}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(cat)}
                        className="rounded-md p-1.5 text-champagne-gold hover:bg-champagne-gold/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id, cat.productCount)}
                        disabled={isPending}
                        className="rounded-md p-1.5 text-error hover:bg-error/10 disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-espresso/50"
                  >
                    No categories yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
