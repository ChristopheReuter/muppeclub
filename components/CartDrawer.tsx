"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/useCart";

export default function CartDrawer() {
  const { isOpen, close, items, subtotal, remove, clear } = useCart();
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    if (isOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  // Simple focus trap when open
  useEffect(() => {
    if (!isOpen) return;
    const first = panelRef.current?.querySelector<HTMLElement>("button, a, input, select, textarea, [tabindex]:not([tabindex='-1'])");
    first?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999]" aria-modal="true" role="dialog" aria-label="Shopping cart">
      <div
        ref={overlayRef}
        onClick={(e) => {
          if (e.target === overlayRef.current) close();
        }}
        className="absolute inset-0 bg-black/40"
      />

      <div
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl p-4 flex flex-col outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D]"
        tabIndex={-1}
      >
        <div className="flex items-center justify-between pb-3 border-b border-black/10">
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={close} className="rounded px-2 py-1 hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D]">Close</button>
        </div>

        <div className="flex-1 overflow-auto divide-y divide-black/5">
          {items.length === 0 ? (
            <p className="p-4 text-sm text-gray-600">Your cart is empty.</p>
          ) : (
            items.map((it) => (
              <div key={it.id} className="flex items-center justify-between p-3">
                <div className="min-w-0">
                  <div className="font-medium truncate">{it.name}</div>
                  <div className="text-sm text-gray-600">Qty {it.qty}</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="font-semibold">${(it.price * it.qty).toFixed(2)}</div>
                  <button
                    onClick={() => remove(it.id)}
                    className="rounded border border-black/10 px-2 py-1 text-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-t border-black/10 pt-3 space-y-3">
          <div className="flex items-center justify-between text-base">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={clear}
              className="rounded border border-black/10 px-3 py-2 text-sm hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D]"
            >
              Clear
            </button>
            <button
              className="rounded bg-[#00A89D] text-white px-4 py-2 font-medium hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00A89D]"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


