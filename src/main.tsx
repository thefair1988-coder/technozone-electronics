import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "@/App";
import { CatalogProvider } from "@/state/CatalogContext";
import { CartProvider } from "@/state/CartContext";
import { OrdersProvider } from "@/state/OrdersContext";
import { AdminAuthProvider } from "@/state/AdminAuthContext";
import { ToastProvider } from "@/components/ui/Toast";
import "@/styles.css";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CatalogProvider>
          <OrdersProvider>
            <AdminAuthProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </AdminAuthProvider>
          </OrdersProvider>
        </CatalogProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
);
