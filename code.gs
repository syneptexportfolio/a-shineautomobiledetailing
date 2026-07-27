/**
 * ─────────────────────────────────────────────────────
 *  A-Shine Auto Mobile Detailing — Google Apps Script
 *  Receives booking form submissions from the website
 *  and appends them to this Google Sheet.
 * ─────────────────────────────────────────────────────
 *
 *  Sheet columns (row 1 headers):
 *    A  Timestamp
 *    B  Full Name
 *    C  Phone
 *    D  Email
 *    E  Vehicle Make & Model
 *    F  Service Requested
 *    G  Additional Details
 *
 *  HOW TO DEPLOY
 *  1. Open the Google Sheet → Extensions → Apps Script
 *  2. Replace the default code with this file's contents.
 *  3. Click Deploy → New deployment → Web app
 *       • Execute as: Me
 *       • Who has access: Anyone
 *  4. Copy the Web App URL and paste it into your .env.local:
 *       NEXT_PUBLIC_GOOGLE_SCRIPT_URL=<your-url>
 * ─────────────────────────────────────────────────────
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById('1EeJmuN0VVGmTRdTnlKxdoBAf0c6LOKAoCtzpfx1mxj4').getActiveSheet();

    // The website sends JSON as text/plain to avoid CORS preflight.
    // Parse the raw body from e.postData.contents.
    var data = JSON.parse(e.postData.contents);

    // Format the timestamp for readability
    var timestamp = data.submittedAt
      ? new Date(data.submittedAt).toLocaleString('en-CA', { timeZone: 'America/Toronto' })
      : new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' });

    // Append a new row matching the sheet columns:
    // A: Timestamp | B: Full Name | C: Phone | D: Email
    // E: Vehicle Make & Model | F: Service Requested | G: Additional Details
    sheet.appendRow([
      timestamp,
      data.name    || '',
      data.phone   || '',
      data.email   || '',
      data.car     || '',
      data.service || '',
      data.message || ''
    ]);

    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (optional — useful for testing the deployment).
 */
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'A-Shine Detailing API is live.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
