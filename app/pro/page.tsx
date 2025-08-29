import Link from "next/link";

export default async function ProDashboardPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-2xl font-bold text-[#00A89D]">Pro dashboard</h1>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-md border border-black/10 bg-white p-4">
          <div className="font-semibold">Next bookings</div>
          <div className="text-sm text-gray-700 mt-1">No bookings yet.</div>
        </div>
        <div className="rounded-md border border-black/10 bg-white p-4">
          <div className="font-semibold">Shortcuts</div>
          <ul className="mt-1 text-sm list-disc list-inside">
            <li><Link className="text-[#00A89D] underline" href="/pro/onboarding">Edit services/documents</Link></li>
            <li><Link className="text-[#00A89D] underline" href="/search">Browse requests</Link></li>
          </ul>
        </div>
      </div>
    </main>
  );
}


