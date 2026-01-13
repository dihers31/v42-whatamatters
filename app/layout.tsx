import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { PreFormProvider } from "@/components/pre-form-context"
import { GA4Script } from "@/components/ga4-script"
import ConsentBanner from "@/components/consent-banner"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
})
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Whatamatters - We Do What Matters: Connection",
  description:
    "We design and build digital experiences that connect ideas, people, and decisions to create real impact. Boutique web agency and studio.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} scroll-smooth`}>
      <body className={`font-sans antialiased`}>
        <GA4Script />
        <PreFormProvider>
          {children}
          <Analytics />
          <ConsentBanner />
        </PreFormProvider>
      </body>
    </html>
  )
}
