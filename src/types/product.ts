export type IconName =
  "smartphone" | "laptop" | "tv" | "chef-hat" | "headphones" | "washing-machine" | "plug";

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: IconName;
  gradient: string;
}

export interface ProductSpec {
  key: string;
  value: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description: string;
  specs: ProductSpec[];
  inStock: boolean;
  featured: boolean;
  sku: string;
}
