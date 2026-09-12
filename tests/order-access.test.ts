import { describe, expect, it, vi, beforeEach } from "vitest";

const getSession = vi.fn();
const connectDb = vi.fn();
const findOne = vi.fn();
const findById = vi.fn();
vi.mock("../lib/auth", () => ({ getSession }));
vi.mock("../lib/db", () => ({ connectDb }));
vi.mock("../models/Order", () => ({ OrderModel: { findOne, findById } }));
vi.mock("../lib/order-store", () => ({ getOrder: vi.fn() }));

const { GET } = await import("../app/api/orders/[orderId]/route");
const order = {
  id: "order-uuid",
  customer: { email: "owner@example.com" },
  items: [],
  total: 10,
};

function request() {
  return new Request("http://localhost/api/orders/order-uuid");
}

describe("GET /api/orders/[orderId]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDb.mockResolvedValue({});
    findOne.mockReturnValue({ lean: () => Promise.resolve(order) });
    findById.mockReturnValue({ lean: () => Promise.resolve(null) });
  });

  it.each([
    ["guest", null, 200],
    [
      "owner",
      { user: { id: "owner-1", role: "user", email: "owner@example.com" } },
      200,
    ],
    [
      "admin",
      { user: { id: "admin-1", role: "admin", email: "admin@example.com" } },
      200,
    ],
    [
      "different user",
      { user: { id: "other-1", role: "user", email: "other@example.com" } },
      403,
    ],
  ])(
    "returns the expected access for a %s",
    async (_label, session, status) => {
      getSession.mockResolvedValue(session);
      expect(
        (
          await GET(request(), {
            params: Promise.resolve({ orderId: "order-uuid" }),
          })
        ).status,
      ).toBe(status);
    },
  );
});
