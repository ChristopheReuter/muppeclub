"use client";

import { useEffect, useState } from "react";
import { ServiceType } from "@prisma/client";
import { useRouter } from "next/navigation";

const ALL: ServiceType[] = [
  "DOG_WALKING",
  "DOG_TRAINING",
  "PHYSIOTHERAPY",
  "VET",
  "DAYCARE",
  "DOG_PENSION",
] as unknown as ServiceType[];

export default function ProOnboardingPage() {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<ServiceType[]>([]);
  const [licenseUrl, setLicenseUrl] = useState("");
  const [insuranceUrl, setInsuranceUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/pro");
      if (!res.ok) return;
      const json = await res.json();
      const services: ServiceType[] = (json.pro?.services ?? []).map((s: any) => s.service);
      setSelected(services);
      setLicenseUrl(json.pro?.licenseUrl || "");
      setInsuranceUrl(json.pro?.insuranceUrl || "");
    })();
  }, []);

  function toggle(s: ServiceType) {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  async function saveServices() {
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: selected }),
      });
      setStep(2);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function saveDocs() {
    setLoading(true);
    setError(null);
    try {
      await fetch("/api/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ licenseUrl, insuranceUrl }),
      });
      setStep(3);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Professional onboarding</h1>
      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      {step === 1 ? (
        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">1) Choose offered services</h2>
          <div className="grid grid-cols-2 gap-2">
            {ALL.map((s) => (
              <label key={s} className="flex items-center gap-2 rounded border border-black/10 bg-white px-3 py-2">
                <input type="checkbox" checked={selected.includes(s)} onChange={() => toggle(s)} />
                <span className="text-sm">{s.replace(/_/g, " ")}</span>
              </label>
            ))}
          </div>
          <button onClick={saveServices} disabled={loading} className="rounded bg-[#00A89D] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60">Continue</button>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="mt-6 space-y-4">
          <h2 className="text-lg font-semibold">2) Upload documents</h2>
          <p className="text-sm text-gray-700">Use plain file inputs – we will replace with Cloudinary later.</p>
          <div className="space-y-3">
            <div>
              <label className="text-sm">License (URL placeholder)</label>
              <input value={licenseUrl} onChange={(e) => setLicenseUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]" />
            </div>
            <div>
              <label className="text-sm">Insurance (URL placeholder)</label>
              <input value={insuranceUrl} onChange={(e) => setInsuranceUrl(e.target.value)} placeholder="https://..." className="mt-1 w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setStep(1)} className="rounded border border-black/10 px-4 py-2 text-sm hover:bg-black/5">Back</button>
            <button onClick={saveDocs} disabled={loading} className="rounded bg-[#00A89D] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60">Continue</button>
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="mt-6 space-y-4 text-center">
          <h2 className="text-lg font-semibold">3) Complete</h2>
          <p className="text-gray-700">Your documents were received. Your profile will show Verified badges.</p>
          <button onClick={() => router.push("/pro")} className="rounded bg-[#00A89D] px-4 py-2 font-semibold text-white hover:brightness-110">Go to dashboard</button>
        </section>
      ) : null}
    </main>
  );
}


