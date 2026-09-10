import { createContext, useContext, useState, type ReactNode } from "react";
import { readSession, removeSession, writeSession } from "@/lib/storage";

const SESSION_KEY = "techzone:admin:auth";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || DEFAULT_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_PASSWORD;

if (import.meta.env.PROD && ADMIN_PASSWORD === DEFAULT_PASSWORD) {
  console.warn(
    "[טכנוזון] פאנל הניהול פועל עם סיסמת ברירת המחדל (admin123) בסביבת production. הגדירו VITE_ADMIN_USERNAME/VITE_ADMIN_PASSWORD לפני פריסה.",
  );
}

// טוקן נגזר מהאישורים האמיתיים, כדי שכתיבה עיוורת ל-sessionStorage (למשל דרך
// devtools) לא תזייף session בלי לעבור דרך login בפועל.
function authToken(): string {
  return btoa(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}`);
}

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => readSession(SESSION_KEY, "") === authToken(),
  );

  const login = (username: string, password: string): boolean => {
    const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
      setIsAuthenticated(true);
      writeSession(SESSION_KEY, authToken());
    }
    return ok;
  };

  const logout = () => {
    setIsAuthenticated(false);
    removeSession(SESSION_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return ctx;
}
