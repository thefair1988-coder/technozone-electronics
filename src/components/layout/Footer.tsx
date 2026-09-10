import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";

export function Footer() {
  const { categories } = useCatalog();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
              <Zap className="h-4 w-4" fill="currentColor" />
            </span>
            <span className="text-base font-extrabold text-slate-900">טכנוזון חשמל אונליין</span>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            חנות האלקטרוניקה והחשמל שלכם — מחשבים, סלולר, טלוויזיות ומוצרי חשמל לבית ולמטבח, במקום
            אחד.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">קטגוריות</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            {categories.slice(0, 6).map((category) => (
              <li key={category.id}>
                <Link to={`/category/${category.slug}`} className="hover:text-brand-700">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">שירות לקוחות</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <li>
              <Link to="/cart" className="hover:text-brand-700">
                עגלת הקניות שלי
              </Link>
            </li>
            <li className="text-slate-400">משלוחים ואיסוף עצמי</li>
            <li className="text-slate-400">מדיניות החזרות</li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">ניהול</p>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <li>
              <Link to="/admin" className="hover:text-brand-700">
                כניסת מנהלים
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-400 sm:px-6">
        © {new Date().getFullYear()} טכנוזון חשמל אונליין. כל הזכויות שמורות. המחירים באתר הם לדוגמה
        בלבד.
      </div>
    </footer>
  );
}
