import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import type { CartLineWithProduct } from "@/state/CartContext";
import { useCatalog } from "@/state/CatalogContext";
import { useCart } from "@/state/CartContext";
import { CategoryIllustration } from "@/components/product/CategoryIllustration";
import { QuantityStepper } from "@/components/cart/QuantityStepper";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";

export function CartLineItem({ line }: { line: CartLineWithProduct }) {
  const { getCategoryById } = useCatalog();
  const { setQuantity, removeItem } = useCart();
  const category = getCategoryById(line.product.categoryId);

  return (
    <div className="flex items-center gap-3 py-3">
      <Link to={`/product/${line.product.slug}`} className="shrink-0">
        <CategoryIllustration
          icon={category?.icon ?? "plug"}
          gradient={category?.gradient ?? "from-slate-500 to-slate-700"}
          className="h-16 w-16"
          iconClassName="h-8 w-8"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to={`/product/${line.product.slug}`}
          className="line-clamp-2 text-sm font-medium text-slate-900 hover:text-brand-700"
        >
          {line.product.name}
        </Link>
        <p className="mt-1 text-sm text-slate-500">{formatPrice(line.product.price)}</p>
        <div className="mt-2 flex items-center gap-3">
          <QuantityStepper
            quantity={line.quantity}
            onChange={(q) => setQuantity(line.product.id, q)}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-slate-400 hover:text-red-600"
            onClick={() => removeItem(line.product.id)}
            aria-label="הסר מהעגלה"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <p className="shrink-0 text-sm font-semibold text-slate-900">{formatPrice(line.lineTotal)}</p>
    </div>
  );
}
