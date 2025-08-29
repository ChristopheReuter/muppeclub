"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type DogInput = {
  name: string;
  breed?: string;
  birthDate?: string;
  weightKg?: string;
  photoUrl?: string;
  notes?: string;
};

export default function OwnerOnboardingPage() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [dog, setDog] = useState<DogInput>({ name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function saveProfile() {
    await fetch("/api/owner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, lat: lat ? Number(lat) : undefined, lng: lng ? Number(lng) : undefined }),
    });
  }

  async function addDog() {
    if (!dog.name) throw new Error("Dog name is required");
    await fetch("/api/dogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: dog.name,
        breed: dog.breed,
        birthDate: dog.birthDate,
        weightKg: dog.weightKg ? Number(dog.weightKg) : undefined,
        photoUrl: dog.photoUrl,
        notes: dog.notes,
      }),
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await saveProfile();
      await addDog();
      setSuccess("Saved! Redirecting...");
      setTimeout(() => router.push("/owner"), 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Owner onboarding</h1>
      <p className="mt-1 text-sm text-gray-700">Tell us about you and your dog.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-6">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Your profile</h2>
          <input
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            />
            <input
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Your dog</h2>
          <input
            placeholder="Name"
            value={dog.name}
            onChange={(e) => setDog({ ...dog, name: e.target.value })}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Breed (optional)"
              value={dog.breed || ""}
              onChange={(e) => setDog({ ...dog, breed: e.target.value })}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            />
            <input
              type="date"
              placeholder="Birth date"
              value={dog.birthDate || ""}
              onChange={(e) => setDog({ ...dog, birthDate: e.target.value })}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              step="0.1"
              placeholder="Weight (kg)"
              value={dog.weightKg || ""}
              onChange={(e) => setDog({ ...dog, weightKg: e.target.value })}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            />
            <input
              type="url"
              placeholder="Photo URL"
              value={dog.photoUrl || ""}
              onChange={(e) => setDog({ ...dog, photoUrl: e.target.value })}
              className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
            />
          </div>
          <textarea
            placeholder="Notes"
            value={dog.notes || ""}
            onChange={(e) => setDog({ ...dog, notes: e.target.value })}
            className="w-full rounded-md border border-black/10 bg-white px-3 py-2 outline-none focus:ring-2 focus:ring-[#00A89D]"
          />
        </section>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">{success}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="rounded bg-[#00A89D] px-4 py-2 font-semibold text-white hover:brightness-110 disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save and continue"}
        </button>
      </form>
    </main>
  );
}


