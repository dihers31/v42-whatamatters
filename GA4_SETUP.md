# Google Analytics 4 (GA4) Setup for Whatamatters

This document explains how to set up GA4 tracking for the Whatamatters contact form and CTA interactions.

## What Gets Tracked

### 1. Page Views
- Automatic page view tracking on all pages
- Path tracking for navigation analysis

### 2. CTA Clicks
Event: `cta_click`
- **event_category**: engagement
- **event_label**: Button text (e.g., "Analyze My Project - Hero")
- **page_section**: Where the CTA was clicked (hero, header, footer, final_cta)
- **cta_type**: analyze or conversation

### 3. Form Events
**Form Opened** - Event: `form_open`
- **form_type**: analyze_project or conversation
- **page_section**: Where the form was triggered
- **cta_label**: Which CTA button was clicked

**Form Submit Attempt** - Event: `form_submit_attempt`
- **form_type**: analyze_project or conversation
- **page_section**: Original CTA location
- **cta_label**: Original CTA button text
- **utm_source, utm_medium, utm_campaign, utm_content**: Campaign tracking

**Form Submit Success** - Event: `form_submit_success`
- **form_type**: analyze_project or conversation
- **value**: 1 (for conversion tracking)
- All tracking parameters from submit attempt

**Form Submit Error** - Event: `form_submit_error`
- **form_type**: analyze_project or conversation
- **error_message**: Error description

**Conversion** - Event: `conversion`
- **send_to**: Your Google Ads conversion ID (if applicable)
- **value**: 1.0
- **currency**: USD

---

## Step 1: Create GA4 Property

### A. Property Creation Instructions

1. Go to [Google Analytics](https://analytics.google.com)
2. Click **Admin** (gear icon in bottom left)
3. Under **Property**, click **Create Property**
4. Configure property:
   - **Property name**: "Whatamatters Website"
   - **Reporting time zone**: Your timezone
   - **Currency**: USD
   - **Industry category**: Professional Services
   - **Business size**: Small (1-10 employees)
5. Click **Next**
6. Fill in business objectives (optional)
7. Click **Create**
8. Accept Terms of Service

### B. Enhanced Measurement Configuration

After creating the property, configure Enhanced Measurement:

1. Go to **Admin** → **Data Streams**
2. Click on your web stream
3. Scroll down to **Enhanced measurement**
4. Click the gear icon to configure
5. **Toggle ON** (Enable these):
   - Page views
   - Scrolls (90% scroll depth)
   - Outbound clicks
6. **Toggle OFF** (Disable these for cleaner data):
   - Site search
   - Video engagement
   - File downloads
7. Click **Save**

### C. IP Anonymization

IP anonymization is **automatically enabled by default in GA4** (unlike Universal Analytics). No additional configuration is required. GA4 complies with GDPR by design.

---

## Step 2: Create Data Stream

1. In Property settings, click **Data Streams**
2. Click **Add stream** → **Web**
3. Configure stream:
   - **Website URL**: https://whatamatters.com (or your production domain)
   - **Stream name**: "Production Website"
   - **Enhanced measurement**: Keep enabled (configured above)
4. Click **Create stream**
5. **Copy the Measurement ID** (looks like `G-XXXXXXXXXX`)

---

## Step 3: Add Measurement ID to Environment Variables

### For Vercel:
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Key**: `NEXT_PUBLIC_GA4_ID`
   - **Value**: `G-XXXXXXXXXX` (your Measurement ID)
   - **Environments**: Production, Preview, Development
4. Click **Save**
5. Redeploy your application

### For Local Development (.env.local):
\`\`\`env
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
\`\`\`

---

## Step 4: Set Up Custom Events in GA4

1. In GA4, go to **Configure** → **Events**
2. Click **Create event**
3. Create these custom events:

### Event 1: Form Submit Success (Conversion)
- **Event name**: `form_submit_success`
- **Mark as conversion**: ✅ Toggle ON

### Event 2: CTA Click
- **Event name**: `cta_click`
- **Mark as conversion**: Optional (recommended for funnel analysis)

---

## Step 5: Set Up DebugView for Development

DebugView allows you to see events in real-time during development:

### Enable DebugView:

1. In GA4, go to **Admin** → **Data Display** → **DebugView**
2. Enable DebugView for your property
3. Click **Save**

### Use DebugView in Development:

**Method 1: URL Parameter (Easiest)**
\`\`\`
http://localhost:3000/?debug_mode=true
\`\`\`
Add `?debug_mode=true` to any page URL during development. Events will appear in DebugView immediately.

**Method 2: Browser Extension**
1. Install [Google Analytics Debugger](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna) Chrome extension
2. Enable the extension
3. Visit your website
4. Events will automatically show in DebugView

**Method 3: Console Command**
\`\`\`javascript
// Run in browser console
gtag('set', 'debug_mode', true);
\`\`\`

### View Debug Events:

1. In GA4, go to **Configure** → **DebugView**
2. Select your device/browser from the dropdown
3. Watch events appear in real-time as you interact with the site
4. Click on events to see their parameters

**Expected Events in DebugView:**
- `page_view` - When page loads
- `cta_click` - When clicking any CTA button
- `form_open` - When opening the pre-form modal
- `form_submit_attempt` - When submitting the form
- `form_submit_success` - When form submits successfully
- `conversion` - When lead is captured

---

## Step 6: Verify Tracking

### Using GA4 DebugView (Recommended for Development):
1. Add `?debug_mode=true` to your URL
2. In GA4, go to **Configure** → **DebugView**
3. You should see real-time events:
   - `page_view`
   - `cta_click` (when clicking CTAs)
   - `form_open` (when opening the form)
   - `form_submit_success` (when submitting)

### Using Browser Console:
1. Open Developer Tools (F12)
2. Go to **Console** tab
3. Look for these logs:
   - GA4 script loaded successfully
   - Event tracking confirmations
   - Any tracking errors or warnings

### Using GA4 Realtime Reports:
1. In GA4, go to **Reports** → **Realtime**
2. Trigger events on your website
3. Events should appear within 30 seconds
4. **Note**: DebugView is more reliable for immediate testing

**Troubleshooting DebugView:**
- If events don't appear, check that `NEXT_PUBLIC_GA4_ID` is set correctly
- Ensure ad blockers are disabled
- Clear browser cache and reload
- Check browser console for errors

---

## Step 7: Create Custom Reports

### Funnel Analysis Report:
1. Go to **Explore** → **Blank**
2. Add these events in sequence:
   - `cta_click`
   - `form_open`
   - `form_submit_attempt`
   - `form_submit_success`
3. View conversion rates at each step

### CTA Performance Report:
1. Create exploration with:
   - **Dimension**: `event_label` (CTA text)
   - **Metric**: `event_count`
   - **Secondary dimension**: `page_section`
2. View which CTAs perform best

### Lead Source Report:
1. Create exploration with:
   - **Dimensions**: `utm_source`, `utm_medium`, `utm_campaign`
   - **Metric**: Conversions (`form_submit_success`)
2. View which marketing channels drive leads

---

## UTM Campaign Tracking

To track marketing campaigns, add UTM parameters to your URLs:

### Example URL Structure:
\`\`\`
https://whatamatters.com/?utm_source=facebook&utm_medium=social&utm_campaign=spring_2025&utm_content=hero_cta
\`\`\`

### UTM Parameter Definitions:
- **utm_source**: Traffic source (e.g., facebook, google, newsletter)
- **utm_medium**: Marketing medium (e.g., social, email, cpc)
- **utm_campaign**: Campaign name (e.g., spring_2025, product_launch)
- **utm_content**: Ad variation or CTA (e.g., hero_cta, video_ad_1)

### UTM Builder Tool:
Use [Google's Campaign URL Builder](https://ga-dev-tools.google/ga4/campaign-url-builder/)

---

## GDPR Compliance

To comply with GDPR, you should:

1. **Add Cookie Consent Banner** (not included in this implementation)
2. **IP Anonymization**: Enabled by default in GA4
3. **Data Retention**: Configure in GA4 Admin → Data Settings → Data Retention
4. **Privacy Policy**: Update to mention GA4 usage

### Example Privacy Policy Text:
\`\`\`
We use Google Analytics 4 to understand how visitors interact with our website. 
This includes tracking page views, button clicks, and form submissions. 
Google Analytics uses cookies to collect this data. You can opt-out of Google 
Analytics by installing the Google Analytics Opt-out Browser Add-on.
\`\`\`

---

## Troubleshooting

### Issue: Events not appearing in GA4
**Solutions**:
- Check that `NEXT_PUBLIC_GA4_ID` is set correctly
- Verify the Measurement ID starts with `G-`
- Check browser console for errors
- Disable ad blockers during testing
- Wait 24-48 hours for data to appear in standard reports (use DebugView for real-time)

### Issue: "gtag is not defined" errors
**Solutions**:
- Ensure GA4 script loads before tracking code
- Check Network tab to verify gtag.js loads successfully
- Verify environment variable is prefixed with `NEXT_PUBLIC_`

### Issue: Conversions not tracking
**Solutions**:
- Mark `form_submit_success` as a conversion in GA4
- Check that the event fires in DebugView
- Wait 24-48 hours for conversion data to populate

---

## Best Practices

1. **Test Tracking in Staging**: Always test events in a staging environment first
2. **Use Descriptive Event Names**: Follow GA4 naming conventions (lowercase, underscores)
3. **Document Custom Events**: Keep a record of all custom events and parameters
4. **Monitor Data Quality**: Regularly check for spam or bot traffic
5. **Set Up Alerts**: Create GA4 alerts for sudden traffic drops or spikes
6. **Regular Audits**: Review tracking monthly to ensure accuracy

---

## Next Steps

- Set up [Google Tag Manager](https://tagmanager.google.com) for more advanced tracking
- Create custom audiences for remarketing
- Set up [BigQuery export](https://support.google.com/analytics/answer/9358801) for advanced analysis
- Integrate with [Google Data Studio](https://datastudio.google.com) for custom dashboards
