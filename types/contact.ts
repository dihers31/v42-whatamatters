// types/contact.ts
export interface ContactFormData {
  // Form fields
  fullName: string
  email: string
  company: string
  stage: "exploring" | "ready" | "urgent"
  needs: string[] // Array of service IDs
  message?: string

  // Tracking data
  intent: "analyze_project" | "conversation"
  page_section: string
  cta_label: string
  user_language: "en" | "es"

  // Hidden fields
  website?: string // Honeypot

  // Auto-captured
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  user_agent?: string
  country?: string
}

export interface SheetPayload {
  name: string
  email: string
  company: string
  intent: string
  stage: string
  needs: string // Comma-separated
  message: string
  page_section: string
  cta_label: string
  utm_source: string
  utm_medium: string
  utm_campaign: string
  user_agent: string
  country: string
}
