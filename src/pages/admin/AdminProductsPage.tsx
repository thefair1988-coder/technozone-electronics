import { useState } from "react";
import { Link } from "react-router-dom";
import { MoreVertical, Plus, Pencil, Trash2, PackageX } from "lucide-react";
import { useCatalog } from "@/state/CatalogContext";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/DropdownMenu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/Dialog";
import { formatPrice } from "@/lib/currency";
import { useDocumentTitle } from "@/lib/useDocumentTitle";
import type { Product } from "@/types/product";

export function AdminProductsPage() {
  useDocumentTitle("ניהול מוצרים");
  const { products, categories, updateProduct, deleteProduct } = useCatalog();
  const { toast } = useToast();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const categoryName = (categoryId: string) =>
    categories.find((c) => c.id === categoryId)?.name ?? "—";

  const toggleStock = (product: Product) => {
    const result = updateProduct(product.id, { ...product, inStock: !product.inStock });
    if (result.ok) {
      toast({
        title: product.inStock ? "המוצר סומן כאזל" : "המוצר סומן כזמין במלאי",
        variant: "success",
      });
    }
  };

  const confirmDelete = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    toast({ title: "המוצר נמחק", description: productToDelete.name, variant: "success" });
    setProductToDelete(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">ניהול מוצרים</h1>
        <Button asChild>
          <Link to="/admin/products/new">
            <Plus className="h-4 w-4" />
            מוצר חדש
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={PackageX}
          title="אין עדיין מוצרים"
          description="הוסיפו מוצר ראשון כדי להתחיל"
        />
      ) : (
        <div className="rounded-xl border border-slate-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מוצר</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>מחיר</TableHead>
                <TableHead>מלאי</TableHead>
                <TableHead>מומלץ</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">
                      {product.brand} · {product.sku}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {categoryName(product.categoryId)}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-900">
                    {formatPrice(product.price)}
                  </TableCell>
                  <TableCell>
                    <Badge variant={product.inStock ? "success" : "secondary"}>
                      {product.inStock ? "במלאי" : "אזל"}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.featured ? <Badge>מומלץ</Badge> : null}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="פעולות">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/admin/products/${product.id}/edit`}>
                            <Pencil className="h-4 w-4" />
                            עריכה
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() => toggleStock(product)}>
                          <PackageX className="h-4 w-4" />
                          {product.inStock ? "סמן כאזל" : "סמן כזמין"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setProductToDelete(product)}
                          className="text-red-600 focus:bg-red-50 focus:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                          מחיקה
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>מחיקת מוצר</DialogTitle>
            <DialogDescription>
              האם למחוק את "{productToDelete?.name}"? לא ניתן לשחזר פעולה זו.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="secondary">ביטול</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              מחיקה
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
