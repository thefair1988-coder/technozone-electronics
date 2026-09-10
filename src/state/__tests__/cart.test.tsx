import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CatalogProvider } from "@/state/CatalogContext";
import { CartProvider, useCart } from "@/state/CartContext";
import { products } from "@/data/products";

function wrapper({ children }: { children: ReactNode }) {
  return (
    <CatalogProvider>
      <CartProvider>{children}</CartProvider>
    </CatalogProvider>
  );
}

const firstProduct = products[0]!;
const secondProduct = products[1]!;

describe("CartContext", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.lines).toHaveLength(0);
    expect(result.current.totalQuantity).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds an item and computes totals", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(firstProduct.id, 2));

    expect(result.current.totalQuantity).toBe(2);
    expect(result.current.totalPrice).toBe(firstProduct.price * 2);
    expect(result.current.lines[0]?.product.id).toBe(firstProduct.id);
  });

  it("increments quantity when the same product is added twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(firstProduct.id, 1));
    act(() => result.current.addItem(firstProduct.id, 3));

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0]?.quantity).toBe(4);
  });

  it("removes a line when quantity is set to zero", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(firstProduct.id, 2));
    act(() => result.current.setQuantity(firstProduct.id, 0));

    expect(result.current.lines).toHaveLength(0);
  });

  it("removeItem drops only the targeted line", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(firstProduct.id, 1));
    act(() => result.current.addItem(secondProduct.id, 1));
    act(() => result.current.removeItem(firstProduct.id));

    expect(result.current.lines).toHaveLength(1);
    expect(result.current.lines[0]?.product.id).toBe(secondProduct.id);
  });

  it("clear empties the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => result.current.addItem(firstProduct.id, 1));
    act(() => result.current.clear());

    expect(result.current.lines).toHaveLength(0);
  });

  it("persists the cart across remounts via localStorage", () => {
    const { result, unmount } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(firstProduct.id, 5));
    unmount();

    const { result: reloaded } = renderHook(() => useCart(), { wrapper });
    expect(reloaded.current.totalQuantity).toBe(5);
  });
});
