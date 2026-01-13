# API Routes Documentation

## `/api/send` - Email Sending Endpoint

Secure server-side email sending using Resend API.

### Configuration

Add these environment variables to your project:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=leads@whatamatters.com  # Optional, defaults to leads@whatamatters.com
ADMIN_EMAIL=admin@whatamatters.com         # Optional, defaults to admin@whatamatters.com
```

### Usage Example

```typescript
// From your client-side form component
const sendEmail = async (formData) => {
  try {
    const response = await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'New Contact Form Submission',
        html: `
          <h1>New Message</h1>
          <p><strong>Name:</strong> ${formData.name}</p>
          <p><strong>Email:</strong> ${formData.email}</p>
          <p><strong>Message:</strong> ${formData.message}</p>
        `,
        replyTo: formData.email, // Optional: set reply-to address
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send email')
    }

    console.log('Email sent successfully:', result.emailId)
    return result
  } catch (error) {
    console.error('Error sending email:', error)
    throw error
  }
}
```

### Request Body

```typescript
interface EmailRequest {
  subject: string        // Required: Email subject line
  html: string          // Required: Email body in HTML format
  from?: string         // Optional: Sender email (defaults to RESEND_FROM_EMAIL)
  to?: string           // Optional: Recipient email (defaults to ADMIN_EMAIL)
  replyTo?: string      // Optional: Reply-to email address
}
```

### Response

**Success (200)**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "emailId": "abc123..."
}
```

**Error (400/429/500)**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### Features

- ✅ Edge Runtime compatible (Cloudflare Pages)
- ✅ Rate limiting (60-second cooldown per IP)
- ✅ Environment variable configuration
- ✅ CORS support
- ✅ Automatic memory cleanup
- ✅ Secure API key handling (server-side only)

### Rate Limiting

The endpoint implements a 60-second cooldown per IP address:
- First request: Allowed
- Subsequent requests within 60 seconds: Rejected with 429 status
- After 60 seconds: New request allowed

### Security

- API keys never exposed to client
- IP-based rate limiting
- Server-side validation
- CORS headers for API access
- Memory leak prevention with automatic cleanup

---

## `/api/lead` - Lead Submission Endpoint

Complete lead capture system with dual submission to Resend and Google Sheets.

See `app/api/lead/route.ts` for implementation details.
