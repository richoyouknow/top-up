import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "./context/cart-context";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChampionStore.id - Toko Item 8 Ball Pool Terpercaya & Murah",
  description: "Beli Coins, Cash, Legendary Cue, Cue Pieces, dan item premium 8 Ball Pool dengan harga terbaik, proses cepat, dan 100% aman.",
  keywords: "8 ball pool, top up 8 ball pool, koin 8 ball pool, cash 8 ball pool, legendary cue, cue pieces, championstore.id",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground select-none">
        <CartProvider>
          <div className="flex flex-col min-h-screen relative bg-[#09080e]">
            {children}
          </div>
        </CartProvider>
      </body>
    </html>
  );
}
