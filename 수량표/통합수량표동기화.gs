// ========================================
// 통합수량표 동기화
// 조식수량표 + 일반주문수량표의 노란색 표 데이터를 읽어서 통합수량표에 씀
// ========================================

const MGMT_SS_ID_통합 = '1NvXSUa7bfpIcbkqFuT3ODbQrd4e_YKGZw1CivhOVEP8';

// 노란색 표가 있는 열 쌍 (제품명열, 수량열)
const QUANTITY_COL_PAIRS = [
  { nameCol: 7, qtyCol: 8 },   // G, H - 샌드위치/베이글/비건샌드위치
  { nameCol: 11, qtyCol: 12 }, // K, L - 유부초밥/사이드/컵밥/비건유부초밥
  { nameCol: 15, qtyCol: 16 }, // O, P - 김밥
  { nameCol: 19, qtyCol: 20 }, // S, T - 과일/샐러드
  { nameCol: 23, qtyCol: 24 }, // W, X - 기타
];

function getIds통합() {
  const fileName = SpreadsheetApp.getActiveSpreadsheet().getName();
  const yearMonth = fileName.substring(0, 6);
  const mgmtSS = SpreadsheetApp.openById(MGMT_SS_ID_통합);
  const sheet = mgmtSS.getSheetByName('동기화관리');
  const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  for (const row of data) {
    if (String(row[0]) === yearMonth) {
      return {
        조식: String(row[2]),
        일반주문: String(row[3]),
        통합: String(row[4])
      };
    }
  }
  throw new Error(`${yearMonth} ID가 동기화관리 시트에 없습니다.`);
}

// 날짜 시트에서 "최종 작업 XXX" 헤더 기준으로 제품명+수량 읽기
function readQuantityData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 58) return {};

  const result = {}; // { 제품명: qty }

  const data = sheet.getRange(58, 1, lastRow - 57, 24).getValues();

  for (const pair of QUANTITY_COL_PAIRS) {
    const nameColIdx = pair.nameCol - 1;
    const qtyColIdx = pair.qtyCol - 1;

    for (let r = 0; r < data.length; r++) {
      const nameVal = data[r][nameColIdx];
      const qtyVal = data[r][qtyColIdx];

      if (!nameVal || String(nameVal).trim() === '') continue;
      const name = String(nameVal).trim();

      // 헤더 행 ("최종 작업 XXX") 건너뜀
      if (name.startsWith('최종 작업')) continue;

      const qty = parseFloat(String(qtyVal).replace(/[^0-9.]/g, ''));
      if (isNaN(qty) || qty === 0) continue;

      result[name] = (result[name] || 0) + qty;
    }
  }

  return result;
}

// 통합수량표 날짜 시트에 데이터 쓰기
function writeToIntegratedSheet(targetSheet, mergedData) {
  // 기존 데이터 클리어 (58행부터)
  const lastRow = Math.max(targetSheet.getLastRow(), 58);
  targetSheet.getRange(58, 1, lastRow - 57, 24).clearContent();

  if (Object.keys(mergedData).length === 0) return;

  // 카테고리별로 분류해서 쓰기
  const entries = Object.entries(mergedData).map(([name, qty]) => [name, qty]);

  // G열/H열에 순서대로 씀
  let row = 59;
  for (const [name, qty] of entries) {
    targetSheet.getRange(row, 7).setValue(name);
    targetSheet.getRange(row, 8).setValue(qty);
    row++;
  }
}

// 두 데이터 합산
function mergeQuantityData(data1, data2) {
  const merged = { ...data1 };
  for (const [name, qty] of Object.entries(data2)) {
    merged[name] = (merged[name] || 0) + qty;
  }
  return merged;
}

function dateKeyToSheetName통합(dateKey) {
  const y = parseInt(dateKey.substring(0, 4));
  const mo = parseInt(dateKey.substring(4, 6)) - 1;
  const d = parseInt(dateKey.substring(6, 8));
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dateObj = new Date(y, mo, d);
  return `${y}${String(mo+1).padStart(2,'0')}${String(d).padStart(2,'0')}${dayNames[dateObj.getDay()]}`;
}

// ========================================
// 메인 동기화 함수
// ========================================

function syncToIntegrated() {
  try {
    const ids = getIds통합();
    const 조식SS = SpreadsheetApp.openById(ids.조식);
    const 일반SS = SpreadsheetApp.openById(ids.일반주문);
    const 통합SS = SpreadsheetApp.openById(ids.통합);

    const dateSheetPattern = /^\d{8}.+요일$/;
    const 조식Sheets = 조식SS.getSheets().filter(s => dateSheetPattern.test(s.getName()));

    let successCount = 0;
    let failCount = 0;

    for (const 조식Sheet of 조식Sheets) {
      const sheetName = 조식Sheet.getName();

      try {
        const 조식Data = readQuantityData(조식Sheet);

        const 일반Sheet = 일반SS.getSheetByName(sheetName);
        const 일반Data = 일반Sheet ? readQuantityData(일반Sheet) : {};

        const merged = mergeQuantityData(조식Data, 일반Data);

        const 통합Sheet = 통합SS.getSheetByName(sheetName);
        if (!통합Sheet) {
          console.warn(`⚠️ 통합수량표에 시트 없음: ${sheetName}`);
          failCount++;
          continue;
        }

        writeToIntegratedSheet(통합Sheet, merged);
        successCount++;
        console.log(`✅ ${sheetName}: ${Object.keys(merged).length}개 제품`);

      } catch (e) {
        console.error(`❌ ${sheetName} 처리 실패:`, e);
        failCount++;
      }
    }

    SpreadsheetApp.getUi().alert(`✅ 통합수량표 동기화 완료!\n성공: ${successCount}개\n실패: ${failCount}개`);

  } catch (error) {
    SpreadsheetApp.getUi().alert(`❌ 오류 발생:\n${error.message}`);
    console.error(error);
  }
}

// 특정 날짜만 동기화
function syncOneDateToIntegrated() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt('날짜 입력', '동기화할 날짜를 입력하세요 (예: 20260601)', ui.ButtonSet.OK_CANCEL);
  if (response.getSelectedButton() !== ui.Button.OK) return;

  const dateKey = response.getResponseText().trim();
  if (!/^\d{8}$/.test(dateKey)) {
    ui.alert('날짜 형식이 올바르지 않습니다. (예: 20260601)');
    return;
  }

  try {
    const ids = getIds통합();
    const sheetName = dateKeyToSheetName통합(dateKey);

    const 조식SS = SpreadsheetApp.openById(ids.조식);
    const 일반SS = SpreadsheetApp.openById(ids.일반주문);
    const 통합SS = SpreadsheetApp.openById(ids.통합);

    const 조식Sheet = 조식SS.getSheetByName(sheetName);
    const 일반Sheet = 일반SS.getSheetByName(sheetName);
    const 통합Sheet = 통합SS.getSheetByName(sheetName);

    if (!통합Sheet) throw new Error(`통합수량표에 ${sheetName} 시트가 없습니다.`);

    const 조식Data = 조식Sheet ? readQuantityData(조식Sheet) : {};
    const 일반Data = 일반Sheet ? readQuantityData(일반Sheet) : {};
    const merged = mergeQuantityData(조식Data, 일반Data);

    writeToIntegratedSheet(통합Sheet, merged);
    ui.alert(`✅ ${sheetName} 동기화 완료!\n${Object.keys(merged).length}개 제품`);

  } catch (error) {
    ui.alert(`❌ 오류 발생:\n${error.message}`);
    console.error(error);
  }
}

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 통합 동기화')
    .addItem('전체 날짜 동기화', 'syncToIntegrated')
    .addItem('특정 날짜만 동기화', 'syncOneDateToIntegrated')
    .addToUi();
}
