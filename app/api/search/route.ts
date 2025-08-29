import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { initSentry, withSentryRoute, captureMessage } from "@/utils/sentry";
import { initPosthog, trackServerEvent } from "@/utils/posthog";

initSentry();
initPosthog();

export const GET = withSentryRoute(async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const service = searchParams.get("service") || "";
  const location = searchParams.get("location") || "";

  const where: any = {};
  if (service) where.service = service as any;
  if (q) where.OR = [
    { title: { contains: q, mode: "insensitive" } },
    { description: { contains: q, mode: "insensitive" } },
  ];
  if (location) where.location = { contains: location, mode: "insensitive" };

  const listings = await prisma.listing.findMany({
    where,
    include: { pro: { include: { user: true } } },
    orderBy: { title: "asc" },
    take: 60,
  });
  trackServerEvent("search", { hasQuery: Boolean(q), hasService: Boolean(service), hasLocation: Boolean(location) });
  captureMessage("search", { level: "info", tags: { route: "/api/search" } });
  return NextResponse.json({ listings });
}, "/api/search:GET");


