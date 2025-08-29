import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { CartProvider } from "@/components/cart/useCart";
import CartFab from "@/components/CartFab";
import CartDrawer from "@/components/CartDrawer";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import IntlProvider from "@/components/IntlProvider";
import ClientAnalytics from "@/components/ClientAnalytics";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MuppeClub",
  description: "Marketplace for Dog Owners & Professionals",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#F4E0B8] text-gray-900`}>
        <AuthSessionProvider>
          <IntlProvider>
            <CartProvider>
              <Header />
              <CartFab />
              <CartDrawer />
              <main className="min-h-[calc(100vh-64px)]">{children}</main>
              <ClientAnalytics />
            </CartProvider>
          </IntlProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
