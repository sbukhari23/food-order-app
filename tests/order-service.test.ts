import { describe, expect, it, vi } from "vitest";
import {
  createOrder,
  type OrderServiceDependencies,
} from "@/lib/services/order-service";

const meal = {
  id: "meal-1",
  name: "Test meal",
  description: "Fresh",
  price: 12,
  image: "images/test.jpg",
  category: "Mains",
};
const customer = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  street: "1 Way",
  postalCode: "10001",
  city: "London",
};
function dependencies(): OrderServiceDependencies {
  return {
    meals: { findById: vi.fn().mockResolvedValue(meal) },
    orders: { create: vi.fn(async (order) => order) },
  };
}

describe("createOrder", () => {
  it("computes the total from repository prices", async () => {
    const deps = dependencies();
    const order = await createOrder(
      { items: [{ id: "meal-1", quantity: 2 }], customer },
      "user-1",
      deps,
    );
    expect(order.total).toBe(24);
    expect(order.userId).toBe("user-1");
  });
  it("rejects missing meals", async () => {
    const deps = dependencies();
    deps.meals.findById = vi.fn().mockResolvedValue(null);
    await expect(
      createOrder(
        { items: [{ id: "missing", quantity: 1 }], customer },
        undefined,
        deps,
      ),
    ).rejects.toThrow("no longer available");
  });
});
