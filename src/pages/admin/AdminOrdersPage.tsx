import { useState } from "react";
import { ClipboardList, Eye } from "lucide-react";
import { useOrders } from "@/state/OrdersContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/Dialog";
import { formatPrice } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { Order, OrderStatus } from "@/types/order";

const STATUS_LABELS: Record<OrderStatus, string> = {
  new: "חדשה",
  processing: "בטיפול",
  shipped: "נשלחה",
  completed: "הושלמה",
  cancelled: "בוטלה",
};

export function AdminOrdersPage() {
  useDocumentTitle("ניהול הזמנות");
  const { orders, setOrderStatus } = useOrders();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-xl font-bold text-slate-900">ניהול הזמנות</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="אין עדיין הזמנות"
          description="הזמנות שיבוצעו בחנות יופיעו כאן"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר הזמנה</TableHead>
                <TableHead>לקוח</TableHead>
                <TableHead>תאריך</TableHead>
                <TableHead>סה"כ</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">{order.id}</TableCell>
                  <TableCell>
                    <p className="font-medium text-slate-900">{order.customer.fullName}</p>
                    <p className="text-xs text-slate-500">{order.customer.phone}</p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(order.createdAt).toLocaleDateString("he-IL")}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">
                    {formatPrice(order.total)}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(value) => {
                        setOrderStatus(order.id, value as OrderStatus);
                        toast({ title: "סטטוס ההזמנה עודכן", variant: "success" });
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="צפייה"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>פרטי הזמנה {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder ? (
            <div className="flex flex-col gap-3 text-sm">
              <div>
                <p className="font-medium text-slate-900">{selectedOrder.customer.fullName}</p>
                <p className="text-slate-500">
                  {selectedOrder.customer.phone} · {selectedOrder.customer.email}
                </p>
                <p className="text-slate-500">
                  {selectedOrder.customer.address}, {selectedOrder.customer.city}
                </p>
                {selectedOrder.customer.notes ? (
                  <p className="mt-1 text-slate-500">הערות: {selectedOrder.customer.notes}</p>
                ) : null}
              </div>
              <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                {selectedOrder.items.map((item) => (
                  <li key={item.productId} className="flex items-center justify-between px-3 py-2">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between text-base font-bold text-slate-900">
                <span>סה"כ</span>
                <span>{formatPrice(selectedOrder.total)}</span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
