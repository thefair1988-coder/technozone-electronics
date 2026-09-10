export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  notes?: string;
}

export type OrderStatus = "new" | "processing" | "shipped" | "completed" | "cancelled";

export interface Order {
  id: string;
  createdAt: string;
  items: OrderItem[];
  total: number;
  customer: CustomerDetails;
  status: OrderStatus;
}
