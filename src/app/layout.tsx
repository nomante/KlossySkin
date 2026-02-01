import type { Metadata } from "next";
import { Geist, Geist_Mono, Bodoni_Moda, Outfit } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { SessionProvider } from "@/components/SessionProvider";
import { FooterWrapper } from "@/components/FooterWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bodoniModa = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KlossySkin - Premium Skincare",
  description: "Discover premium skincare products for your beauty routine",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bodoniModa.variable} ${outfit.variable} antialiased bg-[#f4fbf9] text-[#0b3b32] min-h-screen flex flex-col`}
      >
        <SessionProvider>
          <CartProvider>
            <HeaderWrapper />
            <main className="flex-1">{children}</main>
            <FooterWrapper />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
