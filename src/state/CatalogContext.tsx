import { createContext, useContext, useMemo, useReducer, useEffect, type ReactNode } from "react";
import type { Category, Product } from "@/types/product";
import { categories as seedCategories } from "@/data/categories";
import { products as seedProducts } from "@/data/products";
import { readStorage, writeStorage } from "@/lib/storage";
import { generateId, slugify } from "@/lib/utils";

const STORAGE_KEY = "techzone:catalog:v1";

interface CatalogState {
  categories: Category[];
  products: Product[];
}

type CatalogAction =
  | { type: "ADD_PRODUCT"; product: Product }
  | { type: "UPDATE_PRODUCT"; id: string; changes: Partial<Product> }
  | { type: "DELETE_PRODUCT"; id: string }
  | { type: "ADD_CATEGORY"; category: Category }
  | { type: "UPDATE_CATEGORY"; id: string; changes: Partial<Category> }
  | { type: "DELETE_CATEGORY"; id: string };

function catalogReducer(state: CatalogState, action: CatalogAction): CatalogState {
  switch (action.type) {
    case "ADD_PRODUCT":
      return { ...state, products: [action.product, ...state.products] };
    case "UPDATE_PRODUCT":
      return {
        ...state,
        products: state.products.map((p) => (p.id === action.id ? { ...p, ...action.changes } : p)),
      };
    case "DELETE_PRODUCT":
      return { ...state, products: state.products.filter((p) => p.id !== action.id) };
    case "ADD_CATEGORY":
      return { ...state, categories: [...state.categories, action.category] };
    case "UPDATE_CATEGORY":
      return {
        ...state,
        categories: state.categories.map((c) =>
          c.id === action.id ? { ...c, ...action.changes } : c,
        ),
      };
    case "DELETE_CATEGORY":
      return { ...state, categories: state.categories.filter((c) => c.id !== action.id) };
    default:
      return state;
  }
}

function loadInitialState(): CatalogState {
  return readStorage<CatalogState>(STORAGE_KEY, {
    categories: seedCategories,
    products: seedProducts,
  });
}

export interface ProductInput {
  name: string;
  categoryId: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  specs: { key: string; value: string }[];
  inStock: boolean;
  featured: boolean;
  sku: string;
}

export interface CategoryInput {
  name: string;
  description: string;
  icon: Category["icon"];
  gradient: string;
}

export type CatalogResult = { ok: true } | { ok: false; error: string };

interface CatalogContextValue {
  categories: Category[];
  products: Product[];
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductsByCategory: (categoryId: string) => Product[];
  addProduct: (input: ProductInput) => CatalogResult;
  updateProduct: (id: string, input: ProductInput) => CatalogResult;
  deleteProduct: (id: string) => CatalogResult;
  addCategory: (input: CategoryInput) => CatalogResult;
  updateCategory: (id: string, input: CategoryInput) => CatalogResult;
  deleteCategory: (id: string) => CatalogResult;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(catalogReducer, undefined, loadInitialState);

  useEffect(() => {
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  const value = useMemo<CatalogContextValue>(() => {
    const getCategoryBySlug = (slug: string) => state.categories.find((c) => c.slug === slug);
    const getCategoryById = (id: string) => state.categories.find((c) => c.id === id);
    const getProductBySlug = (slug: string) => state.products.find((p) => p.slug === slug);
    const getProductsByCategory = (categoryId: string) =>
      state.products.filter((p) => p.categoryId === categoryId);

    const addProduct = (input: ProductInput): CatalogResult => {
      if (!input.name.trim()) return { ok: false, error: "שם המוצר הוא שדה חובה" };
      if (input.price <= 0) return { ok: false, error: "המחיר חייב להיות גדול מאפס" };
      if (!input.categoryId) return { ok: false, error: "יש לבחור קטגוריה" };
      const slug = slugify(input.name);
      if (state.products.some((p) => p.slug === slug)) {
        return { ok: false, error: "כבר קיים מוצר עם שם דומה מדי (slug זהה)" };
      }
      dispatch({ type: "ADD_PRODUCT", product: { id: generateId("prod"), slug, ...input } });
      return { ok: true };
    };

    const updateProduct = (id: string, input: ProductInput): CatalogResult => {
      if (!input.name.trim()) return { ok: false, error: "שם המוצר הוא שדה חובה" };
      if (input.price <= 0) return { ok: false, error: "המחיר חייב להיות גדול מאפס" };
      if (!input.categoryId) return { ok: false, error: "יש לבחור קטגוריה" };
      const slug = slugify(input.name);
      if (state.products.some((p) => p.slug === slug && p.id !== id)) {
        return { ok: false, error: "כבר קיים מוצר עם שם דומה מדי (slug זהה)" };
      }
      dispatch({ type: "UPDATE_PRODUCT", id, changes: { ...input, slug } });
      return { ok: true };
    };

    const deleteProduct = (id: string): CatalogResult => {
      dispatch({ type: "DELETE_PRODUCT", id });
      return { ok: true };
    };

    const addCategory = (input: CategoryInput): CatalogResult => {
      if (!input.name.trim()) return { ok: false, error: "שם הקטגוריה הוא שדה חובה" };
      const slug = slugify(input.name);
      if (state.categories.some((c) => c.slug === slug)) {
        return { ok: false, error: "כבר קיימת קטגוריה עם שם דומה מדי" };
      }
      dispatch({ type: "ADD_CATEGORY", category: { id: generateId("cat"), slug, ...input } });
      return { ok: true };
    };

    const updateCategory = (id: string, input: CategoryInput): CatalogResult => {
      if (!input.name.trim()) return { ok: false, error: "שם הקטגוריה הוא שדה חובה" };
      const slug = slugify(input.name);
      if (state.categories.some((c) => c.slug === slug && c.id !== id)) {
        return { ok: false, error: "כבר קיימת קטגוריה עם שם דומה מדי" };
      }
      dispatch({ type: "UPDATE_CATEGORY", id, changes: { ...input, slug } });
      return { ok: true };
    };

    const deleteCategory = (id: string): CatalogResult => {
      const hasProducts = state.products.some((p) => p.categoryId === id);
      if (hasProducts) {
        return {
          ok: false,
          error: "לא ניתן למחוק קטגוריה שיש בה מוצרים — יש להעביר או למחוק אותם קודם",
        };
      }
      dispatch({ type: "DELETE_CATEGORY", id });
      return { ok: true };
    };

    return {
      categories: state.categories,
      products: state.products,
      getCategoryBySlug,
      getCategoryById,
      getProductBySlug,
      getProductsByCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
    };
  }, [state]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error("useCatalog must be used within a CatalogProvider");
  return ctx;
}
