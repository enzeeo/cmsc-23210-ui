const WORKSHEET_NAME = "Sheet1";

function doPost(event) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const worksheet = spreadsheet.getSheetByName(WORKSHEET_NAME);

    if (!worksheet) {
      return buildJsonResponse({
        success: false,
        message: "Worksheet not found. Update WORKSHEET_NAME in Code.gs."
      });
    }

    const requestData = parseRequestData(event);

    const typedName = getSafeString(requestData.typedName);
    const selectedAction = getSafeString(requestData.selectedAction);
    const condition = getSafeString(requestData.condition);
    const pressedAtIsoTimestamp = getSafeString(requestData.pressedAtIsoTimestamp);
    const timeFromPageOpenToSelectionMilliseconds = getSafeString(
      requestData.timeFromPageOpenToSelectionMilliseconds
    );

    worksheet.appendRow([
      typedName,
      selectedAction,
      condition,
      pressedAtIsoTimestamp,
      timeFromPageOpenToSelectionMilliseconds,
      new Date()
    ]);

    return buildJsonResponse({
      success: true,
      message: "Row added."
    });
  } catch (error) {
    return buildJsonResponse({
      success: false,
      message: String(error)
    });
  } finally {
    lock.releaseLock();
  }
}

function parseRequestData(event) {
  if (!event || !event.parameter) {
    return {};
  }

  return event.parameter;
}

function getSafeString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

function buildJsonResponse(responseBody) {
  return ContentService
    .createTextOutput(JSON.stringify(responseBody))
    .setMimeType(ContentService.MimeType.JSON);
}
