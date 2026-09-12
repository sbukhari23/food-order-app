import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { connectDb } from "@/lib/db";
import { OrderModel } from "@/models/Order";
import { listOrders } from "@/lib/order-store";
import ReorderButton from "@/components/account/ReorderButton";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export default async function Orders() {
  const session = await getSession();
  if (!session) redirect("/login");

  const database = await connectDb();
  const orders = database
    ? await OrderModel.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .lean()
    : listOrders().filter(
        (order) => order.customer.email === session.user.email,
      );

  return (
    <section className="shell form-page">
      <span className="kicker">Your orders</span>
      <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>A little history.</h1>
      {orders.length === 0 ? (
        <div className="notice">
          No orders yet. Your next favorite is waiting on the menu.
        </div>
      ) : (
        <div className="panel">
          {orders.map((order) => (
            <div className="cart-line" key={String(order.id ?? order._id)}>
              <div>
                <strong>Order {String(order.id ?? order._id)}</strong>
                <div className="muted">
                  {ORDER_STATUS_LABELS[order.status as OrderStatus] ??
                    order.status}
                </div>
              </div>
              <strong>${order.total.toFixed(2)}</strong>
              <div className="order-actions">
                <Link
                  className="button secondary"
                  href={`/order-confirmation/${String(order.id ?? order._id)}`}
                >
                  View
                </Link>
                <ReorderButton items={order.items as never} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
