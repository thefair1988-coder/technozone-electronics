import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { Zap, Lock } from "lucide-react";
import { useAdminAuth } from "@/state/AdminAuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent } from "@/components/ui/Card";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function AdminLoginPage() {
  useDocumentTitle("כניסת מנהלים");
  const { isAuthenticated, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!login(username, password)) {
      setError("שם משתמש או סיסמה שגויים");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-sm">
        <CardContent className="flex flex-col items-center gap-4 pt-8">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Lock className="h-6 w-6" />
          </span>
          <div className="text-center">
            <h1 className="text-lg font-bold text-slate-900">כניסת מנהלים</h1>
            <p className="text-sm text-slate-500">פאנל הניהול של טכנוזון חשמל אונליין</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-2 flex w-full flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username">שם משתמש</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">סיסמה</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <Button type="submit" size="lg" className="mt-2">
              כניסה
            </Button>
          </form>

          {import.meta.env.DEV ? (
            <p className="flex items-center gap-1 text-xs text-slate-400">
              <Zap className="h-3 w-3" /> ברירת מחדל (dev בלבד): admin / admin123
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
