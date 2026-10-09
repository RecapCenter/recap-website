import type { Metadata, Viewport } from "next";
import { Inter, Caveat, Playfair_Display } from "next/font/google";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { JsonLd } from "@/components/seo/json-ld";
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
  // No title/description in openGraph or twitter: set here, every page
  // would inherit them and share with the homepage's title. Left out, each
  // page's own title and description are used for its share card.
  openGraph: {
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
        <a
          href="#main-content"
          className="bg-ink text-cream sr-only z-[60] rounded-full px-5 py-3 text-base focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "Recap",
                alternateName:
                  "Realm of Counselling and Psychological Services",
                url: SITE_URL,
                logo: `${SITE_URL}/icon-512.png`,
                email: "hello@recapcenter.com",
                sameAs: [
                  "https://www.instagram.com/recap_center",
                  "https://www.linkedin.com/company/recapcenter/",
                ],
              },
              {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "Recap",
                url: SITE_URL,
                publisher: { "@id": `${SITE_URL}/#organization` },
              },
            ],
          }}
        />
        <Navbar />
        {/* Target of the skip link; focusable so keyboard focus lands here. */}
        <div id="main-content" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <Footer />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
