import type Stripe from "stripe";
import { stripe } from "./stripe";
import type { Order } from "./types";

export type PaymentProvider = {
  createCheckoutSession(order: Order): Promise<string | null>;
  verifyWebhookEvent(payload: string, signature: string): Stripe.Event;
};

export class StripePaymentProvider implements PaymentProvider {
  constructor(private readonly client = stripe) {}

  async createCheckoutSession(order: Order) {
    if (!this.client) return `/order-confirmation/${order.id}`;
    const session = await this.client.checkout.sessions.create({
      mode: "payment",
      line_items: order.items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      })),
      customer_email: order.customer.email,
      metadata: { orderId: order.id },
      success_url: `${process.env.NEXTAUTH_URL}/order-confirmation/${order.id}?paid=1`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout?cancelled=1`,
    });
    return session.url;
  }

  verifyWebhookEvent(payload: string, signature: string) {
    if (!this.client || !process.env.STRIPE_WEBHOOK_SECRET)
      throw new Error("Payment verification is unavailable.");
    return this.client.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  }
}

export const paymentProvider = new StripePaymentProvider();
