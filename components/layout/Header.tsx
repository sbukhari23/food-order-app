"use client";
import Link from "next/link";
import Image from "next/image";
import { Moon, ShoppingBag, Sun, UserRound } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useTheme } from "@/context/ThemeContext";

export default function Header() {
  const { count, setOpen, announcement } = useCart();
  const { theme, toggle } = useTheme();
  const [pulse, setPulse] = useState(false);
  const previousCount = useRef(count);

  useEffect(() => {
    const previous = previousCount.current;
    previousCount.current = count;
    if (count > previous) {
      setPulse(true);
      const timer = window.setTimeout(() => setPulse(false), 450);
      return () => window.clearTimeout(timer);
    }
  }, [count]);

  return (
    <header className="header">
      <div className="shell header-inner">
        <Link href="/" className="brand">
          <Image src="/logo.jpg" alt="ReactFood logo" width={42} height={42} />
          <span>ReactFood</span>
        </Link>
        <nav className="nav" aria-label="Primary navigation">
          <Link className="nav-link" href="/#menu">
            Menu
          </Link>
          <Link className="nav-link" href="/account">
            <UserRound size={17} aria-hidden="true" />
            Account
          </Link>
          <button
            className="icon-button"
            onClick={toggle}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            className={`icon-button ${pulse ? "cart-pulse" : ""}`}
            onClick={() => setOpen(true)}
            aria-label={`Open cart, ${count} items`}
          >
            <ShoppingBag size={19} aria-hidden="true" />
            Cart <span className="badge">{count}</span>
          </button>
        </nav>
      </div>
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </header>
  );
}
