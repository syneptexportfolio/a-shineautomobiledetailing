/**
 * Google Apps Script to handle quote submissions from the A-Shine website.
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click on Extensions > Apps Script.
 * 3. Delete any code in the editor and paste this script.
 * 4. Save the project (e.g., name it "A-Shine Website Integrator").
 * 5. Click "Deploy" > "New deployment".
 * 6. Click the gear icon next to "Select type" and choose "Web app".
 * 7. Set:
 *    - Description: "Production Web App"
 *    - Execute as: "Me" (your email address)
 *    - Who has access: "Anyone" (this is CRITICAL for it to accept submissions)
 * 8. Click "Deploy" and authorize access when prompted.
 * 9. Copy the "Web app URL" and add it to your .env.local file as:
 *    GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/DEPLOYMENT_ID/exec
 */

function doPost(e) {
  try {
    // Acquire the active sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse form parameters sent by the Next.js server
    var name = e.parameter.name || "";
    var phone = e.parameter.phone || "";
    var email = e.parameter.email || "";
    var vehicle = e.parameter.vehicle || "";
    var service = e.parameter.service || "";
    var details = e.parameter.details || "";
    
    // Create timestamp
    var timestamp = new Date();
    
    // Append the row matching the Google Sheets columns:
    // A: Timestamp
    // B: Full Name
    // C: Phone
    // D: Email
    // E: Vehicle Make & Model
    // F: Service Requested
    // G: Additional Details
    sheet.appendRow([
      timestamp,
      name,
      phone,
      email,
      vehicle,
      service,
      details
    ]);
    
    // Return successful JSON response
    return ContentService.createTextOutput(JSON.stringify({
      "result": "success",
      "message": "Row successfully appended to sheet."
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    // Return error JSON response
    return ContentService.createTextOutput(JSON.stringify({
      "result": "error",
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
