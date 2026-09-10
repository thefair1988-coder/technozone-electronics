import { Link } from "react-router-dom";
import { CompassIcon } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useDocumentTitle } from "@/lib/useDocumentTitle";

export function NotFoundPage() {
  useDocumentTitle("הדף לא נמצא");
  return (
    <EmptyState
      icon={CompassIcon}
      title="הדף שחיפשתם לא נמצא"
      description="ייתכן שהקישור שגוי או שהמוצר/הקטגוריה כבר לא קיימים"
      action={
        <Button asChild>
          <Link to="/">חזרה לעמוד הבית</Link>
        </Button>
      }
      className="mt-10"
    />
  );
}
