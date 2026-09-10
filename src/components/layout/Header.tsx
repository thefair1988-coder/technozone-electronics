import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingCart, Zap, X } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";
import { useCart } from "@/state/CartContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Header() {
  const { categories } = useCatalog();
  const { totalQuantity } = useCart();
  const navigate = useNavigate();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      setMobileOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <button
          type="button"
          className="rounded-md p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="תפריט"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>

        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Zap className="h-5 w-5" fill="currentColor" />
          </span>
          <span className="hidden text-lg font-extrabold text-slate-900 sm:inline">
            טכנוזון חשמל אונליין
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-auto hidden max-w-md flex-1 items-center lg:flex"
        >
          <div className="relative w-full">
            <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש מוצרים, מותגים וקטגוריות..."
              className="ps-9"
              aria-label="חיפוש מוצרים"
            />
          </div>
        </form>

        <div className="ms-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="חיפוש"
            onClick={() => setMobileOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="עגלת קניות"
            onClick={() => setCartOpen(true)}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 ? (
              <span className="absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-bold text-white">
                {totalQuantity}
              </span>
            ) : null}
          </Button>
        </div>
      </div>

      <nav className="hidden border-t border-slate-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-4 py-2 text-sm font-medium text-slate-600 sm:px-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="whitespace-nowrap hover:text-brand-700"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      {mobileOpen ? (
        <div className="border-t border-slate-100 px-4 py-3 lg:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <Search className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="חיפוש מוצרים..."
                className="ps-9"
                autoFocus
                aria-label="חיפוש מוצרים"
              />
            </div>
          </form>
          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/category/${category.slug}`}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setMobileOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </header>
  );
}
