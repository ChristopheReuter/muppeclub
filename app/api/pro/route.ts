import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ServiceType } from "@prisma/client";
import { initSentry, withSentryRoute, captureMessage } from "@/utils/sentry";
import { initPosthog, trackServerEvent } from "@/utils/posthog";

initSentry();
initPosthog();

export const GET = withSentryRoute(async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const pro = await prisma.proProfile.findUnique({ where: { userId: user.id }, include: { services: true } });
  trackServerEvent("pro_fetch", { hasPro: Boolean(pro) });
  captureMessage("pro_fetch", { level: "info", tags: { route: "/api/pro" } });
  return NextResponse.json({ pro });
}, "/api/pro:GET");

export const POST = withSentryRoute(async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { services, licenseUrl, insuranceUrl } = await req.json();

  const pro = await prisma.proProfile.upsert({
    where: { userId: user.id },
    update: { licenseUrl, insuranceUrl },
    create: { userId: user.id, licenseUrl, insuranceUrl },
  });

  if (Array.isArray(services)) {
    await prisma.proService.deleteMany({ where: { proId: pro.id } });
    for (const s of services as ServiceType[]) {
      await prisma.proService.create({ data: { proId: pro.id, service: s } });
    }
  }

  const updated = await prisma.proProfile.findUnique({ where: { id: pro.id }, include: { services: true } });
  trackServerEvent("pro_update", { services: Array.isArray(services) ? services.length : 0 });
  captureMessage("pro_update", { level: "info", tags: { route: "/api/pro" } });
  return NextResponse.json({ pro: updated });
}, "/api/pro:POST");


