import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { CatalogProvider, useCatalog } from "@/state/CatalogContext";

function wrapper({ children }: { children: ReactNode }) {
  return <CatalogProvider>{children}</CatalogProvider>;
}

const baseProductInput = {
  name: "מוצר בדיקה",
  categoryId: "cat-cellular",
  brand: "TestBrand",
  price: 100,
  shortDescription: "תיאור קצר",
  description: "תיאור מלא",
  specs: [],
  inStock: true,
  featured: false,
  sku: "TEST-0001",
};

describe("CatalogContext products", () => {
  it("adds a product with a slug derived from its name", () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });

    let outcome!: { ok: boolean };
    act(() => {
      outcome = result.current.addProduct(baseProductInput);
    });

    expect(outcome.ok).toBe(true);
    const added = result.current.products.find((p) => p.name === "מוצר בדיקה");
    expect(added).toBeDefined();
    expect(added?.slug).toBeTruthy();
  });

  it("rejects a product with a non-positive price", () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });

    let outcome!: { ok: boolean; error?: string };
    act(() => {
      outcome = result.current.addProduct({ ...baseProductInput, price: 0 });
    });

    expect(outcome.ok).toBe(false);
  });

  it("updates and deletes a product", () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });

    act(() => {
      result.current.addProduct(baseProductInput);
    });
    const added = result.current.products.find((p) => p.name === "מוצר בדיקה")!;

    act(() => {
      result.current.updateProduct(added.id, { ...baseProductInput, price: 250 });
    });
    expect(result.current.products.find((p) => p.id === added.id)?.price).toBe(250);

    act(() => {
      result.current.deleteProduct(added.id);
    });
    expect(result.current.products.find((p) => p.id === added.id)).toBeUndefined();
  });
});

describe("CatalogContext categories", () => {
  it("adds a category and finds it by slug", () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });

    act(() => {
      result.current.addCategory({
        name: "קטגוריית בדיקה",
        description: "תיאור",
        icon: "plug",
        gradient: "from-blue-500 to-indigo-600",
      });
    });

    const created = result.current.categories.find((c) => c.name === "קטגוריית בדיקה");
    expect(created).toBeDefined();
    expect(result.current.getCategoryBySlug(created!.slug)?.id).toBe(created!.id);
  });

  it("blocks deleting a category that still has products", () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });

    const existingCategory = result.current.categories[0]!;
    let outcome!: { ok: boolean; error?: string };
    act(() => {
      outcome = result.current.deleteCategory(existingCategory.id);
    });

    expect(outcome.ok).toBe(false);
  });

  it("allows deleting an empty category", () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });

    let addResult!: { ok: boolean };
    act(() => {
      addResult = result.current.addCategory({
        name: "קטגוריה ריקה",
        description: "תיאור",
        icon: "plug",
        gradient: "from-blue-500 to-indigo-600",
      });
    });
    expect(addResult.ok).toBe(true);

    const created = result.current.categories.find((c) => c.name === "קטגוריה ריקה")!;
    let deleteResult!: { ok: boolean };
    act(() => {
      deleteResult = result.current.deleteCategory(created.id);
    });

    expect(deleteResult.ok).toBe(true);
    expect(result.current.categories.find((c) => c.id === created.id)).toBeUndefined();
  });
});
