"use client";
import { useEffect, useState } from "react";
import type { Order, OrderStatus } from "@/lib/types";
import { ORDER_STATUSES, ORDER_STATUS_LABELS } from "@/lib/types";

export default function OrderStatus({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch(`/api/orders/${orderId}`)
        .then((response) => {
          if (!response.ok) throw new Error();
          return response.json();
        })
        .then((data) => {
          if (active) setOrder(data.order);
        })
        .catch(() => {
          if (active) setError("We could not refresh this order right now.");
        });
    load();
    const timer = window.setInterval(load, 15000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [orderId]);
  if (error) return <p className="error-text">{error}</p>;
  if (!order) return <div className="skeleton status-skeleton" />;
  return (
    <div className="order-status">
      <p className="muted">Payment: {order.paymentStatus}</p>
      <div className="status-track">
        {ORDER_STATUSES.map((status: OrderStatus, index) => (
          <div
            className={`status-step ${ORDER_STATUSES.indexOf(order.status) >= index ? "complete" : ""}`}
            key={status}
          >
            <span>{index + 1}</span>
            <strong>{ORDER_STATUS_LABELS[status]}</strong>
          </div>
        ))}
      </div>
      <p className="muted">Estimated delivery: 30–45 minutes</p>
    </div>
  );
}
