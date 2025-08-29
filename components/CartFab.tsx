"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/useCart";

// Simple basket glyph (fallback) since lucide-react is not in deps
function BasketIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6-6 6 6" />
      <path d="M3 9h18l-2 11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2L3 9z" />
      <path d="M16 13a2 2 0 1 1-4 0" />
    </svg>
  );
}

export default function CartFab() {
  const { itemCount, isBouncing, toggle } = useCart();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  // When bouncing, briefly add a stronger scale animation
  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;
    if (isBouncing) {
      el.classList.add("animate-bounce");
      const t = window.setTimeout(() => el.classList.remove("animate-bounce"), 600);
      return () => window.clearTimeout(t);
    }
  }, [isBouncing]);

  return (
    <button
      ref={btnRef}
      onClick={toggle}
      aria-label="Open cart"
      className="fixed bottom-4 right-4 z-[1000] rounded-full bg-[#00A89D] text-white shadow-lg outline-none ring-0 hover:brightness-110 active:scale-95 transition h-14 w-14 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00A89D]"
      aria-haspopup="dialog"
    >
      <BasketIcon className="h-6 w-6" />
      {itemCount > 0 ? (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-white text-[#00A89D] text-xs font-bold flex items-center justify-center ring-2 ring-[#00A89D]">
          {itemCount}
        </span>
      ) : null}
    </button>
  );
}


