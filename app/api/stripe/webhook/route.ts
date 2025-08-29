import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ ok: true });
  }

  const stripe = (await import("stripe")).default;
  const client = new stripe(secret, { apiVersion: "2024-11-20.acacia" as any });
  const sig = (await headers()).get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const rawBody = await req.text();
  let event: any;
  try {
    event = client.webhooks.constructEvent(rawBody, sig as string, whSecret as string);
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const id = session.id as string;
    await prisma.payment.updateMany({ where: { providerSessionId: id }, data: { status: "paid" } });
  }

  return NextResponse.json({ received: true });
}

export const config = { api: { bodyParser: false } } as any;


