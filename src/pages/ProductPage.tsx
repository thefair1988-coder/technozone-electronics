import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";
import { useCart } from "@/state/CartContext";
import { useToast } from "@/components/ui/Toast";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { formatPrice, discountPercent } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const { getProductBySlug, getCategoryById } = useCatalog();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = slug ? getProductBySlug(slug) : undefined;
  useDocumentTitle(product?.name ?? "מוצר");

  if (!product) return <NotFoundPage />;

  const category = getCategoryById(product.categoryId);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="flex flex-col gap-6">
      <nav className="flex items-center gap-1 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-700">
          בית
        </Link>
        <ChevronLeft className="h-3.5 w-3.5" />
        {category ? (
          <Link to={`/category/${category.slug}`} className="hover:text-brand-700">
            {category.name}
          </Link>
        ) : null}
        <ChevronLeft className="h-3.5 w-3.5" />
        <span className="truncate text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <CategoryIllustration
          icon={category?.icon ?? "plug"}
          gradient={category?.gradient ?? "from-slate-500 to-slate-700"}
          className="aspect-square w-full"
          iconClassName="h-32 w-32"
        />

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm font-medium text-brand-700">{product.brand}</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900">{product.name}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {discount ? <Badge variant="destructive">{discount}%- הנחה</Badge> : null}
            <Badge variant={product.inStock ? "success" : "secondary"}>
              {product.inStock ? "במלאי" : "אזל מהמלאי"}
            </Badge>
            <span className="text-xs text-slate-400">מק"ט {product.sku}</span>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              {formatPrice(product.price)}
            </span>
            {product.compareAtPrice ? (
              <span className="text-lg text-slate-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
            ) : null}
          </div>

          <p className="text-slate-600">{product.description}</p>

          <div className="flex items-center gap-3 pt-2">
            <QuantityStepper quantity={quantity} onChange={setQuantity} />
            <Button
              size="lg"
              disabled={!product.inStock}
              onClick={() => {
                addItem(product.id, quantity);
                toast({
                  title: "נוסף לעגלה",
                  description: `${product.name} × ${quantity}`,
                  variant: "success",
                });
              }}
            >
              <ShoppingCart className="h-4 w-4" />
              הוספה לעגלה
            </Button>
          </div>

          {product.specs.length > 0 ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-sm">
                <tbody className="divide-y divide-slate-100">
                  {product.specs.map((spec) => (
                    <tr key={spec.key}>
                      <td className="w-1/3 bg-slate-50 px-4 py-2.5 font-medium text-slate-600">
                        {spec.key}
                      </td>
                      <td className="px-4 py-2.5 text-slate-900">{spec.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
