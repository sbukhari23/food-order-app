"use client";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import type { CartItem } from "@/lib/types";
export default function ReorderButton({ items }: { items: CartItem[] }) {
  const { dispatch } = useCart();
  return (
    <button
      className="button secondary"
      onClick={() => {
        items.forEach((item) =>
          dispatch({ type: "add", meal: item, quantity: item.quantity }),
        );
        toast.success("Items added to cart");
      }}
    >
      Reorder
    </button>
  );
}
