import { Navigate } from "react-router-dom";
import { useAdminAuth } from "@/state/AdminAuthContext";
import { AdminLayout } from "@/components/admin/AdminLayout";

export function ProtectedAdminRoute() {
  const { isAuthenticated } = useAdminAuth();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <AdminLayout />;
}
