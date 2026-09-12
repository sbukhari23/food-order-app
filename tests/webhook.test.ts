import { describe, expect, it, vi, beforeEach } from "vitest";

process.env.STRIPE_SECRET_KEY = "sk_test_key";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
const constructEvent = vi.fn();
const connectDb = vi.fn();
const findOneAndUpdate = vi.fn();
const sendOrderConfirmation = vi.fn();
vi.mock("../lib/stripe", () => ({ stripe: { webhooks: { constructEvent } } }));
vi.mock("../lib/db", () => ({ connectDb }));
vi.mock("../models/Order", () => ({ OrderModel: { findOneAndUpdate } }));
vi.mock("../lib/email", () => ({ sendOrderConfirmation }));

const { POST } = await import("../app/api/webhooks/stripe/route");
const paidOrder = {
  id: "order-uuid",
  items: [],
  customer: {
    name: "Ada",
    email: "ada@example.com",
    street: "1 Way",
    postalCode: "10001",
    city: "London",
  },
  total: 10,
  status: "pending",
  paymentStatus: "paid",
  createdAt: new Date(),
};

function request() {
  return new Request("http://localhost/api/webhooks/stripe", {
    method: "POST",
    headers: { "stripe-signature": "valid" },
    body: "{}",
  });
}

describe("Stripe webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    connectDb.mockResolvedValue({});
    findOneAndUpdate.mockReturnValue({
      lean: () => Promise.resolve(paidOrder),
    });
    constructEvent.mockReturnValue({
      type: "checkout.session.completed",
      data: { object: { metadata: { orderId: "order-uuid" } } },
    });
  });

  it("marks the MongoDB order paid and sends confirmation email", async () => {
    expect((await POST(request())).status).toBe(200);
    expect(findOneAndUpdate).toHaveBeenCalledWith(
      { id: "order-uuid" },
      { paymentStatus: "paid" },
      { new: true },
    );
    expect(sendOrderConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({ paymentStatus: "paid" }),
    );
  });

  it("rejects an invalid signature without a database write", async () => {
    constructEvent.mockImplementation(() => {
      throw new Error("invalid");
    });
    expect((await POST(request())).status).toBe(400);
    expect(findOneAndUpdate).not.toHaveBeenCalled();
  });
});
