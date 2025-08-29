"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Stop = { id: string; name: string; lat: number; lng: number };

export default function ProRoutesPage() {
  const [stops, setStops] = useState<Stop[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const apiRef = useRef<{ panTo: (lat: number, lng: number) => void; addMarker: (lat: number, lng: number) => void; clear: () => void } | null>(null);

  useEffect(() => {
    // Fake today's bookings clustered around Berlin
    const baseLat = 52.52;
    const baseLng = 13.405;
    const list: Stop[] = Array.from({ length: 6 }).map((_, i) => ({
      id: `stop-${i + 1}`,
      name: `Booking #${i + 1}`,
      lat: baseLat + (Math.random() * 0.06 - 0.03),
      lng: baseLng + (Math.random() * 0.06 - 0.03),
    }));
    setStops(list);
  }, []);

  function toggle(id: string) {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  function renderRoute() {
    const api = apiRef.current;
    if (!api) return;
    api.clear();
    const chosen = stops.filter((s) => selected.includes(s.id));
    if (chosen.length === 0) return;
    // For now: just add markers and pan to first; polyline is TODO with Directions API
    chosen.forEach((s) => api.addMarker(s.lat, s.lng));
    api.panTo(chosen[0].lat, chosen[0].lng);
  }

  useEffect(() => { renderRoute(); }, [selected]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Today's routes</h1>
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          {stops.map((s) => (
            <label key={s.id} className="flex items-center gap-2 rounded border border-black/10 bg-white px-3 py-2">
              <input type="checkbox" checked={selected.includes(s.id)} onChange={() => toggle(s.id)} />
              <span className="text-sm">{s.name}</span>
            </label>
          ))}
        </div>
        <div className="h-[600px]">
          <MapView onReady={(api) => { apiRef.current = api; }} />
        </div>
      </div>
    </main>
  );
}


