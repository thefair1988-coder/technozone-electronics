import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/state/CartContext";
import { CartLineItem } from "@/components/cart/CartLineItem";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function CartPage() {
  useDocumentTitle("עגלת הקניות");
  const { lines, totalPrice } = useCart();

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="העגלה שלך ריקה"
        description="עדיין לא הוספתם מוצרים לעגלה"
        action={
          <Button asChild>
            <Link to="/">להמשך קניות</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-xl font-bold text-slate-900">עגלת הקניות שלי</h1>
        <Card>
          <CardContent className="divide-y divide-slate-100 pt-4">
            {lines.map((line) => (
              <CartLineItem key={line.product.id} line={line} />
            ))}
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="flex flex-col gap-4 pt-4">
            <h2 className="text-lg font-semibold text-slate-900">סיכום הזמנה</h2>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>סכום ביניים</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
              <span>סה"כ לתשלום</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Button asChild size="lg">
              <Link to="/checkout">מעבר לתשלום</Link>
            </Button>
            <Button asChild variant="ghost">
              <Link to="/">להמשך קניות</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
