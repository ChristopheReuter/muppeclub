"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import AuthMenu from "@/components/AuthMenu";
import LocaleSwitcher from "@/components/LocaleSwitcher";

export default function Header() {
  const [pulse, setPulse] = useState(true);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D] focus-visible:ring-offset-2 focus-visible:ring-offset-white" aria-label="MuppeClub home">
          <span className="inline-flex items-center rounded-full bg-[#F4E0B8] px-3 py-1 ring-1 ring-black/5 shadow-sm group-hover:shadow">
            <Image
              src="/muppeclub-logo.svg"
              alt="MuppeClub"
              width={140}
              height={36}
              priority
            />
          </span>
        </Link>

        <nav className="flex items-center gap-2" aria-label="Primary">
          <Link
            href="/pro"
            onMouseEnter={() => setPulse(false)}
            className={[
              "relative rounded-full px-4 py-2 text-sm font-medium text-white",
              "bg-[#00A89D] hover:brightness-110 active:scale-95 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00A89D]",
              pulse ? "animate-pulse" : "",
            ].join(" ")}
            aria-label="Professionals portal"
            title="Professionals"
          >
            Professionals
          </Link>

          <LocaleSwitcher />
          <AuthMenu />
        </nav>
      </div>
    </header>
  );
}


