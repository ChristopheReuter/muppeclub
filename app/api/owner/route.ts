import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { initSentry, withSentryRoute, captureMessage } from "@/utils/sentry";
import { initPosthog, trackServerEvent } from "@/utils/posthog";

initSentry();
initPosthog();

export const GET = withSentryRoute(async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const profile = await prisma.ownerProfile.findUnique({ where: { userId: user.id }, include: { dogs: true } });
  trackServerEvent("owner_fetch", { hasProfile: Boolean(profile) });
  captureMessage("owner_fetch", { level: "info", tags: { route: "/api/owner" } });
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, profile });
}, "/api/owner:GET");

export const POST = withSentryRoute(async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const body = await req.json();
  const { address, lat, lng } = body ?? {};
  const profile = await prisma.ownerProfile.upsert({
    where: { userId: user.id },
    update: { address, lat, lng },
    create: { userId: user.id, address, lat, lng },
  });
  trackServerEvent("owner_update", { hasAddress: Boolean(address) });
  captureMessage("owner_update", { level: "info", tags: { route: "/api/owner" } });
  return NextResponse.json({ profile }, { status: 200 });
}, "/api/owner:POST");


