"use client";

import { useEffect, useMemo, useRef } from "react";

type Props = {
  center?: { lat: number; lng: number };
  zoom?: number;
  onReady?: (api: { panTo: (lat: number, lng: number) => void; addMarker: (lat: number, lng: number) => void; clear: () => void }) => void;
};

export default function MapView({ center = { lat: 52.52, lng: 13.405 }, zoom = 11, onReady }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN;
  const isEnabled = !!token;

  useEffect(() => {
    if (!isEnabled || !ref.current) return;
    let map: any;
    let markers: any[] = [];
    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default as any;
      mapboxgl.accessToken = token;
      map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [center.lng, center.lat],
        zoom,
      });
      const api = {
        panTo: (lat: number, lng: number) => map.flyTo({ center: [lng, lat], essential: true, zoom }),
        addMarker: (lat: number, lng: number) => {
          const mk = new mapboxgl.Marker({ color: "#00A89D" }).setLngLat([lng, lat]).addTo(map);
          markers.push(mk);
        },
        clear: () => { markers.forEach((m) => m.remove()); markers = []; },
      };
      onReady?.(api);
    })();
    return () => {
      try { (map as any)?.remove?.(); } catch {}
    };
  }, [isEnabled, token, center.lat, center.lng, zoom, onReady]);

  if (!isEnabled) {
    return (
      <div className="h-full w-full rounded-md border border-black/10 bg-[linear-gradient(135deg,#f5efe1_0%,#f4e0b8_100%)] text-center grid place-items-center">
        <div>
          <div className="text-sm text-gray-700">Map disabled</div>
          <div className="text-xs text-gray-600">Set NEXT_PUBLIC_MAPBOX_TOKEN to enable</div>
        </div>
      </div>
    );
  }

  return <div ref={ref} className="h-full w-full rounded-md" />;
}


