"use client";
import { useEffect, useState } from "react";
import { featureFlags } from "@/lib/feature-flags";

type AdminOrder = { total: number; createdAt: string };
export default function AdminOverview() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  useEffect(() => {
    fetch("/api/orders")
      .then((response) => (response.ok ? response.json() : { orders: [] }))
      .then((data) => setOrders(data.orders ?? []));
  }, []);
  const revenue = orders.reduce((sum, order) => sum + order.total, 0);
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return {
      label: date.toLocaleDateString("en", { weekday: "short" }),
      value: orders.filter((order) => order.createdAt.slice(0, 10) === key)
        .length,
    };
  });
  const max = Math.max(1, ...days.map((day) => day.value));
  return (
    <div className="admin-overview">
      <div className="stats">
        <div className="panel">
          <span className="muted">Orders</span>
          <strong>{orders.length}</strong>
        </div>
        <div className="panel">
          <span className="muted">Revenue</span>
          <strong>${revenue.toFixed(2)}</strong>
        </div>
      </div>
      {featureFlags.adminCharts && (
        <div className="panel chart">
          <h3>Orders · last 7 days</h3>
          <div className="bars">
            {days.map((day) => (
              <div className="bar-column" key={day.label}>
                <div
                  className="bar"
                  style={{ height: `${Math.max(8, (day.value / max) * 100)}%` }}
                  title={`${day.value} orders`}
                />
                <span>{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
