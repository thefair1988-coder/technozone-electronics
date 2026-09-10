import { Link } from "react-router-dom";
import { ArrowLeft, Zap } from "lucide-react";
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
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-brand-800 to-brand-600 px-6 py-12 text-white sm:px-10">
        <div
          className="circuit-pattern pointer-events-none absolute inset-0 text-white/10"
          aria-hidden
        />
        <div className="relative">
          <span
            className="animate-fade-up mb-4 inline-flex items-center gap-1.5 rounded-full bg-electric-400/20 px-3 py-1 text-xs font-bold text-electric-300 ring-1 ring-electric-400/40"
            style={{ animationDelay: "0.1s" }}
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            מחירים בהספק מלא
          </span>
          <h1
            className="animate-fade-up max-w-xl text-3xl font-extrabold sm:text-4xl"
            style={{ animationDelay: "0.2s" }}
          >
            טכנוזון חשמל אונליין — כל האלקטרוניקה והחשמל במקום אחד
          </h1>
          <p
            className="animate-fade-up mt-3 max-w-lg text-white/90"
            style={{ animationDelay: "0.3s" }}
          >
            סלולר, מחשבים, טלוויזיות, מוצרי חשמל קטנים וגדולים, אודיו ואוזניות — במחירים משתלמים
            ובמגוון רחב.
          </p>
          <Link
            to={`/category/${categories[0]?.slug ?? ""}`}
            className="animate-fade-up mt-6 inline-flex items-center gap-2 rounded-lg bg-electric-400 px-5 py-2.5 text-sm font-bold text-brand-900 hover:bg-electric-300"
            style={{ animationDelay: "0.4s" }}
          >
            לגלות מוצרים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
        <div
          className="animate-power-flash pointer-events-none absolute inset-0 bg-electric-200"
          aria-hidden
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">קטגוריות</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="animate-fade-up group flex flex-col items-center gap-3 rounded-xl border border-slate-200 bg-white p-5 text-center shadow-sm transition-shadow hover:shadow-md"
              style={{ animationDelay: `${0.4 + index * 0.05}s` }}
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
