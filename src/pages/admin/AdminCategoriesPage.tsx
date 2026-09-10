import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Pencil, Trash2, FolderTree } from "lucide-react";
import { useCatalog, type CategoryInput } from "@/state/CatalogContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from "@/components/ui/Dialog";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { Category, IconName } from "@/types/product";

const ICON_OPTIONS: { value: IconName; label: string }[] = [
  { value: "smartphone", label: "סלולר" },
  { value: "laptop", label: "מחשבים" },
  { value: "tv", label: "טלוויזיה" },
  { value: "chef-hat", label: "מטבח" },
  { value: "headphones", label: "אודיו" },
  { value: "washing-machine", label: "מוצרי חשמל גדולים" },
  { value: "plug", label: "אביזרים" },
];

const GRADIENT_OPTIONS = [
  "from-blue-500 to-indigo-600",
  "from-slate-600 to-blue-700",
  "from-violet-500 to-purple-700",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-teal-500 to-cyan-700",
  "from-emerald-500 to-green-700",
  "from-fuchsia-500 to-purple-600",
];

const categorySchema = z.object({
  name: z.string().trim().min(2, "שם הקטגוריה חייב לפחות 2 תווים"),
  description: z.string().trim().min(3, "יש להזין תיאור"),
  icon: z.custom<IconName>(),
  gradient: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

export function AdminCategoriesPage() {
  useDocumentTitle("ניהול קטגוריות");
  const { categories, addCategory, updateCategory, deleteCategory } = useCatalog();
  const { toast } = useToast();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categorySchema) });

  const openForm = (category: Category | "new") => {
    setEditing(category);
    if (category === "new") {
      reset({ name: "", description: "", icon: "plug", gradient: GRADIENT_OPTIONS[0] });
    } else {
      reset({
        name: category.name,
        description: category.description,
        icon: category.icon,
        gradient: category.gradient,
      });
    }
  };

  const onSubmit = (values: CategoryFormValues) => {
    const input: CategoryInput = values;
    const result =
      editing === "new"
        ? addCategory(input)
        : editing
          ? updateCategory(editing.id, input)
          : { ok: false, error: "" };
    if (!result.ok) {
      setError("name", { message: result.error });
      return;
    }
    toast({ title: editing === "new" ? "הקטגוריה נוספה" : "הקטגוריה עודכנה", variant: "success" });
    setEditing(null);
  };

  const confirmDelete = () => {
    if (!categoryToDelete) return;
    const result = deleteCategory(categoryToDelete.id);
    if (!result.ok) {
      toast({ title: "לא ניתן למחוק", description: result.error, variant: "destructive" });
    } else {
      toast({ title: "הקטגוריה נמחקה", variant: "success" });
    }
    setCategoryToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">ניהול קטגוריות</h1>
        <Button onClick={() => openForm("new")}>
          <Plus className="h-4 w-4" />
          קטגוריה חדשה
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState
          icon={FolderTree}
          title="אין עדיין קטגוריות"
          description="הוסיפו קטגוריה ראשונה כדי להתחיל"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <CategoryIllustration
                icon={category.icon}
                gradient={category.gradient}
                className="h-12 w-12 shrink-0"
                iconClassName="h-6 w-6"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{category.name}</p>
                <p className="truncate text-xs text-slate-500">{category.description}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="עריכה"
                  onClick={() => openForm(category)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="מחיקה"
                  className="text-red-600 hover:bg-red-50"
                  onClick={() => setCategoryToDelete(category)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing === "new" ? "קטגוריה חדשה" : "עריכת קטגוריה"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-name">שם הקטגוריה</Label>
              <Input id="cat-name" {...register("name")} aria-invalid={!!errors.name} />
              {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-description">תיאור</Label>
              <Textarea
                id="cat-description"
                rows={2}
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description ? (
                <p className="text-xs text-red-600">{errors.description.message}</p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="cat-icon">אייקון</Label>
              <Controller
                control={control}
                name="icon"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="cat-icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ICON_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>צבע</Label>
              <div className="flex flex-wrap gap-2">
                <Controller
                  control={control}
                  name="gradient"
                  render={({ field }) => (
                    <>
                      {GRADIENT_OPTIONS.map((gradient) => (
                        <button
                          key={gradient}
                          type="button"
                          onClick={() => field.onChange(gradient)}
                          className={`h-8 w-8 rounded-full bg-gradient-to-br ${gradient} ${
                            field.value === gradient ? "ring-2 ring-offset-2 ring-brand-500" : ""
                          }`}
                          aria-label={gradient}
                        />
                      ))}
                    </>
                  )}
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  ביטול
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {editing === "new" ? "הוספה" : "שמירה"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!categoryToDelete} onOpenChange={(open) => !open && setCategoryToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת קטגוריה</DialogTitle>
            <DialogDescription>האם למחוק את "{categoryToDelete?.name}"?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">ביטול</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              מחיקה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
