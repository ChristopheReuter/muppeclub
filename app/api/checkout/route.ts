import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // Resolve listings by id (expected format: listing:<id> or plain id)
    const listingIds: string[] = items
      .map((it: any) => (typeof it?.id === "string" ? it.id : ""))
      .map((id: string) => (id.startsWith("listing:") ? id.slice("listing:".length) : id))
      .filter(Boolean);

    const listings = await prisma.listing.findMany({ where: { id: { in: listingIds } } });
    const lineItems = listings.map((l) => ({
      id: l.id,
      name: l.title,
      priceCents: l.basePriceCents,
      qty: 1,
    }));
    const amountCents = lineItems.reduce((s, li) => s + li.priceCents * li.qty, 0);

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      // Mock flow: create Payment and return a mock URL to thanks
      const payment = await prisma.payment.create({
        data: {
          provider: "STRIPE",
          providerSessionId: `mock_${Date.now()}`,
          amountCents,
          status: "paid",
        },
      });
      return NextResponse.json({ url: "/thanks?mock=1" });
    }

    const stripe = (await import("stripe")).default;
    const client = new stripe(secret, { apiVersion: "2024-11-20.acacia" as any });
    const session = await client.checkout.sessions.create({
      mode: "payment",
      currency: "eur",
      line_items: listings.map((l) => ({
        price_data: {
          currency: "eur",
          product_data: { name: l.title, description: l.description },
          unit_amount: l.basePriceCents,
        },
        quantity: 1,
      })),
      success_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/checkout` ,
    });

    await prisma.payment.create({
      data: {
        provider: "STRIPE",
        providerSessionId: session.id,
        amountCents,
        status: "pending",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}


