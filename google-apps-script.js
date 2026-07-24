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
    // Open the spreadsheet by its ID and select the active sheet
    var ss = SpreadsheetApp.openById("1EeJmuN0VVGmTRdTnlKxdoBAf0c6LOKAoCtzpfx1mxj4");
    var sheet = ss.getActiveSheet() || ss.getSheets()[0];
    
    // Initialize default fields
    var name = "";
    var phone = "";
    var email = "";
    var vehicle = "";
    var service = "";
    var details = "";
    
    // 1. Try parsing JSON body if sent as text/plain (direct from client)
    if (e && e.postData && e.postData.contents) {
      try {
        var data = JSON.parse(e.postData.contents);
        name = data.name || "";
        phone = data.phone || "";
        email = data.email || "";
        // Support both "car" and "vehicle" keys from the frontend payload
        vehicle = data.car || data.vehicle || "";
        service = data.service || "";
        // Support both "message" and "details" keys from the frontend payload
        details = data.message || data.details || "";
      } catch (jsonError) {
        // Fallback to URL-encoded parsing if JSON parsing fails
      }
    }
    
    // 2. If fields are still empty, try parsing from URL-encoded form parameters
    if (!name && e && e.parameter) {
      name = e.parameter.name || "";
      phone = e.parameter.phone || "";
      email = e.parameter.email || "";
      vehicle = e.parameter.car || e.parameter.vehicle || "";
      service = e.parameter.service || "";
      details = e.parameter.message || e.parameter.details || "";
    }
    
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
