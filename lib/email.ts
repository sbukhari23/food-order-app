import type { Order } from "./types";

export async function sendOrderConfirmation(order: Order) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return;

  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [order.customer.email],
      subject: `ReactFood order ${order.id}`,
      html: `<h1>Order received</h1><p>Thanks ${order.customer.name}. Your order <strong>${order.id}</strong> is confirmed for $${order.total.toFixed(2)}.</p>`,
    }),
  });
}
