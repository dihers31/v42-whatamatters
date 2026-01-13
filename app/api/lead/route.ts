import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import type { SheetPayload } from "@/types/contact"

/**
 * GOOGLE SHEETS SETUP (Apps Script Web App)
 *
 * STEP 1: Create Google Sheet
 * 1. Go to https://sheets.google.com
 * 2. Create new spreadsheet named "Whatamatters Leads"
 * 3. Add these EXACT column headers in row 1:
 *    A1: Timestamp
 *    B1: Name
 *    C1: Email
 *    D1: Company
 *    E1: Intent
 *    F1: Stage
 *    G1: Needs
 *    H1: Message
 *    I1: Source
 *    J1: UTM_Content
 *    K1: Status_Internal
 *    L1: UTM_Source
 *    M1: UTM_Medium
 *    N1: UTM_Campaign
 *    O1: User_Agent
 *    P1: Country
 *
 * STEP 2: Create Apps Script
 * 1. In the Sheet: Extensions → Apps Script
 * 2. Delete default code and paste the code from DEPLOYMENT.md
 *
 * STEP 3: Deploy as Web App
 * 1. Click "Deploy" → "New deployment"
 * 2. Type: Web app
 * 3. Description: "Whatamatters Contact Form"
 * 4. Execute as: Me
 * 5. Who has access: Anyone
 * 6. Click "Deploy"
 * 7. Copy the "Web app URL" (looks like: https://script.google.com/macros/s/ABC.../exec)
 * 8. Add to .env.local as NEXT_PUBLIC_SHEET_WEBAPP_URL
 */

export const runtime = "edge"

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY)

// Rate limiting store (in production, use Redis or Upstash)
const rateLimitStore = new Map<string, number>()

// Rate limit configuration
const COOLDOWN = 10000 // 10 seconds (was 60000)

interface ContactRequest {
  fullName: string
  email: string
  company: string
  stage: string
  needs: string[]
  message?: string
  intent: string
  page_section: string
  cta_label: string
  user_language: string
  website?: string // Honeypot
  formType?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now - record > COOLDOWN) {
    rateLimitStore.set(identifier, now)
    return true
  }

  return false
}

async function saveToGoogleSheets(
  data: ContactRequest,
  request: NextRequest,
): Promise<{ success: boolean; error?: string }> {
  const WEBAPP_URL = process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL

  if (!WEBAPP_URL) {
    console.error("[v0] Missing NEXT_PUBLIC_SHEET_WEBAPP_URL")
    return { success: false, error: "Missing Google Sheets Web App URL" }
  }

  try {
    const payload: SheetPayload = {
      name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      company: data.company.trim(),
      intent: data.intent,
      stage: data.stage,
      needs: data.needs.join(", "),
      message: data.message?.trim() || "",
      page_section: data.page_section,
      cta_label: data.cta_label,
      utm_source: data.utm_source || "",
      utm_medium: data.utm_medium || "",
      utm_campaign: data.utm_campaign || "",
      user_agent: request.headers.get("user-agent") || "",
      country: request.headers.get("cf-ipcountry") || "",
    }

    const response = await fetch(WEBAPP_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Google Sheets API error: ${response.status} - ${errorText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || "Unknown error from Google Sheets")
    }

    console.log("[v0] Google Sheets save successful")
    return { success: true }
  } catch (error) {
    console.error("[v0] Google Sheets error:", error)
    return { success: false, error: String(error) }
  }
}

// Send email via Resend
async function sendEmail(data: ContactRequest) {
  try {
    const { data: emailData, error } = await resend.emails.send({
      from: "Whatamatters <leads@whatamatters.com>",
      to: process.env.ADMIN_EMAIL || "admin@whatamatters.com",
      subject: `New Lead: ${data.intent === "analyze_project" ? "Project Analysis" : "Conversation Request"} - ${data.company}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0066FF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f4f4f4; padding: 20px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: bold; color: #0066FF; }
              .value { margin-top: 5px; }
              .tracking { background: #fff; padding: 15px; border-left: 4px solid #0066FF; margin-top: 20px; }
              .footer { background: #111; color: #888; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🎯 New Lead Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Intent:</div>
                  <div class="value">${data.intent === "analyze_project" ? "Project Analysis Request" : "Conversation Request"}</div>
                </div>
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${data.fullName}</div>
                </div>
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${data.email}">${data.email}</a></div>
                </div>
                <div class="field">
                  <div class="label">Company:</div>
                  <div class="value">${data.company}</div>
                </div>
                <div class="field">
                  <div class="label">Stage:</div>
                  <div class="value">${data.stage}</div>
                </div>
                <div class="field">
                  <div class="label">Needs:</div>
                  <div class="value">${data.needs.join(", ")}</div>
                </div>
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${data.message || "No message provided"}</div>
                </div>
                
                <div class="tracking">
                  <div class="label">📊 Tracking Data</div>
                  <div class="value">
                    <p><strong>Source:</strong> ${data.page_section || "unknown"}</p>
                    <p><strong>CTA:</strong> ${data.cta_label || "direct"}</p>
                    <p><strong>Language:</strong> ${data.user_language || "unknown"}</p>
                    ${data.utm_source ? `<p><strong>UTM Source:</strong> ${data.utm_source}</p>` : ""}
                    ${data.utm_medium ? `<p><strong>UTM Medium:</strong> ${data.utm_medium}</p>` : ""}
                    ${data.utm_campaign ? `<p><strong>UTM Campaign:</strong> ${data.utm_campaign}</p>` : ""}
                    ${data.country ? `<p><strong>Country:</strong> ${data.country}</p>` : ""}
                  </div>
                </div>
              </div>
              <div class="footer">
                <p>Received at: ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      throw error
    }

    return { success: true, emailId: emailData?.id }
  } catch (error) {
    console.error("[v0] Email send error:", error)
    return { success: false, error: String(error) }
  }
}

// Main POST handler
export async function POST(request: NextRequest) {
  try {
    // Get identifier for rate limiting (IP or unique header)
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown"

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before sending another email." },
        { status: 429 },
      )
    }

    // Parse request body
    const body = await request.json()

    // Honeypot check - if website field is filled, it's likely a bot
    if (body.website) {
      console.log("[v0] Honeypot triggered, rejecting submission")
      // Return success to avoid bot detection
      return NextResponse.json({ success: true, message: "Lead submitted successfully" })
    }

    const data: ContactRequest = {
      fullName: body.fullName,
      email: body.email,
      company: body.company,
      intent: body.formType === "analyze" ? "analyze_project" : "conversation",
      stage: body.stage,
      needs: body.needs || [],
      message: body.message,
      website: body.website,
      user_language: body.user_language || "en",

      // Tracking data
      page_section: body.page_section || "unknown",
      cta_label: body.cta_label || "direct",
      utm_source: body.utm_source,
      utm_medium: body.utm_medium,
      utm_campaign: body.utm_campaign,
    }

    // Validate required fields
    if (
      !data.fullName ||
      !data.email ||
      !data.company ||
      !data.intent ||
      !data.stage ||
      !data.needs ||
      data.needs.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Validate name length
    if (data.fullName.length < 2) {
      return NextResponse.json({ error: "Name must be at least 2 characters" }, { status: 400 })
    }

    console.log("[v0] Processing lead submission for:", data.email)

    // Dual submission: Email + Google Sheets
    const [emailResult, sheetsResult] = await Promise.allSettled([sendEmail(data), saveToGoogleSheets(data, request)])

    // Check results
    const emailSuccess = emailResult.status === "fulfilled" && emailResult.value.success
    const sheetsSuccess = sheetsResult.status === "fulfilled" && sheetsResult.value.success

    console.log("[v0] Email result:", emailSuccess)
    console.log("[v0] Sheets result:", sheetsSuccess)

    // If at least one method succeeded, consider it a success
    if (emailSuccess || sheetsSuccess) {
      return NextResponse.json({
        success: true,
        message: "Lead submitted successfully",
        details: {
          email: emailSuccess,
          sheets: sheetsSuccess,
        },
      })
    }

    // Both failed
    throw new Error("Both email and sheets submission failed")
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Failed to process submission. Please try again." }, { status: 500 })
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
