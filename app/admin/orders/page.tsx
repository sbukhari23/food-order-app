export default function AdminOrders() {
  return (
    <section className="shell form-page">
      <span className="kicker">Admin · fulfillment</span>
      <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>Keep it moving.</h1>
      <div className="notice">
        The admin API supports status updates for pending, preparing,
        out-for-delivery, and delivered orders.
      </div>
    </section>
  );
}
