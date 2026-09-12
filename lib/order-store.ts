import type { Order } from './types';

const orders = new Map<string, Order>();
export function saveOrder(order: Order) { orders.set(order.id, order); return order; }
export function getOrder(id: string) { return orders.get(id); }
export function listOrders() { return [...orders.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)); }
