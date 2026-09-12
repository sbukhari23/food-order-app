"use client";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";
import CartDrawer from "@/components/cart/CartDrawer";
import { ThemeProvider } from "@/context/ThemeContext";
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <CartProvider>
        <Toaster
          position="bottom-right"
          richColors
          duration={2800}
          visibleToasts={3}
          offset={{ bottom: 24, right: 24 }}
          toastOptions={{ className: "app-toast" }}
        />
        <CartDrawer />
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}
