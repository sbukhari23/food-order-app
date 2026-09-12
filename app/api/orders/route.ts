import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { orderSchema } from "@/lib/validations";
import { connectDb } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { listOrders } from "@/lib/order-store";
import { createOrder } from "@/lib/services/order-service";

export async function POST(request: Request) {
  const parsed = orderSchema.safeParse(await request.json());
  if (!parsed.success) {
    const details = Object.fromEntries(
      parsed.error.issues.flatMap((issue) => {
        const path = issue.path.join(".");
        const leaf = issue.path.at(-1);
        return leaf && path !== leaf
          ? [
              [path, issue.message],
              [leaf, issue.message],
            ]
          : [[path, issue.message]];
      }),
    );
    return NextResponse.json(
      { error: "Please correct the highlighted fields.", details },
      { status: 400 },
    );
  }

  const database = await connectDb();
  if (!database)
    return NextResponse.json(
      {
        error:
          "We could not place that order right now. Please try again shortly.",
      },
      { status: 503 },
    );

  const session = await getSession();
  try {
    const order = await createOrder(parsed.data, session?.user.id);
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "One or more meals are no longer available."
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      {
        error:
          "We could not place that order right now. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getSession();
  if (!session)
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  const database = await connectDb();
  if (database) {
    const query =
      session.user.role === "admin" ? {} : { userId: session.user.id };
    return NextResponse.json({
      orders: await OrderModel.find(query).sort({ createdAt: -1 }).lean(),
    });
  }
  return NextResponse.json({
    orders:
      session.user.role === "admin"
        ? listOrders()
        : listOrders().filter(
            (order) => order.customer.email === session.user.email,
          ),
  });
}
