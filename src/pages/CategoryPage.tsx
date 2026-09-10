import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useCatalog } from "@/state/CatalogContext";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { ProductGrid } from "@/components/product/ProductGrid";
import { NotFoundPage } from "@/pages/NotFoundPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getCategoryBySlug, getProductsByCategory } = useCatalog();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  const [sort, setSort] = useState<SortOption>("featured");
  const [brand, setBrand] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<string>("");

  useDocumentTitle(category?.name ?? "קטגוריה");

  const products = useMemo(
    () => (category ? getProductsByCategory(category.id) : []),
    [category, getProductsByCategory],
  );

  const brands = useMemo(
    () => Array.from(new Set(products.map((p) => p.brand))).sort(),
    [products],
  );

  const filtered = useMemo(() => {
    let list = [...products];
    if (brand !== "all") list = list.filter((p) => p.brand === brand);
    if (inStockOnly) list = list.filter((p) => p.inStock);
    const max = Number(maxPrice);
    if (maxPrice && !Number.isNaN(max) && max > 0) list = list.filter((p) => p.price <= max);

    switch (sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name, "he"));
        break;
      default:
        list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
    return list;
  }, [products, brand, inStockOnly, maxPrice, sort]);

  if (!category) return <NotFoundPage />;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
        <CategoryIllustration
          icon={category.icon}
          gradient={category.gradient}
          className="h-16 w-16"
          iconClassName="h-8 w-8"
        />
        <div>
          <h1 className="text-xl font-bold text-slate-900">{category.name}</h1>
          <p className="text-sm text-slate-500">{category.description}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4 rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-col gap-1">
          <Label htmlFor="sort">מיון</Label>
          <Select value={sort} onValueChange={(value) => setSort(value as SortOption)}>
            <SelectTrigger id="sort" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">מומלצים</SelectItem>
              <SelectItem value="price-asc">מחיר: מהנמוך לגבוה</SelectItem>
              <SelectItem value="price-desc">מחיר: מהגבוה לנמוך</SelectItem>
              <SelectItem value="name">לפי שם</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="brand">מותג</Label>
          <Select value={brand} onValueChange={setBrand}>
            <SelectTrigger id="brand" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">כל המותגים</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="max-price">מחיר מקסימלי</Label>
          <Input
            id="max-price"
            type="number"
            min={0}
            placeholder="ללא הגבלה"
            className="w-36"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        <label className="mb-1 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            checked={inStockOnly}
            onChange={(e) => setInStockOnly(e.target.checked)}
          />
          במלאי בלבד
        </label>
      </div>

      <p className="text-sm text-slate-500">{filtered.length} מוצרים</p>
      <ProductGrid products={filtered} />
    </div>
  );
}
