import { getSession } from "@/lib/auth";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import OrderSummary from "@/components/checkout/OrderSummary";

export default async function CheckoutPage() {
  const session = await getSession();
  return (
    <section className="shell form-page">
      <span className="kicker">Almost there</span>
      <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>
        Your table is waiting.
      </h1>
      <p className="lede">
        Tell us where to send it. Your cart and form details stay available if
        you step away.
      </p>
      <div className="checkout-layout">
        <CheckoutForm
          initialValues={{
            name: session?.user.name ?? "",
            email: session?.user.email ?? "",
          }}
        />
        <OrderSummary />
      </div>
      <p className="muted" style={{ marginTop: "1rem" }}>
        Guest checkout is enabled. Payment opens in Stripe’s secure hosted
        checkout.
      </p>
    </section>
  );
}
