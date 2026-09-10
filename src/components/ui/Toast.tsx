import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: "default" | "success" | "destructive";
}

interface ToastContextValue {
  toast: (message: Omit<ToastMessage, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const dismiss = useCallback((id: string) => {
    setMessages((current) => current.filter((message) => message.id !== id));
  }, []);

  const toast = useCallback(
    (message: Omit<ToastMessage, "id">) => {
      const id = Math.random().toString(36).slice(2);
      setMessages((current) => [...current, { ...message, id }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6">
        {messages.map((message) => (
          <div
            key={message.id}
            role="status"
            className={cn(
              "flex w-full max-w-sm items-start gap-3 rounded-lg border p-4 shadow-lg",
              message.variant === "destructive" && "border-red-200 bg-red-50",
              message.variant === "success" && "border-emerald-200 bg-emerald-50",
              (!message.variant || message.variant === "default") && "border-slate-200 bg-white",
            )}
          >
            {message.variant === "destructive" ? (
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
            ) : (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">{message.title}</p>
              {message.description ? (
                <p className="mt-0.5 text-sm text-slate-500">{message.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => dismiss(message.id)}
              className="text-slate-400 hover:text-slate-600"
              aria-label="סגור הודעה"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
