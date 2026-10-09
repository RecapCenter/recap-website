import type { Metadata, Viewport } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

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
  metadataBase: new URL(SITE_URL),
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
    // No `url` here: it would be inherited by every page and claim the
    // homepage address. Each page's canonical link (alternates.canonical)
    // is what crawlers use for og:url when it's absent.
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
        <GoogleAnalytics />
      </body>
    </html>
  );
}
