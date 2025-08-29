"use client";

import { useCart } from "@/components/cart/useCart";
import { useState } from "react";

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Checkout failed");
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Checkout</h1>
      <div className="mt-6 divide-y divide-black/10 rounded-md border border-black/10 bg-white">
        {items.length === 0 ? (
          <p className="p-4 text-gray-700">Your cart is empty.</p>
        ) : (
          items.map((it) => (
            <div key={it.id} className="flex items-center justify-between p-4">
              <div className="min-w-0">
                <div className="font-medium truncate">{it.name}</div>
              </div>
              <div className="font-semibold">€{it.price.toFixed(2)}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-semibold">Total: €{subtotal.toFixed(2)}</div>
        <button
          onClick={onCheckout}
          disabled={items.length === 0 || loading}
          className="rounded bg-[#00A89D] px-5 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Processing..." : "Proceed to payment"}
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </main>
  );
}


