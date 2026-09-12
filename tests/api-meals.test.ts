import { describe, expect, it, vi, beforeEach } from "vitest";

const getSession = vi.fn();
const connectDb = vi.fn();
const createMeal = vi.fn();
vi.mock("../lib/auth", () => ({
  getSession,
  requireAdmin: (session: { user?: { role?: string } } | null) =>
    session?.user?.role === "admin",
}));
vi.mock("../lib/db", () => ({ connectDb }));
vi.mock("../models/Meal", () => ({ MealModel: { create: createMeal } }));

const { POST } = await import("../app/api/meals/route");

function request() {
  return new Request("http://localhost/api/meals", {
    method: "POST",
    body: JSON.stringify({
      name: "New meal",
      description: "Fresh",
      price: 12,
      category: "Mains",
      image: "images/new.jpg",
    }),
  });
}

describe("POST /api/meals", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDb.mockResolvedValue({});
  });

  it("rejects a non-admin session", async () => {
    getSession.mockResolvedValue({ user: { id: "user-1", role: "user" } });
    expect((await POST(request())).status).toBe(403);
    expect(createMeal).not.toHaveBeenCalled();
  });

  it("allows an admin to create a meal", async () => {
    getSession.mockResolvedValue({ user: { id: "admin-1", role: "admin" } });
    createMeal.mockResolvedValue({ id: "new-meal" });
    expect((await POST(request())).status).toBe(201);
    expect(createMeal).toHaveBeenCalled();
  });
});
