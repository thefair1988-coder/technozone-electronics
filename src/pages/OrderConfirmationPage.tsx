import { Link, useParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "@/state/OrdersContext";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { formatPrice } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const order = orderId ? getOrder(orderId) : undefined;
  useDocumentTitle("אישור הזמנה");

  if (!order) return <NotFoundPage />;

  return (
    <div className="mx-auto max-w-lg">
      <Card>
        <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
          <CheckCircle2 className="h-14 w-14 text-emerald-600" />
          <h1 className="text-xl font-bold text-slate-900">ההזמנה התקבלה בהצלחה!</h1>
          <p className="text-sm text-slate-500">
            מספר הזמנה: <span className="font-mono">{order.id}</span>
          </p>

          <div className="w-full rounded-lg border border-slate-200 text-start">
            <ul className="divide-y divide-slate-100 px-4">
              {order.items.map((item) => (
                <li key={item.productId} className="flex items-center justify-between py-2 text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-medium text-slate-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-base font-bold text-slate-900">
              <span>סה"כ שולם</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          <p className="text-sm text-slate-500">
            אישור נשלח לכתובת {order.customer.email}. ההזמנה תישלח לכתובת {order.customer.address},{" "}
            {order.customer.city}.
          </p>

          <Button asChild size="lg">
            <Link to="/">להמשך קניות</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
