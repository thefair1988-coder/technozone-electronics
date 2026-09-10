import { createContext, useContext, useMemo, useReducer, useEffect, type ReactNode } from "react";
import type { Product } from "@/types/product";
import { readStorage, writeStorage } from "@/lib/storage";
import { useCatalog } from "@/state/CatalogContext";

const STORAGE_KEY = "techzone:cart:v1";

interface CartLine {
  productId: string;
  quantity: number;
}

type CartAction =
  | { type: "ADD"; productId: string; quantity: number }
  | { type: "SET_QUANTITY"; productId: string; quantity: number }
  | { type: "REMOVE"; productId: string }
  | { type: "CLEAR" };

function cartReducer(state: CartLine[], action: CartAction): CartLine[] {
  switch (action.type) {
    case "ADD": {
      const existing = state.find((line) => line.productId === action.productId);
      if (existing) {
        return state.map((line) =>
          line.productId === action.productId
            ? { ...line, quantity: line.quantity + action.quantity }
            : line,
        );
      }
      return [...state, { productId: action.productId, quantity: action.quantity }];
    }
    case "SET_QUANTITY":
      if (action.quantity <= 0) {
        return state.filter((line) => line.productId !== action.productId);
      }
      return state.map((line) =>
        line.productId === action.productId ? { ...line, quantity: action.quantity } : line,
      );
    case "REMOVE":
      return state.filter((line) => line.productId !== action.productId);
    case "CLEAR":
      return [];
    default:
      return state;
  }
}

export interface CartLineWithProduct {
  product: Product;
  quantity: number;
  lineTotal: number;
}

interface CartContextValue {
  lines: CartLineWithProduct[];
  totalQuantity: number;
  totalPrice: number;
  addItem: (productId: string, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { products } = useCatalog();
  const [state, dispatch] = useReducer(cartReducer, undefined, () =>
    readStorage<CartLine[]>(STORAGE_KEY, []),
  );

  useEffect(() => {
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  const value = useMemo<CartContextValue>(() => {
    const lines: CartLineWithProduct[] = state
      .map((line) => {
        const product = products.find((p) => p.id === line.productId);
        if (!product) return null;
        return { product, quantity: line.quantity, lineTotal: product.price * line.quantity };
      })
      .filter((line): line is CartLineWithProduct => line !== null);

    const totalQuantity = lines.reduce((sum, line) => sum + line.quantity, 0);
    const totalPrice = lines.reduce((sum, line) => sum + line.lineTotal, 0);

    return {
      lines,
      totalQuantity,
      totalPrice,
      addItem: (productId, quantity = 1) => dispatch({ type: "ADD", productId, quantity }),
      setQuantity: (productId, quantity) => dispatch({ type: "SET_QUANTITY", productId, quantity }),
      removeItem: (productId) => dispatch({ type: "REMOVE", productId }),
      clear: () => dispatch({ type: "CLEAR" }),
    };
  }, [state, products]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
