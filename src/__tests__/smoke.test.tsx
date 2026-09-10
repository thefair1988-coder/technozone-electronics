import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { CatalogProvider } from "@/state/CatalogContext";
import { CartProvider } from "@/state/CartContext";
import { OrdersProvider } from "@/state/OrdersContext";
import { ToastProvider } from "@/components/ui/Toast";
import { HomePage } from "@/pages/HomePage";
import { ProductPage } from "@/pages/ProductPage";
import { categories } from "@/data/categories";
import { products } from "@/data/products";
import { Routes, Route } from "react-router-dom";

function AllProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CatalogProvider>
        <OrdersProvider>
          <CartProvider>{children}</CartProvider>
        </OrdersProvider>
      </CatalogProvider>
    </ToastProvider>
  );
}

describe("HomePage", () => {
  it("renders the store name and every category", () => {
    render(
      <MemoryRouter>
        <AllProviders>
          <HomePage />
        </AllProviders>
      </MemoryRouter>,
    );

    expect(screen.getByText(/טכנוזון חשמל אונליין/)).toBeInTheDocument();
    for (const category of categories) {
      expect(screen.getAllByText(category.name).length).toBeGreaterThan(0);
    }
  });
});

describe("ProductPage", () => {
  it("renders a product's name and price", () => {
    const product = products[0]!;
    render(
      <MemoryRouter initialEntries={[`/product/${product.slug}`]}>
        <AllProviders>
          <Routes>
            <Route path="/product/:slug" element={<ProductPage />} />
          </Routes>
        </AllProviders>
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: product.name })).toBeInTheDocument();
    expect(screen.getByText(/הוספה לעגלה/)).toBeInTheDocument();
  });
});
