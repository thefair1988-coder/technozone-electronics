import { createContext, useContext, useState, type ReactNode } from "react";
import { readSession, removeSession, writeSession } from "@/lib/storage";

const SESSION_KEY = "techzone:admin:auth";

const DEFAULT_USERNAME = "admin";
const DEFAULT_PASSWORD = "admin123";

const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || DEFAULT_USERNAME;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || DEFAULT_PASSWORD;

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => readSession(SESSION_KEY, false));

  const login = (username: string, password: string): boolean => {
    const ok = username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD;
    if (ok) {
      setIsAuthenticated(true);
      writeSession(SESSION_KEY, true);
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
