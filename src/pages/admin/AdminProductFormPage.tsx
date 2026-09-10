import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Trash2 } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const productSchema = z.object({
  name: z.string().trim().min(2, "שם המוצר חייב לפחות 2 תווים"),
  categoryId: z.string().min(1, "יש לבחור קטגוריה"),
  brand: z.string().trim().min(1, "יש להזין מותג"),
  price: z
    .string()
    .trim()
    .refine((v) => Number(v) > 0, "המחיר חייב להיות גדול מאפס"),
  compareAtPrice: z
    .string()
    .trim()
    .refine((v) => v === "" || Number(v) > 0, "מחיר לפני הנחה חייב להיות גדול מאפס")
    .optional(),
  sku: z.string().trim().min(1, 'יש להזין מק"ט'),
  shortDescription: z.string().trim().min(3, "יש להזין תיאור קצר"),
  description: z.string().trim().min(3, "יש להזין תיאור מלא"),
  inStock: z.boolean(),
  featured: z.boolean(),
  specs: z
    .array(
      z.object({
        key: z.string().trim(),
        value: z.string().trim(),
      }),
    )
    // Rows are optional (an empty row is dropped on submit), but a row
    // filled in on only one side is a mistake worth flagging rather than
    // silently discarding — otherwise the button does nothing and nobody
    // knows why.
    .superRefine((specs, ctx) => {
      specs.forEach((spec, index) => {
        const isPartial = Boolean(spec.key) !== Boolean(spec.value);
        if (isPartial) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "יש למלא גם מאפיין וגם ערך",
            path: [index, spec.key ? "value" : "key"],
          });
        }
      });
    }),
});

type ProductFormValues = z.infer<typeof productSchema>;

export function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  useDocumentTitle(isEditing ? "עריכת מוצר" : "מוצר חדש");

  const navigate = useNavigate();
  const { categories, products, addProduct, updateProduct } = useCatalog();
  const { toast } = useToast();
  const existing = isEditing ? products.find((p) => p.id === id) : undefined;

  const {
    register,
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: existing
      ? {
          ...existing,
          price: String(existing.price),
          compareAtPrice:
            existing.compareAtPrice !== undefined ? String(existing.compareAtPrice) : "",
        }
      : {
          name: "",
          categoryId: categories[0]?.id ?? "",
          brand: "",
          price: "",
          compareAtPrice: "",
          sku: "",
          shortDescription: "",
          description: "",
          inStock: true,
          featured: false,
          specs: [{ key: "", value: "" }],
        },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "specs" });

  useEffect(() => {
    if (fields.length === 0) append({ key: "", value: "" });
  }, [fields.length, append]);

  if (isEditing && !existing) return <NotFoundPage />;

  const onSubmit = (values: ProductFormValues) => {
    const payload = {
      ...values,
      price: Number(values.price),
      compareAtPrice:
        values.compareAtPrice === "" || values.compareAtPrice === undefined
          ? undefined
          : Number(values.compareAtPrice),
      specs: values.specs.filter((spec) => spec.key && spec.value),
    };
    const result =
      isEditing && existing ? updateProduct(existing.id, payload) : addProduct(payload);
    if (!result.ok) {
      setError("name", { message: result.error });
      toast({ title: "שגיאה בשמירה", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: isEditing ? "המוצר עודכן" : "המוצר נוסף", variant: "success" });
    navigate("/admin/products");
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-xl font-bold text-slate-900">
        {isEditing ? "עריכת מוצר" : "מוצר חדש"}
      </h1>
      <Card>
        <CardContent className="pt-4">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="name">שם המוצר</Label>
                <Input id="name" {...register("name")} aria-invalid={!!errors.name} />
                {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="categoryId">קטגוריה</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="categoryId">
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId ? (
                  <p className="text-xs text-red-600">{errors.categoryId.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="brand">מותג</Label>
                <Input id="brand" {...register("brand")} aria-invalid={!!errors.brand} />
                {errors.brand ? (
                  <p className="text-xs text-red-600">{errors.brand.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="price">מחיר (₪)</Label>
                <Input
                  id="price"
                  type="number"
                  step="1"
                  min={0}
                  {...register("price")}
                  aria-invalid={!!errors.price}
                />
                {errors.price ? (
                  <p className="text-xs text-red-600">{errors.price.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="compareAtPrice">מחיר לפני הנחה (אופציונלי)</Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="1"
                  min={0}
                  {...register("compareAtPrice")}
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="sku">מק"ט</Label>
                <Input id="sku" {...register("sku")} aria-invalid={!!errors.sku} />
                {errors.sku ? <p className="text-xs text-red-600">{errors.sku.message}</p> : null}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="shortDescription">תיאור קצר</Label>
                <Input
                  id="shortDescription"
                  {...register("shortDescription")}
                  aria-invalid={!!errors.shortDescription}
                />
                {errors.shortDescription ? (
                  <p className="text-xs text-red-600">{errors.shortDescription.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="description">תיאור מלא</Label>
                <Textarea
                  id="description"
                  rows={4}
                  {...register("description")}
                  aria-invalid={!!errors.description}
                />
                {errors.description ? (
                  <p className="text-xs text-red-600">{errors.description.message}</p>
                ) : null}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Label>מפרט טכני</Label>
              {fields.map((field, index) => {
                const rowError =
                  errors.specs?.[index]?.key?.message ?? errors.specs?.[index]?.value?.message;
                return (
                  <div key={field.id} className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <Input
                        placeholder="מאפיין (לדוגמה: זיכרון)"
                        aria-invalid={!!rowError}
                        {...register(`specs.${index}.key` as const)}
                      />
                      <Input
                        placeholder="ערך (לדוגמה: 128GB)"
                        aria-invalid={!!rowError}
                        {...register(`specs.${index}.value` as const)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        aria-label="הסר שורה"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {rowError ? <p className="text-xs text-red-600">{rowError}</p> : null}
                  </div>
                );
              })}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => append({ key: "", value: "" })}
              >
                <Plus className="h-4 w-4" />
                הוספת שורת מפרט
              </Button>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600"
                  {...register("inStock")}
                />
                זמין במלאי
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-600"
                  {...register("featured")}
                />
                מוצר מומלץ (מוצג בעמוד הבית)
              </label>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button type="submit" disabled={isSubmitting}>
                {isEditing ? "שמירת שינויים" : "הוספת מוצר"}
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate("/admin/products")}>
                ביטול
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
