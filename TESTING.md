# Testing & Validation Guide

This guide provides step-by-step instructions for validating all features of the Whatamatters landing page, including GA4 tracking, Google Sheets integration, form validation, and user flows.

---

## 1. GA4 DebugView Validation

### Setup Debug Mode

**Method 1: URL Parameter**
1. Open the landing page in Chrome
2. Add `?debug_mode=true` to the URL
3. Example: `https://yoursite.com/?debug_mode=true`

**Method 2: Chrome DevTools Console**
```javascript
localStorage.setItem('debug_mode', 'true');
location.reload();
```

**Method 3: GA4 Extension**
- Install "Google Analytics Debugger" Chrome extension
- Click the extension icon to enable debug mode

### Open GA4 DebugView

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property
3. Click **Admin** (bottom left)
4. Click **DebugView** in the left sidebar
5. You should see your current session appear in real-time

### Test CTA Button Tracking

| Button Location | Button Label | Expected Event | Required Parameters |
|----------------|--------------|----------------|-------------------|
| Navigation (top right) | "Analyze My Project" | `cta_click` | `cta_label`, `page_section: "navigation"`, `user_language`, `intent: "analyze"` |
| Hero Section | "Analyze My Project" | `cta_click` | `cta_label`, `page_section: "hero"`, `user_language`, `intent: "analyze"` |
| Hero Section | "Start a Conversation" | `cta_click` | `cta_label`, `page_section: "hero"`, `user_language`, `intent: "conversation"` |
| Services Section | "Explore" buttons (5x) | `cta_click` | `cta_label`, `page_section: "services"`, `user_language`, `service_name` |
| Floating Button (right side) | "Let's connect" | `cta_click` | `cta_label`, `page_section: "floating"`, `user_language` |
| Final CTA Section | "Analyze My Project" | `cta_click` | `cta_label`, `page_section: "final_cta"`, `user_language`, `intent: "analyze"` |
| Footer | "Analyze My Project" | `cta_click` | `cta_label`, `page_section: "footer"`, `user_language`, `intent: "analyze"` |

### Test Form Submission Tracking

1. Click any "Analyze My Project" button
2. Fill out the pre-form with test data:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Company: "Test Company"
   - Stage: Select any option
   - Needs: Check at least one checkbox
   - Message: "This is a test submission"
3. Submit the form
4. In GA4 DebugView, verify the `preform_submit` event appears with:
   - `user_language`: "en" or "es"
   - `intent`: "analyze" or "conversation"
   - `stage`: "exploring", "ready", or "urgent"
   - `needs_count`: Number of needs selected
   - `has_message`: true/false
   - `form_type`: "analyze" or "conversation"

### Verify Parameter Accuracy

Open Chrome DevTools → Console and check for GA4 events:
```javascript
// Events should log in console if debug mode is enabled
// Look for messages like: "GA4 Event: cta_click"
```

---

## 2. Google Sheets Validation

### Prerequisites

- Ensure `NEXT_PUBLIC_SHEET_WEBAPP_URL` is set in environment variables
- Verify Google Apps Script Web App is deployed and accessible

### Test Data Submission

1. Fill out and submit the pre-form
2. Open your Google Sheet
3. Verify a new row appears with the following columns populated:

| Column | Expected Format | Example |
|--------|----------------|---------|
| Timestamp | ISO 8601 format | `2025-01-07T14:30:00.000Z` |
| Full Name | Text | `John Doe` |
| Email | Valid email | `john@example.com` |
| Company | Text | `Acme Inc` |
| Stage | Enum value | `exploring`, `ready`, or `urgent` |
| Needs | Comma-separated | `Web Development, AI Strategy, SEO` |
| Message | Text (optional) | `Looking to build a new website` |
| Intent | Enum value | `analyze` or `conversation` |
| Language | 2-letter code | `en` or `es` |
| Source | URL or "Direct" | `https://example.com/referrer` |
| UTM Source | Text (optional) | `google` |
| UTM Medium | Text (optional) | `cpc` |
| UTM Campaign | Text (optional) | `summer_sale` |
| User IP | IP address | `192.168.1.1` |
| User Agent | Browser string | `Mozilla/5.0...` |
| Country | 2-letter code | `US` |

### Verify Data Formatting

- **Timestamp**: Should be in ISO 8601 format with timezone
- **Needs**: Should be comma-separated without brackets: `Web Development, AI Strategy`
- **Stage**: Should use string values, not numbers: `exploring` not `1`
- **Empty fields**: Should be blank, not "undefined" or "null"

---

## 3. Form Validation Testing

### Required Field Validation

Test each required field by leaving it empty:

1. **Full Name**
   - Leave empty → Should show "Name is required"
   - Enter "A" → Should show "Name must be at least 2 characters"
   - Enter "John Doe" → Error should clear

2. **Email**
   - Leave empty → Should show "Email is required"
   - Enter "invalid-email" → Should show "Invalid email format"
   - Enter "test@example.com" → Error should clear

3. **Company**
   - Leave empty → Should show "Company is required"
   - Enter "Acme" → Error should clear

4. **Stage**
   - Leave as placeholder → Should show "Please select your stage"
   - Select any option → Error should clear

5. **Needs**
   - Leave all unchecked → Should show "Please select at least one need"
   - Check one or more → Error should clear

### Progress Bar Validation

The progress bar should update dynamically as fields are filled:

- Empty form: 0%
- Name filled: ~16%
- Name + Email: ~33%
- Name + Email + Company: ~50%
- Name + Email + Company + Stage: ~66%
- Name + Email + Company + Stage + Needs: ~83%
- All fields filled: 100%

---

## 4. Error Handling Tests

### Honeypot Spam Protection

1. Open Chrome DevTools → Console
2. Run this code to fill the honeypot:
```javascript
document.querySelector('input[name="website"]').value = 'spam';
```
3. Fill out and submit the form
4. Form should appear to submit successfully (no error shown to user)
5. Check Google Sheet → No new row should appear
6. Check API response in Network tab → Should return success but data not saved

### Rate Limiting

1. Submit a form successfully
2. Immediately submit another form (within 60 seconds)
3. Should see error message: "Too many requests. Please wait a moment."
4. Wait 60 seconds
5. Submit again → Should succeed

### Network Failure Simulation

1. Open Chrome DevTools → Network tab
2. Set throttling to "Offline"
3. Submit the form
4. Should see error message: "Failed to submit. Please try again."
5. Set throttling back to "Online"
6. Submit again → Should succeed

### Invalid Data Handling

Test API endpoint directly to verify server-side validation:

```bash
# Missing required field
curl -X POST https://yoursite.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@example.com"}'
# Should return 400 error

# Invalid email format
curl -X POST https://yoursite.com/api/lead \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"invalid","company":"Test Co","stage":"exploring","needs":["Web Development"]}'
# Should return 400 error
```

---

## 5. Language Switching Tests

### Test Bilingual Content

1. **Default Language (English)**
   - Page loads with English content
   - Form labels in English
   - Error messages in English

2. **Switch to Spanish**
   - Click language toggle (if implemented)
   - OR change browser language to Spanish
   - Content should update to Spanish
   - Form labels in Spanish
   - Error messages in Spanish

3. **GA4 Language Tracking**
   - Submit form in English → `user_language: "en"`
   - Submit form in Spanish → `user_language: "es"`

---

## 6. GDPR Consent Banner Tests

### Initial Load

1. Open site in incognito mode (or clear cookies)
2. Consent banner should appear after 1 second
3. GA4 should NOT load until consent is given

### Accept Consent

1. Click "Accept" on consent banner
2. Banner should slide down and disappear
3. GA4 scripts should load
4. `localStorage.getItem('gdpr_consent')` should return `"accepted"`
5. Future visits should not show banner

### Decline Consent

1. Clear cookies and reload
2. Click "Decline" on consent banner
3. Banner should disappear
4. GA4 should NOT load
5. CTA clicks should NOT trigger GA4 events
6. `localStorage.getItem('gdpr_consent')` should return `"declined"`

### Verify No Tracking Without Consent

1. Decline consent
2. Open Chrome DevTools → Network tab
3. Filter by "google-analytics.com"
4. Click CTA buttons
5. No GA4 requests should appear

---

## 7. Mobile Responsiveness Tests

### Test on Different Devices

| Device | Viewport | Key Elements to Test |
|--------|----------|---------------------|
| iPhone SE | 375x667 | Form modal fills screen, all buttons tappable |
| iPhone 12 Pro | 390x844 | Navigation collapses properly, form readable |
| iPad | 768x1024 | Form centered with backdrop, CTA buttons visible |
| Desktop | 1920x1080 | Form modal centered, backdrop blur visible |

### Form Modal Behavior

- **Mobile**: Full-screen modal, no backdrop blur
- **Tablet/Desktop**: Centered modal (max-width 600px), backdrop blur

### Touch Interactions

1. Test all CTA buttons are tappable (min 44x44px touch target)
2. Form inputs should zoom properly on iOS (font-size ≥ 16px)
3. Checkbox groups should be easy to select on mobile

---

## 8. Performance Tests

### Page Load Speed

1. Open Chrome DevTools → Lighthouse
2. Run audit with "Performance" selected
3. Target scores:
   - Performance: ≥ 90
   - Accessibility: ≥ 95
   - Best Practices: ≥ 90
   - SEO: ≥ 90

### Script Loading

1. Open Network tab
2. Check GA4 script loading:
   - Should use `strategy="afterInteractive"`
   - Should not block page render
   - Should only load after consent accepted

---

## 9. Troubleshooting

### GA4 Events Not Appearing

**Issue**: CTA clicks not showing in DebugView

**Solutions**:
1. Verify `NEXT_PUBLIC_GA4_ID` is set correctly (format: `G-XXXXXXXXXX`)
2. Check consent was accepted (check localStorage)
3. Verify debug mode is enabled (`?debug_mode=true`)
4. Clear browser cache and reload
5. Check browser console for JavaScript errors

### Google Sheets Not Receiving Data

**Issue**: Form submits successfully but no data in Sheet

**Solutions**:
1. Verify `NEXT_PUBLIC_SHEET_WEBAPP_URL` is set correctly
2. Test the Web App URL directly in browser (should return success message)
3. Check Google Apps Script logs for errors
4. Verify Web App is deployed as "Anyone" can access
5. Check Sheet permissions allow script to write
6. Review API route logs for errors

### Rate Limiting False Positives

**Issue**: Rate limit triggered even on first submission

**Solutions**:
1. Check if IP is being captured correctly in API route
2. Verify cooldown period (60 seconds) is appropriate
3. Clear rate limit cache by restarting server
4. Check if multiple users share same IP (corporate network)

### Form Validation Not Working

**Issue**: Form submits with invalid data

**Solutions**:
1. Verify zod schema matches form fields
2. Check react-hook-form integration (`{...register()}`)
3. Review browser console for validation errors
4. Test with various invalid inputs to identify specific field

---

## 10. Automated Testing (Optional)

### Setup Playwright Tests

Create `tests/contact-form.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Contact Form Flow', () => {
  test('should submit form successfully', async ({ page }) => {
    await page.goto('/');
    
    // Accept consent
    await page.click('button:has-text("Accept")');
    
    // Click CTA
    await page.click('button:has-text("Analyze My Project")');
    
    // Fill form
    await page.fill('input[name="fullName"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="company"]', 'Test Co');
    await page.selectOption('select[name="stage"]', 'exploring');
    await page.check('input[value="Web Development"]');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=Success')).toBeVisible();
  });
});
```

---

## Quick Checklist

Use this checklist for rapid validation after deployments:

- [ ] GA4 DebugView shows `cta_click` events
- [ ] GA4 DebugView shows `preform_submit` events
- [ ] Google Sheet receives new rows with correct data
- [ ] Form validation works (required fields show errors)
- [ ] Progress bar updates as form is filled
- [ ] Honeypot protection works (spam not saved)
- [ ] Rate limiting works (can't submit twice rapidly)
- [ ] Error messages display for network failures
- [ ] Consent banner appears on first visit
- [ ] GA4 only loads after consent accepted
- [ ] Mobile form is fully responsive
- [ ] All CTA buttons trigger modal correctly
- [ ] Success animation plays after submission
- [ ] Form resets after successful submission

---

## Support

If you encounter issues not covered in this guide:

1. Check browser console for errors
2. Review GA4 DebugView for event data
3. Check Google Apps Script logs
4. Review API route logs in Vercel/Cloudflare
5. Test in incognito mode to rule out cache issues
6. Contact support at: [your-email@domain.com]

---

**Last Updated**: January 2025
**Version**: 1.0
