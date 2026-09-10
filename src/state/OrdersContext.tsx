import { createContext, useContext, useMemo, useReducer, useEffect, type ReactNode } from "react";
import type { CustomerDetails, Order, OrderItem, OrderStatus } from "@/types/order";
import { readStorage, writeStorage } from "@/lib/storage";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "techzone:orders:v1";

type OrdersAction =
  { type: "ADD"; order: Order } | { type: "SET_STATUS"; id: string; status: OrderStatus };

function ordersReducer(state: Order[], action: OrdersAction): Order[] {
  switch (action.type) {
    case "ADD":
      return [action.order, ...state];
    case "SET_STATUS":
      return state.map((order) =>
        order.id === action.id ? { ...order, status: action.status } : order,
      );
    default:
      return state;
  }
}

interface OrdersContextValue {
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  createOrder: (customer: CustomerDetails, items: OrderItem[], total: number) => Order;
  setOrderStatus: (id: string, status: OrderStatus) => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(ordersReducer, undefined, () =>
    readStorage<Order[]>(STORAGE_KEY, []),
  );

  useEffect(() => {
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  const value = useMemo<OrdersContextValue>(
    () => ({
      orders: state,
      getOrder: (id) => state.find((order) => order.id === id),
      createOrder: (customer, items, total) => {
        const order: Order = {
          id: generateId("order"),
          createdAt: new Date().toISOString(),
          items,
          total,
          customer,
          status: "new",
        };
        dispatch({ type: "ADD", order });
        return order;
      },
      setOrderStatus: (id, status) => dispatch({ type: "SET_STATUS", id, status }),
    }),
    [state],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders(): OrdersContextValue {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within an OrdersProvider");
  return ctx;
}
