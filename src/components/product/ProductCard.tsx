import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/types/product";
import { useCatalog } from "@/state/CatalogContext";
import { useCart } from "@/state/CartContext";
import { useToast } from "@/components/ui/Toast";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice, discountPercent } from "@/lib/currency";

export function ProductCard({ product }: { product: Product }) {
  const { getCategoryById } = useCatalog();
  const { addItem } = useCart();
  const { toast } = useToast();
  const category = getCategoryById(product.categoryId);
  const discount = discountPercent(product.price, product.compareAtPrice);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <Link to={`/product/${product.slug}`} className="relative block">
        <CategoryIllustration
          icon={category?.icon ?? "plug"}
          gradient={category?.gradient ?? "from-slate-500 to-slate-700"}
          className="aspect-square w-full"
          iconClassName="h-16 w-16"
        />
        <div className="absolute end-2 top-2 flex flex-col gap-1">
          {discount ? <Badge variant="destructive">{discount}%- הנחה</Badge> : null}
          {!product.inStock ? <Badge variant="secondary">אזל מהמלאי</Badge> : null}
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="text-xs font-medium text-slate-500">{product.brand}</p>
        <Link
          to={`/product/${product.slug}`}
          className="line-clamp-2 text-sm font-semibold text-slate-900 hover:text-brand-700"
        >
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-slate-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <Button
            size="icon"
            variant="secondary"
            disabled={!product.inStock}
            aria-label="הוסף לעגלה"
            onClick={() => {
              addItem(product.id, 1);
              toast({ title: "נוסף לעגלה", description: product.name, variant: "success" });
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
