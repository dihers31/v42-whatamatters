# Whatamatters Landing Page

A premium, conversion-optimized landing page built with Next.js 16, featuring a sophisticated Pre-Form Lead Generation System with dual submission (Email + Google Sheets).

## Features

- 🎨 **Premium Dark Design** - Minimalist black & blue aesthetic
- 🌐 **Bilingual Support** - Complete EN/ES translations
- 📝 **Multi-Step Lead Form** - Smart pre-qualification system
- 📧 **Dual Submission** - Email via Resend + Google Sheets integration
- 📊 **GA4 Analytics** - Complete CTA and conversion tracking
- 🛡️ **Security** - Rate limiting, honeypot spam protection, validation
- ⚡ **Edge Compatible** - Optimized for Cloudflare Pages deployment
- 🎭 **Smooth Animations** - Framer Motion throughout
- 📱 **Fully Responsive** - Mobile-first design

## Tech Stack

- Next.js 16 (App Router)
- React 19.2
- TypeScript
- Tailwind CSS v4
- Framer Motion
- React Hook Form + Zod
- Resend (Email API)
- Google Apps Script (Sheets integration)
- Google Analytics 4

## Getting Started

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

\`\`\`env
# Resend API Key
# Get yours at: https://resend.com/api-keys
RESEND_API_KEY=re_your_api_key_here

# Admin Email (receives lead notifications)
ADMIN_EMAIL=your-email@whatamatters.com

# Google Sheets Apps Script Web App URL
# Follow setup guide in GOOGLE_APPS_SCRIPT.md
NEXT_PUBLIC_SHEET_WEBAPP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec

# Google Analytics 4 Measurement ID
# Follow setup guide in GA4_SETUP.md
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
\`\`\`

### 3. Set Up Resend

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use the sandbox for testing)
3. Create an API key
4. Add the key to your `.env.local` file

### 4. Set Up Google Sheets Integration

Follow the comprehensive guide in **[GOOGLE_APPS_SCRIPT.md](./GOOGLE_APPS_SCRIPT.md)**

**Quick Overview:**

1. Create a new Google Sheet named "Whatamatters Leads"
2. Add column headers in Row 1 (see guide for exact columns)
3. Open Apps Script: Extensions → Apps Script
4. Paste the provided script code
5. Deploy as Web App with "Anyone" access
6. Copy the Web App URL to your `.env.local` file

**Why Apps Script?**
- ✅ Cloudflare Edge compatible (simple HTTP POST)
- ✅ No OAuth complexity
- ✅ No API quotas or billing
- ✅ Simple webhook URL deployment
- ✅ Automatic authentication handling

### 5. Set Up Google Analytics 4 (Optional but Recommended)

Follow the comprehensive guide in **[GA4_SETUP.md](./GA4_SETUP.md)**

**Quick Overview:**

1. Create a GA4 property at [analytics.google.com](https://analytics.google.com)
2. Create a Web Data Stream
3. Copy your Measurement ID (format: `G-XXXXXXXXXX`)
4. Add it to your `.env.local` file
5. Deploy and verify tracking in GA4 DebugView

**What Gets Tracked:**
- Page views and navigation
- CTA button clicks with source attribution
- Form opens, submissions, successes, and errors
- UTM campaign parameters
- Conversion events for Google Ads

### 6. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your landing page.

## Deployment to Cloudflare Pages

### Prerequisites

- GitHub repository with your code
- Cloudflare account

### Steps

1. **Push to GitHub**
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/your-repo.git
   git push -u origin main
   \`\`\`

2. **Connect to Cloudflare Pages**
   - Go to Cloudflare Dashboard > Pages
   - Click "Create a project"
   - Connect your GitHub account
   - Select your repository

3. **Configure Build Settings**
   - Framework preset: `Next.js`
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Node version: `22`

4. **Add Environment Variables**
   Go to your project settings > Environment Variables and add:
   - `RESEND_API_KEY`
   - `ADMIN_EMAIL`
   - `NEXT_PUBLIC_SHEET_WEBAPP_URL`
   - `NEXT_PUBLIC_GA4_ID`

   ⚠️ **Important**: For the `NEXT_PUBLIC_SHEET_WEBAPP_URL`, you need to properly escape the JSON:
   - Make sure the entire JSON is on one line
   - The private key section should maintain its `\n` line breaks
   - You can use a JSON minifier tool if needed

5. **Deploy**
   - Click "Save and Deploy"
   - Wait for the build to complete
   - Your site will be live at `your-project.pages.dev`

### Custom Domain (Optional)

1. Go to your Cloudflare Pages project
2. Navigate to "Custom domains"
3. Click "Set up a custom domain"
4. Follow the DNS configuration steps

## API Endpoints

### POST `/api/lead`

Submit a new lead form.

**Request Body:**
\`\`\`json
{
  "fullName": "John Doe",
  "email": "john@company.com",
  "company": "Company Inc.",
  "stage": "MVP Ready",
  "needs": ["Web Design & Development", "AI Strategy & Integration"],
  "message": "We need help with...",
  "formType": "analyze",
  "website": "",
  "page_section": "hero",
  "cta_label": "Analyze My Project - Hero",
  "utm_source": "facebook",
  "utm_medium": "social",
  "utm_campaign": "spring_2025"
}
\`\`\`

**Response (Success):**
\`\`\`json
{
  "success": true,
  "message": "Lead submitted successfully",
  "details": {
    "email": true,
    "sheets": true
  }
}
\`\`\`

**Features:**
- Dual submission to Email (Resend) and Google Sheets (Apps Script)
- Automatic tracking data capture (UTM params, user agent, country)
- GA4 event tracking for conversions
- Rate limiting (3 requests/minute per IP)
- Honeypot spam protection
- Comprehensive validation

## Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   └── lead/
│   │       └── route.ts          # Lead submission API
│   ├── layout.tsx                 # Root layout with PreFormProvider
│   ├── page.tsx                   # Main landing page
│   └── globals.css                # Global styles
├── components/
│   ├── pre-form-context.tsx       # Form state management
│   ├── pre-form-modal.tsx         # Multi-step form modal
│   └── ui/                        # shadcn/ui components
├── public/                        # Static assets
└── .env.local                     # Environment variables (not in git)
\`\`\`

## Form Features

### Multi-Step Flow

1. **Step 1: Introduction** - Name, Email, Company
2. **Step 2: Project Details** - Stage selection, Needs checkboxes
3. **Step 3: Your Vision** - Message textarea, Summary review

### Validation

- Name: Minimum 2 characters
- Email: Valid email format
- Company: Required
- Stage: Must select one option
- Needs: At least one checkbox selected
- Honeypot: Hidden field for spam detection

### Bilingual Support

Toggle between English and Spanish in the PreFormContext:
\`\`\`tsx
const { language, setLanguage } = usePreForm()
setLanguage('es') // Switch to Spanish
\`\`\`

### Progress Indicator

Dynamic progress bar that updates based on filled fields (0-100%).

### CTA Tracking & Attribution

All CTA buttons automatically track:
- **page_section**: Where the button was clicked (hero, header, footer, etc.)
- **cta_label**: Button text and context
- **utm_params**: Campaign tracking from URL parameters

This data is:
1. Stored in sessionStorage when CTA is clicked
2. Sent to API with form submission
3. Saved in Google Sheets for attribution analysis
4. Tracked in GA4 for conversion funnel analysis

### GA4 Events

The following events are automatically tracked:

- **page_view**: On page load
- **cta_click**: When any CTA button is clicked
- **form_open**: When pre-form modal opens
- **form_submit_attempt**: When user clicks submit
- **form_submit_success**: When submission succeeds (conversion)
- **form_submit_error**: When submission fails
- **conversion**: Google Ads conversion tracking

## Troubleshooting

### Google Sheets Not Working

1. **Check Apps Script Deployment**
   - Go to Apps Script editor
   - Click "Deploy" → "Manage deployments"
   - Verify deployment is active
   - Check "Who has access" is set to "Anyone"

2. **Test the Script Directly**
   - In Apps Script editor, run `testDoPost()` function
   - Check "Execution log" for errors
   - Verify test row appears in your sheet

3. **Check Web App URL**
   - Ensure `NEXT_PUBLIC_SHEET_WEBAPP_URL` ends with `/exec`
   - URL format: `https://script.google.com/macros/s/.../exec`
   - No trailing slashes after `/exec`

4. **Review Column Headers**
   - Verify sheet has exact column headers from setup guide
   - Check spelling and order match the script

5. **Check Apps Script Executions**
   - In Apps Script, click "Executions" in left sidebar
   - Review recent executions for errors
   - Common issues: malformed JSON, missing columns

### Google Analytics Not Tracking

1. **Verify Setup**
   - Check `NEXT_PUBLIC_GA4_ID` is set correctly
   - Measurement ID should start with `G-`
   - Variable must be prefixed with `NEXT_PUBLIC_`

2. **Test in DebugView**
   - Install Google Analytics Debugger Chrome extension
   - Visit your site with extension enabled
   - Go to GA4 → Configure → DebugView
   - Verify events appear in real-time

3. **Check Browser Console**
   - Open DevTools → Console
   - Look for gtag errors or warnings
   - Verify gtag.js script loads successfully

4. **Disable Ad Blockers**
   - Many ad blockers prevent GA4 tracking
   - Temporarily disable for testing
   - Test in incognito mode

5. **Check Network Tab**
   - Open DevTools → Network tab
   - Filter for "collect" or "analytics"
   - Verify requests to google-analytics.com are successful

## Documentation

- **[GOOGLE_APPS_SCRIPT.md](./GOOGLE_APPS_SCRIPT.md)** - Complete Google Sheets integration guide
- **[GA4_SETUP.md](./GA4_SETUP.md)** - Google Analytics 4 setup and configuration
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Cloudflare Pages deployment guide
- **[.env.example](./.env.example)** - Environment variables reference
