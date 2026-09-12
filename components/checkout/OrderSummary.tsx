"use client";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
export default function OrderSummary() {
  const { items, total } = useCart();
  return (
    <aside className="panel checkout-summary">
      <h2>Order summary</h2>
      {items.length === 0 ? (
        <p className="muted">Your cart is empty.</p>
      ) : (
        items.map((item) => (
          <div className="summary-line" key={item.id}>
            <Image src={`/${item.image}`} alt="" width={44} height={44} />
            <span>
              {item.quantity} × {item.name}
            </span>
            <strong>${(item.price * item.quantity).toFixed(2)}</strong>
          </div>
        ))
      )}
      <div className="total">
        <span>Subtotal</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <p className="muted">Estimated delivery: 30–45 minutes</p>
    </aside>
  );
}
