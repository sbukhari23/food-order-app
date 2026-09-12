"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, total, open, setOpen, dispatch, hydrated } = useCart();
  const drawerRef = useRef<HTMLElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key === "Tab" && drawerRef.current) {
        const focusable = [
          ...drawerRef.current.querySelectorAll<HTMLElement>("button,a[href]"),
        ];
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previousFocus.current?.focus();
    };
  }, [open, setOpen]);
  if (!open) return null;
  const removeItem = (item: (typeof items)[number]) => {
    dispatch({ type: "remove", id: item.id });
    toast.success(`${item.name} removed from cart`, {
      action: {
        label: "Undo",
        onClick: () =>
          dispatch({ type: "add", meal: item, quantity: item.quantity }),
      },
    });
  };
  return (
    <>
      <div className="drawer-backdrop" onClick={() => setOpen(false)} />
      <aside
        ref={drawerRef}
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
        <button
          className="drawer-close"
          onClick={() => setOpen(false)}
          aria-label="Close cart"
        >
          <X />
        </button>
        <h2>Your cart</h2>
        {!hydrated ? (
          <p className="muted">Syncing your cart…</p>
        ) : items.length === 0 ? (
          <p>Your cart is waiting for something delicious.</p>
        ) : (
          items.map((item) => (
            <div className="cart-line" key={item.id}>
              <Image
                src={`/${item.image}`}
                alt={item.name}
                width={58}
                height={58}
                placeholder="blur"
                blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/AP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAQUCf//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8Bf//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8Bf//EABQQAQAAAAAAAAAAAAAAAAAAABD/2gAIAQEABj8Cf//Z"
              />
              <div>
                <strong>{item.name}</strong>
                <div>${item.price.toFixed(2)} each</div>
                <div className="quantity">
                  <button
                    onClick={() =>
                      dispatch({
                        type: "update",
                        id: item.id,
                        quantity: item.quantity - 1,
                      })
                    }
                    aria-label={`Decrease ${item.name}`}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch({
                        type: "update",
                        id: item.id,
                        quantity: item.quantity + 1,
                      })
                    }
                    aria-label={`Increase ${item.name}`}
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="drawer-close"
                onClick={() => removeItem(item)}
                aria-label={`Remove ${item.name}`}
              >
                <Trash2 size={17} />
              </button>
            </div>
          ))
        )}
        <div className="total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <Link
          className="button"
          style={{ display: "block", textAlign: "center" }}
          href="/checkout"
          onClick={() => setOpen(false)}
        >
          Proceed to checkout
        </Link>
      </aside>
    </>
  );
}
