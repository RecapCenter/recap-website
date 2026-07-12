import type { Metadata } from "next";
import { Inter, Baloo_2, Caveat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const baloo2 = Baloo_2({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const caveat = Caveat({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Recap — Counselling & Psychological Services",
  description:
    "Recap offers counselling, special education, and training services in a calm, supportive space.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${baloo2.variable} ${caveat.variable} ${playfair.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
