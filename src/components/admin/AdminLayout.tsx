import { Link, NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ClipboardList,
  LogOut,
  Zap,
  ExternalLink,
} from "lucide-react";
import { useAdminAuth } from "@/state/AdminAuthContext";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/admin/dashboard", label: "דשבורד", icon: LayoutDashboard },
  { to: "/admin/products", label: "מוצרים", icon: Package },
  { to: "/admin/categories", label: "קטגוריות", icon: FolderTree },
  { to: "/admin/orders", label: "הזמנות", icon: ClipboardList },
];

export function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="flex w-60 shrink-0 flex-col border-e border-slate-200 bg-white">
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Zap className="h-4 w-4" fill="currentColor" />
          </span>
          <span className="text-sm font-bold text-slate-900">טכנוזון · ניהול</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100",
                  isActive && "bg-brand-50 text-brand-700",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-col gap-1 border-t border-slate-100 p-3">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
          >
            <ExternalLink className="h-4 w-4" />
            צפייה באתר
          </Link>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-start text-sm text-slate-600 hover:bg-slate-100"
          >
            <LogOut className="h-4 w-4" />
            התנתקות
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
