/**
 * ══════════════════════════════════════════════════════════════
 *  LAHI × CBSE  —  Google Apps Script CMS API
 *  Published as a Web App: Execute As Me, Access: Anyone
 * ══════════════════════════════════════════════════════════════
 *
 *  GOOGLE SHEET STRUCTURE:
 *  ─────────────────────────────────────────────────────────────
 *  Sheet 1: "FAQ"
 *    Columns: Category | Question | Answer | Status
 *    Example row: Policy | Is Skill Education mandatory? | Yes, as per NEP... | Active
 *
 *  Sheet 2: "Webinars"
 *    Columns: Title | Description | RecordingLink | Thumbnail | Status
 *    Example row: From Policy to Practice | Practical discussion... | https://zoom... | | Active
 *
 *  Sheet 3: "Brochures"
 *    Columns: Title | Description | FileURL | Type | Icon | Status
 *    Example row: School Programme | Overview of school programme | https://... | PDF | 📄 | Active
 *  ─────────────────────────────────────────────────────────────
 *
 *  HOW TO DEPLOY:
 *  1. Open your Google Sheet → Extensions → Apps Script
 *  2. Delete any existing code and paste this entire file into Code.gs
 *  3. Click Deploy → New Deployment → Type: Web App
 *  4. Execute As: Me
 *  5. Who has access: Anyone
 *  6. Click Deploy → Authorize → Copy the Web App URL
 *  7. Paste that URL into script.js as the value of CMS_API_URL
 *
 *  IMPORTANT: Every time you edit this script, go to
 *  Deploy → Manage Deployments → Edit → New Version → Deploy
 *  to push your changes live.
 *
 *  TESTING: Open the Web App URL directly in your browser.
 *  You should see JSON like: {"faq":[...],"webinars":[...],"brochures":[...]}
 *
 *  FUTURE: EXCEL-BASED WORKFLOW
 *  ─────────────────────────────────────────────────────────────
 *  If you prefer managing content in Excel (.xlsx):
 *  1. Maintain faq.xlsx with columns: Category | Question | Answer | Priority | Status
 *  2. Run converter: Node.js (xlsx library) or Python (openpyxl) → outputs faq-data.json
 *  3. Upload faq-data.json alongside index.html — website auto-fetches on load
 *  ─────────────────────────────────────────────────────────────
 */

const SPREADSHEET_ID = '1pcs2ENtw97VxsnrFN3Rae_ffY9telOEivDoPW1kKCPc';

/**
 * Handles GET requests.
 * Supports both plain JSON and JSONP (pass ?callback=fnName for cross-origin browser calls).
 *
 * Plain JSON:  fetch the URL directly (works from same domain or non-Workspace deployments)
 * JSONP:       website appends ?callback=__gasCallback_123 — Apps Script wraps response in
 *              that function call, bypassing browser CORS restrictions for Workspace domains.
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

    const faq       = getSheetData(ss, 'FAQ',       ['category', 'question', 'answer', 'status']);
    const webinars  = getSheetData(ss, 'Webinars',  ['title', 'description', 'recordingLink', 'thumbnail', 'status']);
    const brochures = getSheetData(ss, 'Brochures', ['title', 'description', 'fileURL', 'type', 'icon', 'status']);

    const payload = {
      faq:       faq.filter(r => r.status.toLowerCase() === 'active'),
      webinars:  webinars.filter(r => r.status.toLowerCase() === 'active'),
      brochures: brochures.filter(r => r.status.toLowerCase() === 'active'),
      lastUpdated: new Date().toISOString()
    };

    const jsonString = JSON.stringify(payload);

    // JSONP support: if ?callback=fnName is present, wrap JSON in the callback
    const callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + jsonString + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }

    // Plain JSON response
    return ContentService
      .createTextOutput(jsonString)
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    const errorPayload = JSON.stringify({ error: err.message, faq: [], webinars: [], brochures: [] });
    const callback = e && e.parameter && e.parameter.callback;
    if (callback) {
      return ContentService
        .createTextOutput(callback + '(' + errorPayload + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService
      .createTextOutput(errorPayload)
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Reads a named sheet and maps each data row to an object.
 * Row 1 is the header row and is always skipped.
 *
 * @param {SpreadsheetApp.Spreadsheet} ss - The spreadsheet instance
 * @param {string} sheetName - Exact name of the sheet tab
 * @param {string[]} keys - Column key names in order (matching column positions)
 * @returns {Object[]} Array of row objects
 */
function getSheetData(ss, sheetName, keys) {
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    Logger.log('Sheet not found: ' + sheetName);
    return [];
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; // Only header row or empty

  const data = sheet.getRange(2, 1, lastRow - 1, keys.length).getValues();

  return data
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const obj = {};
      keys.forEach((key, i) => {
        obj[key] = String(row[i] !== undefined ? row[i] : '').trim();
      });
      return obj;
    });
}

/**
 * Test function — run this manually in Apps Script editor to verify your sheet data.
 * Click Run → testAPI and check the Logs (View → Logs).
 */
function testAPI() {
  const result = doGet({});
  Logger.log(result.getContent());
}
