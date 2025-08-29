import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { initSentry, withSentryRoute, captureMessage } from "@/utils/sentry";
import { initPosthog, trackServerEvent } from "@/utils/posthog";

initSentry();
initPosthog();

async function getOwnerProfileIdByEmail(email: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;
  const profile = await prisma.ownerProfile.findUnique({ where: { userId: user.id } });
  return profile?.id ?? null;
}

export const GET = withSentryRoute(async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ownerProfileId = await getOwnerProfileIdByEmail(session.user.email);
  if (!ownerProfileId) return NextResponse.json({ dogs: [] });
  const dogs = await prisma.dog.findMany({ where: { ownerProfileId } });
  trackServerEvent("dogs_fetch", { count: dogs.length });
  captureMessage("dogs_fetch", { level: "info", tags: { route: "/api/dogs" } });
  return NextResponse.json({ dogs });
}, "/api/dogs:GET");

export const POST = withSentryRoute(async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const ownerProfileId = await getOwnerProfileIdByEmail(session.user.email);
  if (!ownerProfileId) return NextResponse.json({ error: "Create profile first" }, { status: 400 });
  const { name, breed, birthDate, weightKg, photoUrl, notes } = await req.json();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const dog = await prisma.dog.create({
    data: {
      ownerProfileId,
      name,
      breed,
      birthDate: birthDate ? new Date(birthDate) : undefined,
      weightKg,
      photoUrl,
      notes,
    },
  });
  trackServerEvent("dog_create", { hasBreed: Boolean(breed) });
  captureMessage("dog_create", { level: "info", tags: { route: "/api/dogs" } });
  return NextResponse.json({ dog }, { status: 201 });
}, "/api/dogs:POST");


