# Cloudflare Pages Deployment Guide

Complete step-by-step guide for deploying your Whatamatters landing page to Cloudflare Pages.

## Why Cloudflare Pages?

- ⚡ Lightning-fast global CDN
- 🆓 Generous free tier
- 🔒 Built-in DDoS protection
- 🌍 Automatic SSL certificates
- 📊 Analytics included
- 🚀 Zero-config static exports

## Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Resend account created and domain verified
- [ ] Google Sheets set up and shared with service account
- [ ] All environment variables documented
- [ ] Test form submission locally

## Step-by-Step Deployment

### 1. Prepare Your Repository

\`\`\`bash
# Initialize git if you haven't already
git init

# Create .gitignore
echo "node_modules/
.next/
.env.local
.env
.DS_Store" > .gitignore

# Commit your code
git add .
git commit -m "Initial commit - Whatamatters landing page"

# Add remote and push
git remote add origin https://github.com/your-username/whatamatters-landing.git
git push -u origin main
\`\`\`

### 2. Create Cloudflare Pages Project

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Pages** in the left sidebar
3. Click **Create a project**
4. Click **Connect to Git**
5. Select **GitHub** and authorize Cloudflare
6. Choose your repository: `whatamatters-landing`
7. Click **Begin setup**

### 3. Configure Build Settings

Use these exact settings:

- **Project name**: `whatamatters-landing` (or your preferred name)
- **Production branch**: `main`
- **Framework preset**: `Next.js`
- **Build command**: `npm run build`
- **Build output directory**: `.next`
- **Root directory**: `/` (leave empty)

**Advanced settings:**
- **Node version**: `22` (or higher)
- Click **Add environment variable** to add each variable below

### 4. Add Environment Variables

Click **Add variable** for each of these:

#### Required Variables

1. **RESEND_API_KEY**
   - Value: `re_your_actual_api_key`
   - Get from: https://resend.com/api-keys

2. **ADMIN_EMAIL**
   - Value: `admin@whatamatters.com`
   - This email receives lead notifications

3. **NEXT_PUBLIC_SHEET_WEBAPP_URL**
   - Value: Your Google Apps Script Web App URL
   - Format: `https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec`
   - Get from: Follow instructions in GOOGLE_APPS_SCRIPT.md
   - ⚠️ **Important**: This is a public URL - keep it secure

4. **NEXT_PUBLIC_GA4_ID**
   - Value: Your Google Analytics 4 Measurement ID
   - Format: `G-XXXXXXXXXX`
   - Get from: https://analytics.google.com
   - Follow instructions in GA4_SETUP.md
   - This enables form and CTA tracking

### 5. Deploy

1. Double-check all environment variables are correct
2. Click **Save and Deploy**
3. Wait for the build to complete (usually 2-3 minutes)
4. Your site will be live at: `https://whatamatters-landing.pages.dev`

### 6. Verify Deployment

Test these features:

1. **Page Loads**
   - Visit your deployed URL
   - Check all sections render correctly
   - Verify images load

2. **Language Toggle**
   - Test EN/ES switching
   - Verify all translated content displays correctly

3. **Form Submission**
   - Click "Analyze My Project" or "Start a Conversation"
   - Fill out the multi-step form
   - Submit and verify:
     - Success animation appears
     - Email arrives at your admin email
     - New row appears in Google Sheets with all tracking data
     - GA4 events fire (check DebugView)

4. **CTA Tracking**
   - Click various CTA buttons throughout the page
   - Check GA4 DebugView for `cta_click` events
   - Verify `page_section` and `cta_label` are tracked correctly

5. **Floating Button**
   - Scroll down past 300px
   - Verify "Let's connect" button appears with pulse animation
   - Click it and verify form opens

6. **Google Analytics**
   - Check GA4 Realtime reports
   - Verify page views are tracked
   - Submit a form and check for conversion events

### 7. Set Up Custom Domain (Optional)

1. In your Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `www.whatamatters.com`
4. If your domain is on Cloudflare:
   - DNS records will be added automatically
5. If your domain is elsewhere:
   - Add the CNAME record to your DNS provider:
     - Name: `www`
     - Value: `whatamatters-landing.pages.dev`
6. Wait for DNS propagation (can take up to 48 hours, usually much faster)

### 8. Enable Production Protection

1. Go to **Settings** > **Environment variables**
2. Add these production-only variables if needed
3. Enable **Branch deployments** for preview URLs
4. Set up **Access policies** if you want password protection

## Post-Deployment

### Monitor Performance

1. **Analytics**
   - Check Cloudflare Pages analytics
   - Monitor form submission rates
   - Track bounce rates and page views

2. **Error Tracking**
   - Check build logs for any warnings
   - Monitor API route errors in function logs
   - Set up error notifications

### Continuous Deployment

Every push to `main` branch will automatically deploy:

\`\`\`bash
# Make changes
git add .
git commit -m "Update hero section"
git push origin main

# Cloudflare automatically builds and deploys
\`\`\`

### Preview Deployments

Every pull request gets a preview URL:

1. Create a new branch: `git checkout -b feature/new-section`
2. Make changes and push
3. Create a pull request on GitHub
4. Cloudflare comments with preview URL
5. Test before merging to main

## Troubleshooting

### Build Fails

**Error: Module not found**
\`\`\`bash
# Solution: Check package.json dependencies
npm install
npm run build  # Test locally first
\`\`\`

**Error: Environment variable not found**
- Verify all variables are added in Cloudflare Pages settings
- Check for typos in variable names
- Ensure values don't have extra spaces

### Form Submission Fails

**Email not sending:**
1. Check Resend dashboard for errors
2. Verify `from` email in `app/api/lead/route.ts` matches verified domain
3. Check Resend API key is correct

**Google Sheets not saving:**
1. Verify Apps Script Web App is deployed correctly (see GOOGLE_APPS_SCRIPT.md)
2. Check that Web App URL is correct in environment variables
3. Test the Web App by running `testDoPost()` function in Apps Script
4. Check Apps Script executions log for errors
5. Ensure "Who has access" is set to "Anyone" in Web App deployment settings

**GA4 not tracking:**
1. Verify `NEXT_PUBLIC_GA4_ID` is set correctly
2. Check browser console for gtag errors
3. Use GA4 DebugView for real-time event verification
4. Disable ad blockers during testing

## Advanced Configuration

### Custom Redirects

Create a `_redirects` file in the `public` folder:

\`\`\`
/old-page /new-page 301
/blog/* /articles/:splat 301
\`\`\`

### Custom Headers

Create a `_headers` file in the `public` folder:

\`\`\`
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
\`\`\`

### Edge Functions Configuration

For advanced rate limiting or geo-blocking, use Cloudflare Workers:

1. Go to **Workers & Pages** > **Overview**
2. Create a new Worker
3. Add custom logic for your needs

## Rollback Procedure

If deployment has issues:

1. Go to **Deployments** tab
2. Find the last working deployment
3. Click **︙** (three dots)
4. Select **Rollback to this deployment**
5. Confirm rollback

## Support Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Resend Documentation](https://resend.com/docs)
- [Google Sheets API](https://developers.google.com/sheets/api)

## Security Checklist

- [ ] All API keys stored as environment variables (not in code)
- [ ] `.env.local` added to `.gitignore`
- [ ] Rate limiting enabled in API routes
- [ ] Honeypot field implemented in forms
- [ ] CORS properly configured (if needed)
- [ ] Service account has minimal required permissions
- [ ] Custom domain has SSL certificate (automatic with Cloudflare)

---

**Deployment Complete!** 🎉

Your Whatamatters landing page is now live and ready to capture high-quality leads.
