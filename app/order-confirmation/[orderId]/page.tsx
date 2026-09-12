import Link from "next/link";
import OrderStatus from "@/components/account/OrderStatus";
export default async function Confirmation({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return (
    <section className="shell form-page">
      <span className="kicker">Order received</span>
      <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
        That’s dinner sorted.
      </h1>
      <div className="panel">
        <p>
          Your order reference is <strong>{orderId}</strong>.
        </p>
        <OrderStatus orderId={orderId} />
        <Link
          href="/"
          className="button"
          style={{ display: "inline-block", marginTop: "1rem" }}
        >
          Back to menu
        </Link>
      </div>
    </section>
  );
}
