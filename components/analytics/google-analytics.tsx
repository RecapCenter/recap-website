import Script from "next/script";

/**
 * Google Analytics 4. Renders nothing until NEXT_PUBLIC_GA_ID (the "G-…"
 * Measurement ID from GA → Admin → Data streams) is set, so preview and
 * local builds don't send data. Loads after the page is interactive, so it
 * never delays first paint. Page views on client-side navigation are
 * tracked by GA4's enhanced measurement ("page changes based on browser
 * history events"), which is on by default for new data streams.
 *
 * The page_location sent to Google has any `email` query parameter
 * removed: newsletter emails link to /unsubscribe?email=…, and GA's terms
 * (and our privacy policy) forbid sending personal data to it. The
 * unsubscribe form also strips it from the address bar once read.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id || !/^G-[A-Z0-9]+$/.test(id)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
var pageUrl = new URL(window.location.href);
pageUrl.searchParams.delete('email');
gtag('config', '${id}', { page_location: pageUrl.toString() });`}
      </Script>
    </>
  );
}
