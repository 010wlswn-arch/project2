/**
 * 모바일 청첩장 방명록용 Google Apps Script
 * 시트 열: createdAt | name | message | side | approved | id
 */
const SHEET_NAME = 'guestbook';

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!spreadsheetId) throw new Error('SPREADSHEET_ID가 설정되지 않았습니다.');
  const sheet = SpreadsheetApp.openById(spreadsheetId).getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error(SHEET_NAME + ' 시트를 찾을 수 없습니다.');
  return sheet;
}

function clean(value, maxLength) {
  return String(value || '').trim().replace(/[<>]/g, '').slice(0, maxLength);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(5000);
    const data = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (data.website) return jsonResponse({ success: true }); // honeypot
    const name = clean(data.name, 20);
    const message = clean(data.message, 200);
    const allowedSides = ['신랑 측', '신부 측', '두 사람의 지인'];
    const side = allowedSides.includes(data.side) ? data.side : '';
    if (name.length < 2 || !message || !side) {
      return jsonResponse({ success: false, message: '입력값을 확인해 주세요.' });
    }
    const id = Utilities.getUuid();
    getSheet().appendRow([new Date(), name, message, side, false, id]);
    return jsonResponse({ success: true, id: id });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, message: '저장 중 오류가 발생했습니다.' });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    if ((e.parameter.action || 'list') !== 'list') return jsonResponse({ success: false, message: '지원하지 않는 요청입니다.' });
    const values = getSheet().getDataRange().getValues();
    const items = values.slice(1)
      .filter(row => row[4] === true)
      .map(row => ({ createdAt: row[0], name: row[1], message: row[2], side: row[3], id: row[5] }))
      .reverse().slice(0, 50);
    return jsonResponse({ success: true, items: items });
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, message: '조회 중 오류가 발생했습니다.' });
  }
}
