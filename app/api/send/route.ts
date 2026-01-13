import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { saveToGoogleSheets } from "./sheets-helper"

/**
 * Secure Email API Route
 * Uses Resend to send emails without exposing API keys to the client
 * Edge-compatible for Cloudflare Pages deployment
 */

export const runtime = "edge"

// Rate limiting store (in-memory for Edge runtime)
const rateLimitStore = new Map<string, number>()
const COOLDOWN = 60000 // 60 seconds cooldown

const needIds = ["web-design", "web-dev", "ai-strategy", "seo", "ecommerce", "other"] as const

// Validation schema with Zod
const formSchema = z
  .object({
    fullName: z.string().min(2).max(100),
    email: z.string().email(),
    company: z.string().min(2).max(100),
    stage: z.enum(["exploring", "ready", "urgent"]),
    needs: z.array(z.enum(needIds)).min(1).max(10),
    message: z.string().max(1000).optional(),
    formType: z.enum(["analyze", "conversation"]),
    user_language: z.enum(["en", "es"]).default("en"),
    page_section: z.string().max(100).optional(),
    cta_label: z.string().max(100).optional(),
    utm_source: z.string().max(100).optional(),
    utm_medium: z.string().max(100).optional(),
    utm_campaign: z.string().max(100).optional(),
  })
  .strict()

// HTML escape function to prevent XSS
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function checkRateLimit(identifier: string): boolean {
  const now = Date.now()
  const lastRequest = rateLimitStore.get(identifier)

  if (!lastRequest || now - lastRequest > COOLDOWN) {
    rateLimitStore.set(identifier, now)
    // Cleanup old entries to prevent memory leaks
    if (rateLimitStore.size > 1000) {
      const entries = Array.from(rateLimitStore.entries())
      entries.sort((a, b) => a[1] - b[1])
      entries.slice(0, 500).forEach(([key]) => rateLimitStore.delete(key))
    }
    return true
  }

  return false
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip =
      request.headers.get("cf-connecting-ip") ||
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown"

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before sending another email." },
        { status: 429 },
      )
    }

    // Validate environment variables
    if (!process.env.RESEND_API_KEY) {
      console.error("Resend API key not configured")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    // Parse and validate request body with Zod
    const rawBody = await request.json()
    const validation = formSchema.safeParse(rawBody)

    if (!validation.success) {
      console.error("Validation error:", validation.error.flatten())
      return NextResponse.json(
        {
          error: "Invalid form data",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      )
    }

    const body = validation.data

    const sheetsPromise = saveToGoogleSheets(body, request).catch((error) => {
      console.error("Google Sheets failed (non-critical):", error)
      return { success: false, error }
    })

    // Escape all user inputs to prevent XSS
    const safeName = escapeHtml(body.fullName)
    const safeEmail = escapeHtml(body.email)
    const safeCompany = escapeHtml(body.company)
    const messageRaw = body.message?.trim()
    const safeMessage = messageRaw ? escapeHtml(messageRaw) : ""

    // Build email subject based on form type and language
    const isSpanish = body.user_language === "es"
    const formTypeLabel =
      body.formType === "analyze"
        ? isSpanish
          ? "Analisis de Proyecto"
          : "Project Analysis"
        : isSpanish
          ? "Conversacion"
          : "Conversation"

    const subject = `${formTypeLabel} - ${safeCompany} (${safeName})`

    // Build HTML email content with safe labels
    const stageLabels = {
      exploring: isSpanish ? "Solo explorando" : "Just exploring",
      ready: isSpanish ? "Listo para comenzar" : "Ready to start soon",
      urgent: isSpanish ? "Lo necesito urgente" : "Need it urgently",
    }

    const needsLabels: Record<(typeof needIds)[number], { en: string; es: string }> = {
      "web-design": { en: "Web Design & UX", es: "Diseno Web & UX" },
      "web-dev": { en: "Web Development", es: "Desarrollo Web" },
      "ai-strategy": { en: "AI & Digital Strategy", es: "IA & Estrategia Digital" },
      seo: { en: "SEO & Lead Generation", es: "SEO & Generacion de Leads" },
      ecommerce: { en: "E-commerce Solutions", es: "Soluciones E-commerce" },
      other: { en: "Other", es: "Otro" },
    }

    const needsList = body.needs.map((needId) => needsLabels[needId][body.user_language]).join(", ")

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #0066FF; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; }
            .label { font-weight: bold; color: #0066FF; margin-bottom: 5px; }
            .value { color: #333; }
            .message-box { background: white; padding: 15px; border-left: 4px solid #0066FF; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>${formTypeLabel} - New Lead</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">${isSpanish ? "Nombre Completo:" : "Full Name:"}</div>
                <div class="value">${safeName}</div>
              </div>
              
              <div class="field">
                <div class="label">Email:</div>
                <div class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></div>
              </div>
              
              <div class="field">
                <div class="label">${isSpanish ? "Empresa:" : "Company:"}</div>
                <div class="value">${safeCompany}</div>
              </div>
              
              <div class="field">
                <div class="label">${isSpanish ? "Etapa del Proyecto:" : "Project Stage:"}</div>
                <div class="value">${stageLabels[body.stage]}</div>
              </div>
              
              <div class="field">
                <div class="label">${isSpanish ? "Servicios Necesarios:" : "Services Needed:"}</div>
                <div class="value">${needsList}</div>
              </div>
              
              ${
                safeMessage
                  ? `
              <div class="field">
                <div class="label">${isSpanish ? "Mensaje:" : "Message:"}</div>
                <div class="message-box">${safeMessage}</div>
              </div>
              `
                  : ""
              }
              
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
              
              <div style="font-size: 12px; color: #999;">
                <strong>IP:</strong> ${escapeHtml(ip)}<br>
                <strong>${isSpanish ? "Idioma:" : "Language:"}</strong> ${body.user_language}<br>
                <strong>${isSpanish ? "Tipo de formulario:" : "Form Type:"}</strong> ${body.formType}<br>
                <strong>${isSpanish ? "Fecha:" : "Date:"}</strong> ${new Date().toLocaleString()}
              </div>
            </div>
          </div>
        </body>
      </html>
    `

    const resend = new Resend(process.env.RESEND_API_KEY)

    // Use default values from environment variables
    const fromEmail = `Whatamatters Leads <${process.env.RESEND_FROM_EMAIL || "leads@whatamatters.com"}>`
    const toEmail = process.env.ADMIN_EMAIL || "admin@whatamatters.com"

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject,
      html,
      replyTo: body.email,
    })

    if (error) {
      console.error("Resend API error:", error)
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
    }

    console.log("Email sent successfully:", data?.id)

    const sheetsResult = await sheetsPromise
    if (sheetsResult.success) {
      console.log("Also saved to Google Sheets")
    } else {
      console.warn("Google Sheets save failed (email sent anyway)")
    }

    return NextResponse.json({
      success: true,
      message: "Email sent successfully",
      emailId: data?.id,
      sheetsSaved: Boolean(sheetsResult.success),
    })
  } catch (error) {
    console.error("Email API error:", error)

    // Don't expose internal errors to client
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle OPTIONS for CORS preflight
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
