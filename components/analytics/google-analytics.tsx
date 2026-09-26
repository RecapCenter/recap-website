import Script from "next/script";

/**
 * Google Analytics 4. Renders nothing until NEXT_PUBLIC_GA_ID (the "G-…"
 * Measurement ID from GA → Admin → Data streams) is set, so preview and
 * local builds don't send data. Loads after the page is interactive, so it
 * never delays first paint. Page views on client-side navigation are
 * tracked by GA4's enhanced measurement ("page changes based on browser
 * history events"), which is on by default for new data streams.
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
gtag('config', '${id}');`}
      </Script>
    </>
  );
}
