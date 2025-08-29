import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import Image from "next/image";
import Link from "next/link";

export default async function OwnerHomePage() {
  const user = await getCurrentUser();
  if (!user?.email) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-gray-700">Please <Link className="text-[#00A89D] underline" href="/auth/sign-in">sign in</Link>.</p>
      </main>
    );
  }
  const u = await prisma.user.findUnique({ where: { email: user.email } });
  if (!u) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">Not found</main>
    );
  }
  const profile = await prisma.ownerProfile.findUnique({ where: { userId: u.id }, include: { dogs: true } });
  if (!profile) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-gray-700">No profile found. <Link className="text-[#00A89D] underline" href="/owner/onboarding">Create your owner profile</Link>.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#00A89D]">Your dogs</h1>
        <Link href="/owner/onboarding" className="rounded border border-black/10 px-3 py-2 text-sm hover:bg-black/5">Add another</Link>
      </div>
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profile.dogs.length === 0 ? (
          <p className="text-gray-700">You don't have any dogs yet.</p>
        ) : (
          profile.dogs.map((d) => (
            <div key={d.id} className="rounded-md border border-black/10 bg-white p-3">
              {d.photoUrl ? (
                <div className="relative h-40 w-full overflow-hidden rounded">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.photoUrl} alt={d.name} className="h-full w-full object-cover" />
                </div>
              ) : (
                <div className="h-40 w-full rounded bg-black/5" />
              )}
              <div className="mt-2">
                <div className="font-semibold">{d.name}</div>
                {d.breed ? <div className="text-sm text-gray-700">{d.breed}</div> : null}
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}


