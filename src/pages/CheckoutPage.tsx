import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/state/CartContext";
import { useOrders } from "@/state/OrdersContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

const checkoutSchema = z.object({
  fullName: z.string().trim().min(2, "יש להזין שם מלא"),
  phone: z
    .string()
    .trim()
    .regex(/^0\d{8,9}$/, "מספר טלפון לא תקין (לדוגמה: 0501234567)"),
  email: z.string().trim().email("כתובת אימייל לא תקינה"),
  address: z.string().trim().min(3, "יש להזין כתובת"),
  city: z.string().trim().min(2, "יש להזין עיר"),
  notes: z.string().trim().optional(),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

export function CheckoutPage() {
  useDocumentTitle("תשלום");
  const { lines, totalPrice, clear } = useCart();
  const { createOrder } = useOrders();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  // Redirect away only if the cart was already empty when this page was
  // reached (e.g. a direct visit to /checkout) — checked once on mount, not
  // on every change, so clearing the cart after a successful order below
  // doesn't race this guard back to /cart instead of the confirmation page.
  useEffect(() => {
    if (lines.length === 0) {
      navigate("/cart", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally mount-only
  }, []);

  const onSubmit = (values: CheckoutFormValues) => {
    const order = createOrder(
      { ...values },
      lines.map((line) => ({
        productId: line.product.id,
        name: line.product.name,
        price: line.product.price,
        quantity: line.quantity,
      })),
      totalPrice,
    );
    navigate(`/order-confirmation/${order.id}`);
    clear();
  };

  if (lines.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <h1 className="mb-4 text-xl font-bold text-slate-900">פרטי משלוח ותשלום</h1>
        <Card>
          <CardContent className="pt-4">
            <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
              זוהי הזמנה לדוגמה לצורכי הדגמה — אין באתר סליקת תשלום אמיתית.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid gap-4 sm:grid-cols-2"
              noValidate
            >
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="fullName">שם מלא</Label>
                <Input id="fullName" {...register("fullName")} aria-invalid={!!errors.fullName} />
                {errors.fullName ? (
                  <p className="text-xs text-red-600">{errors.fullName.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="phone">טלפון</Label>
                <Input
                  id="phone"
                  inputMode="tel"
                  placeholder="0501234567"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                />
                {errors.phone ? (
                  <p className="text-xs text-red-600">{errors.phone.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                {errors.email ? (
                  <p className="text-xs text-red-600">{errors.email.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="city">עיר</Label>
                <Input id="city" {...register("city")} aria-invalid={!!errors.city} />
                {errors.city ? <p className="text-xs text-red-600">{errors.city.message}</p> : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="address">כתובת (רחוב ומספר)</Label>
                <Input id="address" {...register("address")} aria-invalid={!!errors.address} />
                {errors.address ? (
                  <p className="text-xs text-red-600">{errors.address.message}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <Label htmlFor="notes">הערות להזמנה (אופציונלי)</Label>
                <Textarea id="notes" {...register("notes")} />
              </div>

              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  ביצוע ההזמנה
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardContent className="flex flex-col gap-3 pt-4">
            <h2 className="text-lg font-semibold text-slate-900">סיכום הזמנה</h2>
            <ul className="flex flex-col gap-2 text-sm text-slate-600">
              {lines.map((line) => (
                <li key={line.product.id} className="flex items-center justify-between gap-2">
                  <span className="line-clamp-1">
                    {line.product.name} × {line.quantity}
                  </span>
                  <span className="shrink-0 font-medium text-slate-900">
                    {formatPrice(line.lineTotal)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-bold text-slate-900">
              <span>סה"כ לתשלום</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <Link to="/cart" className="text-sm text-brand-700 hover:underline">
              עריכת העגלה
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
