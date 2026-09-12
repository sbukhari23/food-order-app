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
  items: CartItem[];
  customer: Customer;
  total: number;
  status: 'pending' | 'preparing' | 'out-for-delivery' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
};
