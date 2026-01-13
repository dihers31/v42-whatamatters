# Google Apps Script Setup for Whatamatters Lead Capture

This document provides step-by-step instructions for setting up the Google Sheets integration using Apps Script Web App (Cloudflare Edge compatible).

## Why Apps Script Instead of Google Sheets API?

- **Cloudflare Edge Compatible**: Apps Script uses simple HTTP POST requests, avoiding heavy Node.js libraries
- **No OAuth Complexity**: Deploy once and use a simple webhook URL
- **Free Tier**: No API quotas or billing required for typical use cases
- **Simple Authentication**: Web App handles authentication automatically

---

## Step 1: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **+ Blank** to create a new spreadsheet
3. Name it: **"Whatamatters Leads"**
4. In **Row 1**, add these EXACT column headers:

| Column | Header |
|--------|--------|
| A1 | Timestamp |
| B1 | Name |
| C1 | Email |
| D1 | Company |
| E1 | Intent |
| F1 | Stage |
| G1 | Needs |
| H1 | Message |
| I1 | Source |
| J1 | UTM_Content |
| K1 | Status_Internal |
| L1 | UTM_Source |
| M1 | UTM_Medium |
| N1 | UTM_Campaign |
| O1 | User_Agent |
| P1 | Country |

**Important**: Column order matters! The Apps Script expects this exact order.

---

## Step 2: Create Apps Script

1. In your Google Sheet, click **Extensions** → **Apps Script**
2. Delete the default `myFunction()` code
3. Paste the following code:

\`\`\`javascript
/**
 * Whatamatters Lead Capture - Apps Script Web App
 * This script receives POST requests from the Next.js contact form
 * and saves lead data to Google Sheets
 */

function doPost(e) {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.email || !data.company || !data.intent) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Missing required fields: name, email, company, or intent"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Map data to row (EXACT order matching column headers A-P)
    const row = [
      new Date().toISOString(),           // A: Timestamp
      data.name,                          // B: Name
      data.email,                         // C: Email
      data.company,                       // D: Company
      data.intent,                        // E: Intent (analyze_project | conversation)
      data.stage,                         // F: Stage (exploring | ready | urgent)
      data.needs,                         // G: Needs (comma-separated string)
      data.message || "",                 // H: Message
      data.page_section || "unknown",     // I: Source
      data.cta_label || "direct",         // J: UTM_Content (CTA label)
      "new",                              // K: Status_Internal (default status)
      data.utm_source || "",              // L: UTM_Source
      data.utm_medium || "",              // M: UTM_Medium
      data.utm_campaign || "",            // N: UTM_Campaign
      data.user_agent || "",              // O: User_Agent
      data.country || ""                  // P: Country
    ];
    
    // Append row to sheet
    sheet.appendRow(row);
    
    // Log success
    Logger.log('Lead saved: ' + data.email);
    
    // Return success response
    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      message: "Lead saved successfully",
      timestamp: new Date().toISOString()
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Log error
    Logger.log('Error: ' + error.toString());
    
    // Return error response
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Test function to verify the script works
 * Run this from the Apps Script editor to test
 */
function testDoPost() {
  const testData = {
    postData: {
      contents: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        company: "Test Company",
        intent: "analyze_project",
        stage: "exploring",
        needs: "Web Design, SEO",
        message: "This is a test message",
        page_section: "test",
        cta_label: "test_cta"
      })
    }
  };
  
  const result = doPost(testData);
  Logger.log(result.getContent());
}
\`\`\`

4. Click **Save** (💾 icon) or press `Ctrl+S` / `Cmd+S`
5. Name your project: **"Whatamatters Lead Capture"**

---

## Step 3: Test the Script (Optional but Recommended)

1. In the Apps Script editor, select `testDoPost` from the function dropdown
2. Click **Run** (▶️ icon)
3. **First time only**: You'll be asked to authorize the script
   - Click **Review Permissions**
   - Choose your Google account
   - Click **Advanced** → **Go to Whatamatters Lead Capture (unsafe)**
   - Click **Allow**
4. Check your sheet - you should see a test row added
5. Check **View** → **Logs** to see the success message

---

## Step 4: Deploy as Web App

1. In Apps Script editor, click **Deploy** → **New deployment**
2. Click the **gear icon** ⚙️ next to "Select type"
3. Choose **Web app**
4. Configure deployment settings:
   - **Description**: `Whatamatters Contact Form v1`
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (required for public form submissions)
5. Click **Deploy**
6. **Copy the Web App URL** - it will look like:
   \`\`\`
   https://script.google.com/macros/s/AKfycbz.../exec
   \`\`\`
7. Click **Done**

**Important**: Keep this URL secure! Anyone with this URL can submit data to your sheet.

---

## Step 5: Add URL to Environment Variables

1. In your Vercel project (or `.env.local` for local development):
   \`\`\`env
   NEXT_PUBLIC_SHEET_WEBAPP_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   \`\`\`

2. Redeploy your Next.js application

---

## Step 6: Test the Integration

1. Open your deployed website
2. Fill out and submit the contact form
3. Check your Google Sheet - you should see a new row with:
   - Timestamp
   - Name, Email, Company
   - Intent (analyze_project or conversation)
   - Stage, Needs, Message
   - Tracking data (Source, UTM params, User Agent, Country)

---

## Troubleshooting

### Issue: "Authorization required" error
**Solution**: Make sure you authorized the script in Step 3

### Issue: "Missing required fields" error
**Solution**: Check that your form is sending all required fields (name, email, company, intent)

### Issue: Data not appearing in sheet
**Solution**: 
1. Check Apps Script **Executions** (left sidebar) for error logs
2. Verify column headers match exactly (case-sensitive)
3. Run the `testDoPost()` function manually to test

### Issue: "Permission denied" when accessing Web App URL
**Solution**: 
1. Redeploy the Web App with "Who has access" set to **Anyone**
2. Make sure "Execute as" is set to **Me**

---

## Updating the Script

If you need to modify the script:

1. Make your changes in the Apps Script editor
2. Click **Deploy** → **Manage deployments**
3. Click the **pencil icon** ✏️ next to your deployment
4. **Version**: Select **New version**
5. Click **Deploy**

**Note**: The Web App URL stays the same, so you don't need to update environment variables.

---

## Data Privacy & Security

- **GDPR Compliance**: Ensure you have user consent before collecting personal data
- **Access Control**: Only share the sheet with team members who need access
- **URL Security**: Don't commit the Web App URL to public repositories
- **Rate Limiting**: The Next.js API route includes rate limiting to prevent abuse
- **Honeypot**: The form includes a honeypot field to block spam bots

---

## Next Steps

- Set up [Google Sheets notifications](https://support.google.com/docs/answer/91588) for new leads
- Create a dashboard in Google Sheets to analyze lead sources
- Set up automated follow-up emails using [Google Workspace](https://workspace.google.com)
- Export data to your CRM using [Zapier](https://zapier.com) or [Make](https://make.com)
