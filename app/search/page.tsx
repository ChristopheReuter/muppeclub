"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AddToCartButton from "@/components/AddToCartButton";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Listing = {
  id: string;
  pro: { user: { name: string | null; email: string } };
  title: string;
  description: string;
  basePriceCents: number;
  durationMin: number;
  service: string;
  location?: string | null;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [service, setService] = useState("");
  const [location, setLocation] = useState("");
  const [data, setData] = useState<Listing[]>([]);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/search?" + new URLSearchParams({ q, service, location }));
      const json = await res.json();
      setData(json.listings ?? []);
    }
    load();
  }, [q, service, location]);

  const services = ["", "DOG_WALKING", "DOG_TRAINING", "PHYSIOTHERAPY", "VET", "DAYCARE", "DOG_PENSION"];

  const mapApiRef = useRef<{ panTo: (lat: number, lng: number) => void } | null>(null);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Search services</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input
          placeholder="Keyword"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
        />
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
        >
          {services.map((s) => (
            <option key={s} value={s}>{s || "All services"}</option>
          ))}
        </select>
        <input
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          {data.map((l) => (
          <div key={l.id} className="rounded-md border border-black/10 bg-white p-4 cursor-pointer" onClick={() => {
            // if API returns lat/lng in future, use those; for now, nudge around Berlin
            const lat = 52.52 + Math.random() * 0.02 - 0.01;
            const lng = 13.405 + Math.random() * 0.02 - 0.01;
            mapApiRef.current?.panTo(lat, lng);
          }}>
            <div className="text-xs text-gray-500">{l.service}</div>
            <div className="font-semibold mt-1">{l.title}</div>
            <div className="text-sm text-gray-700 mt-1 line-clamp-3">{l.description}</div>
            <div className="mt-2 text-sm">${(l.basePriceCents / 100).toFixed(2)} · {l.durationMin} min</div>
            <div className="mt-3">
              <AddToCartButton id={`listing:${l.id}`} name={`${l.title} by ${l.pro.user.name || l.pro.user.email}`} priceCents={l.basePriceCents} />
            </div>
          </div>
          ))}
        </div>
        <div className="h-[600px]">
          <MapView onReady={(api) => { mapApiRef.current = api; }} />
        </div>
      </div>
    </main>
  );
}


