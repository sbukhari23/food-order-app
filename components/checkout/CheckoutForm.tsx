"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "@/lib/validations";
import { z } from "zod";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trackEvent } from "@/lib/analytics";

const schema = customerSchema;
type FormValues = z.infer<typeof schema>;
type CheckoutProps = { initialValues?: Partial<FormValues> };

export default function CheckoutForm({ initialValues }: CheckoutProps) {
  const { items, total, dispatch } = useCart();
  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: initialValues,
  });
  useEffect(() => {
    const saved = sessionStorage.getItem("reactfood-checkout");
    if (saved) {
      Object.entries(JSON.parse(saved) as Partial<FormValues>).forEach(
        ([key, value]) => {
          if (typeof value === "string")
            setValue(key as keyof FormValues, value);
        },
      );
    }
    trackEvent("checkout_started", { cartItems: items.length });
  }, [items.length, setValue]);

  const discount = promoApplied ? Number((total * 0.1).toFixed(2)) : 0;
  const payableTotal = total - discount;
  const submit = async (customer: FormValues) => {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items.map(({ id, quantity }) => ({ id, quantity })),
        customer,
        promoCode: promoApplied ? promoCode : undefined,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error ?? "Could not place order");
      return;
    }
    const checkout = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: data.order.id }),
    });
    const checkoutData = await checkout.json();
    if (!checkout.ok) {
      toast.error(checkoutData.error ?? "Could not start payment");
      return;
    }
    sessionStorage.removeItem("reactfood-checkout");
    trackEvent("checkout_completed", {
      orderId: data.order.id,
      total: data.order.total,
    });
    dispatch({ type: "clear" });
    router.push(checkoutData.url);
  };

  return (
    <form
      className="panel"
      onChange={(event) => {
        const form = event.currentTarget;
        sessionStorage.setItem(
          "reactfood-checkout",
          JSON.stringify(Object.fromEntries(new FormData(form).entries())),
        );
      }}
      onSubmit={handleSubmit(submit)}
    >
      <div className="form-grid">
        {(["name", "email", "street", "postalCode", "city"] as const).map(
          (field) => (
            <div
              className={`field ${field === "street" ? "full" : ""}`}
              key={field}
            >
              <label htmlFor={field}>
                {field === "postalCode"
                  ? "Postal code"
                  : field[0].toUpperCase() + field.slice(1)}
              </label>
              <input
                className="input"
                id={field}
                type={field === "email" ? "email" : "text"}
                {...register(field)}
              />
              {errors[field] && (
                <span className="error-text">{errors[field]?.message}</span>
              )}
            </div>
          ),
        )}
      </div>
      <div className="promo-row">
        <label htmlFor="promo">Promo code</label>
        <div className="promo-controls">
          <input
            className="input"
            id="promo"
            value={promoCode}
            onChange={(event) => {
              setPromoCode(event.target.value);
              setPromoApplied(false);
            }}
            placeholder="Try WELCOME10"
          />
          <button
            type="button"
            className="button secondary"
            onClick={() => {
              if (promoCode.trim().toUpperCase() === "WELCOME10") {
                setPromoApplied(true);
                toast.success("Promo applied");
              } else toast.error("That promo code is not available.");
            }}
          >
            Apply
          </button>
        </div>
        {promoApplied && (
          <span className="success-text">10% discount applied</span>
        )}
      </div>
      <div className="checkout-estimate">
        <span>Estimated delivery</span>
        <strong>30–45 minutes</strong>
      </div>
      <button
        className="button"
        disabled={isSubmitting || !isValid || items.length === 0}
        style={{ marginTop: "1.25rem" }}
      >
        {isSubmitting
          ? "Opening secure payment…"
          : `Pay now · $${payableTotal.toFixed(2)}`}
      </button>
    </form>
  );
}
