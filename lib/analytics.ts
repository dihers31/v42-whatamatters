// Event Types (SOP 2 Compliant)
export type CTALabel =
  | "nav_start_conversation"
  | "hero_analyze_project"
  | "final_analyze_project"
  | "footer_chat"
  | "footer_with_us"
  | "service_explore_web-design"
  | "service_explore_web-dev"
  | "service_explore_ai-strategy"
  | "service_explore_seo"
  | "service_explore_ecommerce"
  | "work_view_all"
  | "floating_connect"

export type Intent = "analyze_project" | "conversation"

export type PageSection =
  | "navbar"
  | "hero"
  | "services"
  | "work"
  | "about"
  | "thinking"
  | "careers"
  | "footer"
  | "final_cta"
  | "floating"

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

// Initialize GA4
export const initGA = () => {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID

  if (!measurementId) {
    console.warn("⚠️ GA4 Measurement ID not configured")
    return
  }

  // Check consent status
  if (typeof window !== "undefined") {
    const consent = localStorage.getItem("ga-consent")
    if (consent !== "accepted") {
      console.log("⏸️ GA4 initialization blocked - User has not consented")
      return
    }
  }

  // Check if gtag already exists
  if (typeof window !== "undefined" && window.gtag) {
    console.log("✅ GA4 already initialized")
    return
  }

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || []
  function gtag(...args: any[]) {
    window.dataLayer.push(args)
  }
  window.gtag = gtag

  gtag("js", new Date())
  gtag("config", measurementId, {
    send_page_view: true,
    anonymize_ip: true, // GDPR compliance
  })

  // Enable debug mode in development
  if (process.env.NODE_ENV === "development" || window.location.search.includes("debug_mode=true")) {
    gtag("config", measurementId, { debug_mode: true })
    console.log("🔍 GA4 Debug Mode enabled")
  }

  console.log("✅ GA4 initialized with ID:", measurementId)
}

// EVENT 1: CTA Click (SOP 2)
export const trackCTAClick = (cta_label: CTALabel, page_section: PageSection, user_language: "en" | "es") => {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("⚠️ gtag not initialized")
    return
  }

  const eventData = {
    cta_label,
    page_section,
    user_language,
    timestamp: new Date().toISOString(),
  }

  window.gtag("event", "cta_click", eventData)

  // Debug log
  console.log("📊 GA4 Event: cta_click", eventData)
}

// EVENT 2: Pre-form Submit (SOP 2)
export const trackPreformSubmit = (
  intent: Intent,
  stage: "exploring" | "ready" | "urgent",
  page_section: PageSection,
  user_language: "en" | "es",
  needs_selected: string[],
) => {
  if (typeof window === "undefined" || !window.gtag) {
    console.warn("⚠️ gtag not initialized")
    return
  }

  const eventData = {
    intent,
    stage,
    page_section,
    user_language,
    needs_count: needs_selected.length,
    needs_list: needs_selected.join(","),
    timestamp: new Date().toISOString(),
  }

  window.gtag("event", "preform_submit", eventData)

  // Debug log
  console.log("📊 GA4 Event: preform_submit", eventData)
}

// Utility: Get current page section based on scroll position
export const getPageSection = (): PageSection => {
  if (typeof window === "undefined") return "hero"

  const hash = window.location.hash

  if (hash.includes("#what-we-do")) return "services"
  if (hash.includes("#work")) return "work"
  if (hash.includes("#about")) return "about"
  if (hash.includes("#thinking")) return "thinking"
  if (hash.includes("#contact")) return "footer"

  return "hero"
}

// Utility: Map stage value to label
// ... existing code here ...
