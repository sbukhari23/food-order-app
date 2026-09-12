import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { paymentProvider } from "@/lib/payment";
import type { Order } from "@/lib/types";

export async function POST(request: Request) {
  const { orderId } = await request.json();
  const database = await connectDb();
  if (!database)
    return NextResponse.json(
      {
        error:
          "We could not start payment right now. Please try again shortly.",
      },
      { status: 503 },
    );
  const order = await OrderModel.findOne({ id: orderId }).lean();
  if (!order)
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  const url = await paymentProvider.createCheckoutSession({
    ...order,
    id: order.id,
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
  } as Order);
  return NextResponse.json({ url });
}
