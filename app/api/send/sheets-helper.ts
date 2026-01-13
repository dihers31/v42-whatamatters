/**
 * Google Sheets Integration Helper
 * Saves form data to Google Sheets via Apps Script
 */

import type { NextRequest } from "next/server"

type SheetsFormData = {
  fullName: string
  email: string
  company: string
  stage: "exploring" | "ready" | "urgent"
  needs: string[]
  message?: string
  formType: "analyze" | "conversation"
  user_language: "en" | "es"
  page_section?: string
  cta_label?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

export async function saveToGoogleSheets(formData: SheetsFormData, request: NextRequest) {
  const sheetUrl = process.env.SHEET_WEBAPP_URL || process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL

  // Skip if URL not configured (optional integration)
  if (!sheetUrl) {
    console.warn("Google Sheets URL not configured, skipping")
    return { success: false, error: "Not configured" }
  }

  // Validate URL format
  if (!sheetUrl.includes("script.google.com") || !sheetUrl.endsWith("/exec")) {
    console.error("Invalid Google Sheets URL format")
    return { success: false, error: "Invalid URL" }
  }

  const payload = {
    name: formData.fullName.trim(),
    email: formData.email.trim().toLowerCase(),
    company: formData.company.trim(),
    intent: formData.formType === "analyze" ? "analyze_project" : "conversation",
    stage: formData.stage,
    needs: formData.needs.join(", "),
    message: formData.message?.trim() || "",
    page_section: formData.page_section || "unknown",
    cta_label: formData.cta_label || "direct",
    utm_source: formData.utm_source || "",
    utm_medium: formData.utm_medium || "",
    utm_campaign: formData.utm_campaign || "",
    user_agent: request.headers.get("user-agent") || "",
    country: request.headers.get("cf-ipcountry") || "",
  }

  try {
    const response = await fetch(sheetUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Google Sheets save failed:", response.status, errorText)
      return { success: false, error: `HTTP ${response.status}` }
    }

    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error("Google Sheets error:", error)
    return { success: false, error: String(error) }
  }
}
