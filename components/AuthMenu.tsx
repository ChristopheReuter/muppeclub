"use client";

import { useEffect, useRef, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

function initials(name?: string | null, email?: string | null) {
  if (name && name.trim().length > 0) {
    return name
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }
  return email ? email[0]?.toUpperCase() : "U";
}

export default function AuthMenu() {
  const { data } = useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const firstItemRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [open]);

  useEffect(() => {
    if (open) {
      // focus first interactive item for keyboard users
      const t = window.setTimeout(() => firstItemRef.current?.focus(), 0);
      return () => window.clearTimeout(t);
    }
  }, [open]);

  if (!user) {
    return (
      <Link
        href="/auth/sign-in"
        className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-black/5 active:scale-95 transition"
      >
        Sign in / Register
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00A89D] text-white text-sm font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#00A89D]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="auth-menu"
        aria-label="User menu"
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {initials(user.name ?? null, user.email ?? null)}
      </button>
      {open ? (
        <div id="auth-menu" role="menu" aria-label="User menu" className="absolute right-0 mt-2 w-40 rounded-md border border-black/10 bg-white shadow-lg p-1">
          <div className="px-3 py-2 text-sm text-gray-700 truncate" role="none">{user.email}</div>
          <button
            ref={firstItemRef}
            onClick={() => signOut({ callbackUrl: "/" })}
            role="menuitem"
            className="w-full text-left px-3 py-2 text-sm rounded hover:bg-black/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00A89D]"
            onKeyDown={(e) => {
              if (e.key === "Escape") setOpen(false);
            }}
          >
            Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}


