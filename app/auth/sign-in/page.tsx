"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", { redirect: false, email, password, callbackUrl });
    setLoading(false);
    if (res?.ok) {
      router.push(callbackUrl);
      router.refresh();
    } else {
      setError("Invalid email or password");
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Sign in</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
          />
        </div>
        <div>
          <label className="text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#00A89D] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account? <Link href="/auth/register" className="text-[#00A89D] underline">Register</Link>
      </p>

      <div className="mt-8">
        <div className="relative my-4 text-center">
          <span className="px-2 text-sm text-gray-500 bg-[#F4E0B8] relative z-10">Or continue with</span>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-black/10" />
        </div>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => signIn("google", { callbackUrl })}
            className="flex items-center justify-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.192-5.238C29.211,35.091,26.715,36,24,36 c-5.192,0-9.607-3.317-11.271-7.946l-6.532,5.034C9.502,39.556,16.227,44,24,44z"/>
              <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571 c0.001-0.001,0.002-0.001,0.003-0.002l6.192,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
            </svg>
            Continue with Google
          </button>
          <button
            onClick={() => signIn("apple", { callbackUrl })}
            className="flex items-center justify-center gap-2 rounded border border-black/10 bg-white px-4 py-2 text-sm font-medium hover:bg-black/5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path fill="currentColor" d="M16.365 1.43c0 1.14-.42 2.095-1.254 2.866-.95.875-1.982 1.376-3.09 1.31-.056-1.104.419-2.08 1.298-2.886.46-.433 1.026-.79 1.7-1.07.672-.276 1.296-.42 1.947-.45-.02.077-.026.156-.026.23zM20.68 17.095c-.31.72-.678 1.38-1.102 1.984-.578.83-1.05 1.407-1.418 1.737-.567.52-1.175.786-1.824.8-.467.01-1.03-.132-1.69-.426-.667-.297-1.28-.446-1.84-.446-.576 0-1.207.15-1.893.446-.686.294-1.24.446-1.66.446-.626-.026-1.24-.282-1.845-.772-.394-.325-.883-.914-1.468-1.776-.63-.92-1.15-1.985-1.56-3.197-.43-1.28-.646-2.518-.646-3.714 0-1.37.295-2.56.887-3.567.46-.796 1.073-1.434 1.84-1.91.766-.486 1.594-.74 2.485-.766.487 0 1.125.16 1.916.473.787.314 1.293.474 1.514.474.166 0 .717-.172 1.65-.52.887-.324 1.636-.457 2.247-.387 1.66.134 2.91.783 3.75 1.944-1.49.91-2.236 2.192-2.236 3.844 0 1.525.57 2.8 1.705 3.82.507.46 1.074.78 1.704.965-.137.4-.29.8-.465 1.2z"/>
            </svg>
            Continue with Apple
          </button>
        </div>
      </div>
    </main>
  );
}


