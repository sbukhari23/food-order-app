"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Meal } from "@/lib/types";

const empty = {
  name: "",
  description: "",
  price: "",
  category: "Mains",
  image: "",
};
export default function AdminMealManager() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const load = () =>
    fetch("/api/meals")
      .then((response) => response.json())
      .then((data) => setMeals(data.meals ?? []));
  useEffect(() => {
    load();
  }, []);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, price: Number(form.price) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMeals((current) => [...current, data.meal]);
      setForm(empty);
      toast.success("Meal created");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "We could not save that meal.",
      );
    } finally {
      setSaving(false);
    }
  };
  const remove = async (meal: Meal) => {
    if (!window.confirm(`Delete ${meal.name}? This cannot be undone.`)) return;
    const response = await fetch(`/api/meals/${meal.id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("We could not remove that meal.");
      return;
    }
    setMeals((current) => current.filter((item) => item.id !== meal.id));
    toast.success("Meal removed");
  };
  return (
    <div className="admin-manager">
      <form className="panel" onSubmit={submit}>
        <h2>Add a meal</h2>
        <div className="form-grid">
          {(["name", "description", "price", "category", "image"] as const).map(
            (field) => (
              <div
                className={`field ${field === "description" ? "full" : ""}`}
                key={field}
              >
                <label htmlFor={`meal-${field}`}>
                  {field[0].toUpperCase() + field.slice(1)}
                </label>
                <input
                  className="input"
                  id={`meal-${field}`}
                  required={field !== "description"}
                  value={form[field]}
                  onChange={(event) =>
                    setForm({ ...form, [field]: event.target.value })
                  }
                />
              </div>
            ),
          )}
        </div>
        <button className="button" disabled={saving}>
          {saving ? "Saving…" : "Create meal"}
        </button>
      </form>
      <div className="panel">
        <h2>Current menu</h2>
        {meals.map((meal) => (
          <div className="admin-row" key={meal.id}>
            <span>
              {meal.name}
              <small className="muted"> {meal.category}</small>
            </span>
            <span>${meal.price.toFixed(2)}</span>
            <button
              className="icon-button danger"
              onClick={() => remove(meal)}
              aria-label={`Delete ${meal.name}`}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
