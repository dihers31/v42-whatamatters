"use client"

import Script from "next/script"

export function GA4Script() {
  const measurementId = process.env.NEXT_PUBLIC_GA4_ID

  if (!measurementId) {
    console.warn("⚠️ GA4 Measurement ID not configured")
    return null
  }

  return (
    <>
      <Script strategy="afterInteractive" src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            // Note: gtag('config') will be called by initGA() after user consent
            // This script only sets up the foundation (dataLayer and gtag function)
          `,
        }}
      />
    </>
  )
}
