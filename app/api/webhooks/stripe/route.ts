import { NextResponse } from "next/server";
import { sendOrderConfirmation } from "@/lib/email";
import { connectDb } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { paymentProvider } from "@/lib/payment";

export async function POST(request: Request) {
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 503 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature)
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });

  let event;
  try {
    event = paymentProvider.verifyWebhookEvent(await request.text(), signature);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const database = await connectDb();
  if (!database) {
    return NextResponse.json(
      { error: "Payment confirmation is temporarily unavailable." },
      { status: 503 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    if (orderId) {
      const order = await OrderModel.findOneAndUpdate(
        { id: orderId },
        { paymentStatus: "paid" },
        { new: true },
      ).lean();
      if (order) {
        await sendOrderConfirmation({
          id: order.id,
          items: order.items,
          customer: order.customer,
          total: order.total,
          status: order.status,
          paymentStatus: order.paymentStatus,
          createdAt: order.createdAt.toISOString(),
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
