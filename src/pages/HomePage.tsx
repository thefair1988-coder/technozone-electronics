import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function HomePage() {
  useDocumentTitle("עמוד הבית");
  const { categories, products } = useCatalog();
  const featured = products.filter((product) => product.featured);

  return (
    <div className="flex flex-col gap-10">
      <section className="overflow-hidden rounded-2xl bg-gradient-to-l from-brand-700 to-brand-500 px-6 py-12 text-white sm:px-10">
        <h1 className="max-w-xl text-3xl font-extrabold sm:text-4xl">
          טכנוזון חשמל אונליין — כל האלקטרוניקה והחשמל במקום אחד
        </h1>
        <p className="mt-3 max-w-lg text-white/90">
          סלולר, מחשבים, טלוויזיות, מוצרי חשמל קטנים וגדולים, אודיו ואוזניות — במחירים משתלמים
          ובמגוון רחב.
        </p>
        <Link
          to={`/category/${categories[0]?.slug ?? ""}`}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-white/90"
        >
          לגלות מוצרים
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">קטגוריות</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <CategoryIllustration
                icon={category.icon}
                gradient={category.gradient}
                className="h-16 w-16"
                iconClassName="h-8 w-8"
              />
              <span className="text-sm font-semibold text-slate-900">{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 ? (
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900">מוצרים נבחרים</h2>
          <ProductGrid products={featured} />
        </section>
      ) : null}
    </div>
  );
}
