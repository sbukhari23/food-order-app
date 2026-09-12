import { randomUUID } from "node:crypto";
import mongoose from "mongoose";
import { MealModel } from "@/models/Meal";
import { OrderModel } from "@/models/Order";
import type { CartItem, Customer, Order, OrderStatus } from "@/lib/types";

type MealRecord = {
  id?: string;
  _id?: unknown;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
};

type MealRepository = {
  findById(id: string): Promise<MealRecord | null>;
};

type OrderRepository = {
  create(order: Order): Promise<Order>;
};

export type OrderServiceDependencies = {
  meals: MealRepository;
  orders: OrderRepository;
};

const mongooseDependencies: OrderServiceDependencies = {
  meals: {
    async findById(id) {
      const meal = (await MealModel.findOne({
        id,
      }).lean()) as MealRecord | null;
      if (meal || !mongoose.isValidObjectId(id)) return meal;
      return (await MealModel.findById(id).lean()) as MealRecord | null;
    },
  },
  orders: {
    async create(order) {
      await OrderModel.create(order);
      return order;
    },
  },
};

/**
 * Creates a pending order from validated customer and cart input.
 * Throws when an item is missing from the authoritative meal repository.
 */
export async function createOrder(
  input: {
    items: Array<{ id: string; quantity: number }>;
    customer: Customer;
    promoCode?: string;
  },
  userId?: string,
  dependencies: OrderServiceDependencies = mongooseDependencies,
): Promise<Order> {
  if (!input.items.length) throw new Error("Order requires at least one item.");
  if (!input.customer?.name || !input.customer?.email)
    throw new Error("Order requires customer details.");

  const items: CartItem[] = [];
  for (const inputItem of input.items) {
    const meal = await dependencies.meals.findById(inputItem.id);
    if (!meal) throw new Error("One or more meals are no longer available.");
    items.push({
      id: meal.id ?? String(meal._id),
      name: meal.name,
      description: meal.description,
      price: meal.price,
      image: meal.image,
      category: meal.category,
      quantity: inputItem.quantity,
    });
  }

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const discount =
    input.promoCode?.toUpperCase() === "WELCOME10"
      ? Number((subtotal * 0.1).toFixed(2))
      : 0;
  const order: Order = {
    id: randomUUID(),
    userId,
    items,
    customer: input.customer,
    total: subtotal - discount,
    discount,
    promoCode: input.promoCode,
    status: "pending" as OrderStatus,
    paymentStatus: "pending",
    createdAt: new Date().toISOString(),
  };
  return dependencies.orders.create(order);
}
