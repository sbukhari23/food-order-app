export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "out-for-delivery",
  "delivered",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  preparing: "Preparing",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
};

export type Meal = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  rating?: number;
  reviewCount?: number;
};

export type CartItem = Meal & { quantity: number };

export type Customer = {
  name: string;
  email: string;
  street: string;
  postalCode: string;
  city: string;
};

export type Order = {
  id: string;
  userId?: string;
  items: CartItem[];
  customer: Customer;
  total: number;
  discount?: number;
  promoCode?: string;
  status: OrderStatus;
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
};
