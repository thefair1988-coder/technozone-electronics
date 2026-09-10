import { useMemo } from "react";
import { Package, FolderTree, ClipboardList, Wallet } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";
import { useOrders } from "@/state/OrdersContext";
import { Card, CardContent } from "@/components/ui/Card";
import { formatPrice } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function AdminDashboardPage() {
  useDocumentTitle("דשבורד");
  const { products, categories, getCategoryById } = useCatalog();
  const { orders } = useOrders();

  const revenue = useMemo(
    () => orders.filter((o) => o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0),
    [orders],
  );

  const topCategory = useMemo(() => {
    const revenueByCategory = new Map<string, number>();
    for (const order of orders) {
      if (order.status === "cancelled") continue;
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) continue;
        const current = revenueByCategory.get(product.categoryId) ?? 0;
        revenueByCategory.set(product.categoryId, current + item.price * item.quantity);
      }
    }
    let bestId: string | null = null;
    let bestValue = 0;
    for (const [categoryId, value] of revenueByCategory) {
      if (value > bestValue) {
        bestValue = value;
        bestId = categoryId;
      }
    }
    return bestId ? getCategoryById(bestId) : undefined;
  }, [orders, products, getCategoryById]);

  const stats = [
    { label: 'סה"כ מוצרים', value: products.length, icon: Package },
    { label: "קטגוריות", value: categories.length, icon: FolderTree },
    { label: "הזמנות", value: orders.length, icon: ClipboardList },
    { label: "הכנסה משוערת", value: formatPrice(revenue), icon: Wallet },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-slate-900">דשבורד</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-3 pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                <stat.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs text-slate-500">{stat.label}</p>
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-4">
          <p className="text-sm text-slate-500">קטגוריה מובילה לפי הכנסה</p>
          <p className="mt-1 text-lg font-semibold text-slate-900">
            {topCategory ? topCategory.name : "אין עדיין הזמנות"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
