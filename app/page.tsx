"use client";

import { useState, useMemo } from "react";
import ServiceChips from "@/components/ServiceChips";
import DateLocationPicker from "@/components/DateLocationPicker";
import { useCart } from "@/components/cart/useCart";

const ALL_SERVICES = [
  "Dog Walking",
  "Dog Training",
  "Dog Physiotherapy",
  "Vet",
  "Daycare",
  "Dog Pension",
];

export default function Home() {
  const { add } = useCart();
  const [selected, setSelected] = useState<string[]>([]);
  const [dateTime, setDateTime] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [toast, setToast] = useState<string>("");

  const canAdd = useMemo(() => selected.length > 0 && !!location && !!dateTime, [selected, location, dateTime]);

  function toggleService(svc: string) {
    setSelected((prev) => (prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]));
  }

  function formatWhen(): string {
    if (!dateTime) return "";
    try {
      const d = new Date(dateTime);
      if (isNaN(d.getTime())) return dateTime;
      return d.toLocaleString();
    } catch {
      return dateTime;
    }
  }

  function addToCart() {
    if (!canAdd) return;
    const when = formatWhen();
    selected.forEach((svc) => {
      const id = `${svc}|${dateTime}|${location}`;
      const name = `${svc} — ${when} @ ${location}`;
      add({ id, name, price: 0, qty: 1 });
    });
    setToast(`Added ${selected.length} item(s) to cart`);
    window.setTimeout(() => setToast(""), 1800);
  }

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F4E0B8]">
      <section className="mx-auto max-w-5xl px-4 py-12">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#00A89D]">
            Book trusted pet services, instantly
          </h1>
          <p className="mt-3 text-lg text-gray-800">
            Find professionals for walking, training, and more — tailored to your schedule.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <ServiceChips options={ALL_SERVICES} selected={selected} onToggle={toggleService} />

          <DateLocationPicker
            dateTime={dateTime}
            location={location}
            onDateTimeChange={setDateTime}
            onLocationChange={setLocation}
          />

          <div className="flex justify-center">
            <button
              onClick={addToCart}
              disabled={!canAdd}
              className={[
                "rounded-full px-6 py-3 text-white font-semibold transition",
                canAdd ? "bg-[#00A89D] hover:brightness-110 active:scale-95" : "bg-[#00A89D]/50 cursor-not-allowed",
              ].join(" ")}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      {toast ? (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 rounded bg-gray-900 text-white px-4 py-2 shadow-lg">
          {toast}
        </div>
      ) : null}
    </main>
  );
}