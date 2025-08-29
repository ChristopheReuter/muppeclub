import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import "../globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/components/cart/useCart";
import ClientAnalytics from "@/components/ClientAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MuppeClub",
  description: "Marketplace for Dog Owners & Professionals",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let messages;
  try {
    messages = (await import(`../../messages/${locale}.json`)).default;
  } catch {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-[#F4E0B8] text-gray-900`}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <CartProvider>
            <Header />
            <main className="min-h-[calc(100vh-64px)]">{children}</main>
            <ClientAnalytics />
          </CartProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}


