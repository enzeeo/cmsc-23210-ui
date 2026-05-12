const RESPONSE_MIME_TYPE = ContentService.MimeType.JSON;
const SHEET_NAME = "Responses";
const CONDITION_LABEL = "control";
const HEADER_ROW = ["Condition"];

function doPost() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = getOrCreateSheet(spreadsheet);
    ensureHeaderRow(sheet);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      sheet.appendRow([CONDITION_LABEL]);
    } finally {
      lock.releaseLock();
    }

    return createJsonResponse({
      ok: true,
      condition: CONDITION_LABEL
    });
  } catch (error) {
    return createJsonResponse({
      ok: false,
      error: String(error)
    });
  }
}

function doGet() {
  return createJsonResponse({
    ok: true,
    message: "Tracking endpoint is running.",
    condition: CONDITION_LABEL
  });
}

function getOrCreateSheet(spreadsheet) {
  const existingSheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (existingSheet) {
    return existingSheet;
  }

  return spreadsheet.insertSheet(SHEET_NAME);
}

function ensureHeaderRow(sheet) {
  const firstCellValue = sheet.getRange(1, 1).getValue();

  if (String(firstCellValue).length > 0) {
    return;
  }

  sheet.getRange(1, 1, 1, HEADER_ROW.length).setValues([HEADER_ROW]);
}

function createJsonResponse(responseData) {
  return ContentService
    .createTextOutput(JSON.stringify(responseData))
    .setMimeType(RESPONSE_MIME_TYPE);
}
