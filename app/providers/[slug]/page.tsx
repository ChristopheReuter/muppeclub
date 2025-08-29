import { prisma } from "@/app/lib/prisma";
import { notFound } from "next/navigation";

function toSlug(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

export default async function ProviderProfilePage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const pro = await prisma.proProfile.findFirst({
    where: { user: { name: { not: null } } },
    include: { user: true, listings: true, services: true },
  });
  if (!pro || toSlug(pro.user.name || pro.user.email || "") !== slug) return notFound();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#00A89D]">{pro.user.name || pro.user.email}</h1>
          <p className="text-gray-700 mt-1">{pro.bio || "No bio yet."}</p>
          <div className="mt-2 text-sm text-gray-600">Rating {pro.rating.toFixed(1)} ({pro.reviewCount})</div>
          <div className="mt-2 text-xs text-gray-600">
            Badges: {pro.licenseUrl || pro.insuranceUrl ? (
              <span className="inline-flex items-center rounded bg-emerald-100 text-emerald-700 px-2 py-0.5">Verified</span>
            ) : (
              <span className="inline-flex items-center rounded bg-gray-100 text-gray-700 px-2 py-0.5">Unverified</span>
            )}
          </div>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold">Listings</h2>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pro.listings.map((l) => (
            <div key={l.id} className="rounded-md border border-black/10 bg-white p-4">
              <div className="font-semibold">{l.title}</div>
              <div className="text-sm text-gray-700 mt-1">{l.description}</div>
              <div className="mt-2 text-sm">${(l.basePriceCents / 100).toFixed(2)} · {l.durationMin} min</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


