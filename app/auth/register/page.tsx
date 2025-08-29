"use client";

import { useState } from "react";
import Link from "next/link";

type RegisterOk = { ok: true; message: string };
type RegisterErr = { ok: false; error: string };
type RegisterResponse = RegisterOk | RegisterErr;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<RegisterResponse | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password }),
      });

      const data: RegisterResponse = await res.json();

      if (!res.ok) {
        setNotice({ ok: false, error: `HTTP ${res.status}` });
      } else if (!data.ok) {
        setNotice({ ok: false, error: data.error });
      } else {
        setNotice({ ok: true, message: data.message });
        setEmail("");
        setName("");
        setPassword("");
      }
    } catch {
      setNotice({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4E0B8] px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-xl bg-white p-6 shadow"
      >
        <h1 className="mb-2 text-2xl font-extrabold text-[#00A89D]">
          Create account
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Already have one?{" "}
          <Link className="text-[#00A89D] underline" href="/auth/sign-in">
            Sign in
          </Link>
        </p>

        <label className="mb-2 block text-sm font-medium">Name</label>
        <input
          className="mb-4 w-full rounded border px-3 py-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />

        <label className="mb-2 block text-sm font-medium">Email</label>
        <input
          type="email"
          className="mb-4 w-full rounded border px-3 py-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          required
        />

        <label className="mb-2 block text-sm font-medium">Password</label>
        <input
          type="password"
          className="mb-6 w-full rounded border px-3 py-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-[#00A89D] px-4 py-2 font-medium text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Creating…" : "Register"}
        </button>

        {notice && (
          <div
            className={`mt-4 rounded px-3 py-2 text-sm ${
              notice.ok
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {notice.ok ? notice.message : notice.error}
          </div>
        )}
      </form>
    </div>
  );
}


