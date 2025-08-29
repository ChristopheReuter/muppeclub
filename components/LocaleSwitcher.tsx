"use client";

import { useEffect, useState, useTransition } from "react";

export default function LocaleSwitcher() {
  const [isPending, start] = useTransition();
  const [selected, setSelected] = useState<string>("en");
  useEffect(() => {
    const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
    if (match) setSelected(decodeURIComponent(match[1]));
  }, []);
  function setLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    setSelected(locale);
    start(() => window.location.reload());
  }
  return (
    <div className="flex items-center gap-2 text-sm" role="radiogroup" aria-label="Language">
      {(["en", "fr", "de", "lu"] as const).map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className="rounded border border-black/10 px-2 py-1 hover:bg-black/5 disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D]"
          disabled={isPending}
          role="radio"
          aria-checked={selected === l}
          aria-label={`Set language to ${l.toUpperCase()}`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}


