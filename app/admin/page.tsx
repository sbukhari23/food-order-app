import Link from "next/link";
import AdminOverview from "@/components/admin/AdminOverview";
export default function Admin() {
  return (
    <section className="shell form-page">
      <span className="kicker">Operations</span>
      <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)" }}>The control room.</h1>
      <AdminOverview />
      <div className="grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
        <Link href="/admin/meals" className="panel">
          <h3>Meals</h3>
          <p className="muted">Create, edit, and retire menu items.</p>
        </Link>
        <Link href="/admin/orders" className="panel">
          <h3>Orders</h3>
          <p className="muted">Watch fulfillment and keep service moving.</p>
        </Link>
      </div>
    </section>
  );
}
