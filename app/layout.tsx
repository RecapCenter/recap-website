import type { Metadata, Viewport } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import "./globals.css";

const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;
  if (!raw) return DEFAULT_SITE_URL;
  try {
    return new URL(raw).toString();
  } catch {
    console.warn(
      `NEXT_PUBLIC_SITE_URL is not a valid URL — falling back to ${DEFAULT_SITE_URL}`,
    );
    return DEFAULT_SITE_URL;
  }
}

const siteUrl = resolveSiteUrl();

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Recap — Counselling & Psychological Services",
    template: "%s",
  },
  description:
    "Recap offers counselling, special education, and training services in a calm, supportive space.",
  openGraph: {
    title: "Recap — Counselling & Psychological Services",
    description:
      "Recap offers counselling, special education, and training services in a calm, supportive space.",
    url: siteUrl,
    siteName: "Recap",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recap — Counselling & Psychological Services",
    description:
      "Recap offers counselling, special education, and training services in a calm, supportive space.",
    images: ["/og-image.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#fdf8f0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${caveat.variable} ${playfair.variable} antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
