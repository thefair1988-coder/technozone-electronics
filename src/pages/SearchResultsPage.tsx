import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useCatalog } from "@/state/CatalogContext";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = (searchParams.get("q") ?? "").trim();
  const { products, getCategoryById } = useCatalog();
  useDocumentTitle(query ? `תוצאות חיפוש עבור "${query}"` : "חיפוש");

  const results = useMemo(() => {
    if (!query) return [];
    const needle = query.toLowerCase();
    return products.filter((product) => {
      const category = getCategoryById(product.categoryId);
      return (
        product.name.toLowerCase().includes(needle) ||
        product.brand.toLowerCase().includes(needle) ||
        category?.name.toLowerCase().includes(needle)
      );
    });
  }, [products, query, getCategoryById]);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-bold text-slate-900">
        {query ? `תוצאות חיפוש עבור "${query}"` : "חיפוש מוצרים"}
      </h1>
      <p className="text-sm text-slate-500">{results.length} מוצרים נמצאו</p>
      <ProductGrid
        products={results}
        emptyTitle="לא נמצאו תוצאות"
        emptyDescription="נסו מילת חיפוש אחרת, למשל שם מותג או קטגוריה"
      />
    </div>
  );
}
