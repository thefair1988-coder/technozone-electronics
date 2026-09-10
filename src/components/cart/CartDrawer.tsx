import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/state/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/Sheet";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/currency";

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { lines, totalPrice } = useCart();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>עגלת הקניות שלי</SheetTitle>
        </SheetHeader>

        {lines.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="העגלה שלך ריקה"
            description="הוסיפו מוצרים כדי להתחיל בהזמנה"
          />
        ) : (
          <div className="flex-1 divide-y divide-slate-100 overflow-y-auto">
            {lines.map((line) => (
              <CartLineItem key={line.product.id} line={line} />
            ))}
          </div>
        )}

        {lines.length > 0 ? (
          <SheetFooter>
            <div className="flex items-center justify-between text-base font-semibold text-slate-900">
              <span>סה"כ לתשלום</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <SheetClose asChild>
              <Button asChild size="lg">
                <Link to="/cart">לצפייה בעגלה</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button asChild size="lg" variant="secondary">
                <Link to="/checkout">מעבר לתשלום</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
