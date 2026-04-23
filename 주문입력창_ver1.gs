// ========================================
// 통합 Apps Script 코드 (개선 버전)
// - 구매주문서 자동화
// - 수량표 데이터 전송 (월별 자동 선택)
// - 주문 히스토리 & 수정 기능 추가
// ========================================

const MONTHLY_SPREADSHEET_IDS = {
  '202603': '1mC1bhcLHrDKGLtatsYSiBWnuosp1E4ZOBMasyvKRsQc',
  '202604': '1vMpdE5pg54axE7QE_KDesHSJv2jZU8-7teLOSFAo3F0',
  '202605': '1BmzpBuZSwWXonz9dB3sPCObX98gCSZEDziuF2wHj6sM',
  '202606': '10USsHJgzrncuTpt1FNS56FRY3wblU1dv1bbtTIbscqM',
};

function getMonthlySpreadsheetId(date) {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('❌ 유효하지 않은 날짜입니다.\n\n배송 날짜가 올바르게 설정되었는지 확인해주세요.');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const yearMonth = `${year}${month}`;
  const spreadsheetId = MONTHLY_SPREADSHEET_IDS[yearMonth];
  if (!spreadsheetId || spreadsheetId.trim() === '') {
    throw new Error(`${year}년 ${month}월 수량표 스프레드시트 ID가 등록되지 않았습니다.\n\nMONTHLY_SPREADSHEET_IDS에 '${yearMonth}': '스프레드시트_ID' 형식으로 추가해주세요.`);
  }
  return spreadsheetId;
}

const FOLDER_IDS = {
  ESTIMATE: '1RjMT4IAYtwStaQE59P9vc90teyUlb0Mc',
  ORDER: '1GWYS_STun4obsw3628wVyNJLhI_01Euj',
  SHEET_COPY: '1dJA5w6hKPIzYyNPi5-1g22GrLP9aJJgH',
};

// ========================================
// 히스토리 관련 함수
// ========================================

function getHistorySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('주문히스토리');
  if (!sheet) {
    sheet = ss.insertSheet('주문히스토리');
    sheet.getRange(1, 1, 1, 19).setValues([[
      '타임스탬프', '이벤트ID', '파일명', '주문자', '주문자연락처',
      '수령인', '수령인연락처', '주문날짜', '배송일', '배송시간', '배송방식',
      '배송주소', '문구번호', '문구내용', '결제방식', '메모',
      '제품명목록', '제품구성목록', '단가목록'
    ]]);
    sheet.getRange(1, 1, 1, 19).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveOrderHistory(eventId, fileName, orderData) {
  const sheet = getHistorySheet();
  const now = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  const productNameStr = orderData.productNames.join(' / ');
  const productStr = orderData.products.map(([n, q]) => `${n} x ${q}`).join(' / ');
  const priceStr = orderData.prices.join(' / ');
  sheet.appendRow([
    now, eventId, fileName,
    orderData.orderer, orderData.ordererTel,
    orderData.recipient, orderData.recipientTel,
    orderData.orderDate ? Utilities.formatDate(orderData.orderDate, Session.getScriptTimeZone(), 'yyyy-MM-dd') : '',
    Utilities.formatDate(orderData.date, Session.getScriptTimeZone(), 'yyyy-MM-dd'),
    orderData.time, orderData.deliveryMethod, orderData.address,
    orderData.phraseNo, orderData.phraseText, orderData.payMethod,
    orderData.memo, productNameStr, productStr, priceStr
  ]);
}

function loadOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const historySheet = ss.getSheetByName('주문히스토리');
  if (!historySheet) {
    SpreadsheetApp.getUi().alert('주문히스토리 시트가 없습니다. 먼저 주문전송을 한 번 해주세요.');
    return;
  }

  const data = historySheet.getDataRange().getValues();
  if (data.length <= 1) {
    SpreadsheetApp.getUi().alert('히스토리에 주문 내역이 없습니다.');
    return;
  }

  const rows = data.slice(1).reverse();
  const choices = rows.map((r, i) => `${i + 1}. ${r[2]} (${r[0]})`).join('\n');

  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '주문 불러오기',
    '불러올 주문 번호를 입력하세요:\n\n' + choices,
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const idx = parseInt(response.getResponseText().trim(), 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= rows.length) {
    ui.alert('올바른 번호를 입력해주세요.');
    return;
  }

  const row = rows[idx];
  const sheet = ss.getSheetByName('구매주문서');

  if (row[7]) sheet.getRange('C5').setValue(row[7]);
  sheet.getRange('C6').setValue(row[8]);
  sheet.getRange('C7').setValue(row[9]);
  sheet.getRange('C8').setValue(row[10]);
  sheet.getRange('C10').setValue(row[12]);
  sheet.getRange('C11').setValue(row[11]);
  sheet.getRange('C12').setValue(row[15]);
  sheet.getRange('E5').setValue(row[14]);
  sheet.getRange('E6').setValue(row[3]);
  sheet.getRange('E7').setValue(row[4]);
  sheet.getRange('E8').setValue(row[5]);
  sheet.getRange('E9').setValue(row[6]);
  sheet.getRange('E10').setValue(row[13]);

  sheet.getRange('B15:E33').clearContent();
  const productNameStr = row[16];
  const productStr = row[17];
  const priceStr = row[18];

  if (productNameStr && productStr) {
    const names = productNameStr.split(' / ');
    const items = productStr.split(' / ');
    const prices = priceStr ? priceStr.split(' / ') : [];
    names.forEach((name, i) => {
      if (i >= 19) return;
      sheet.getRange(15 + i, 2).setValue(name.trim());
    });
    items.forEach((item, i) => {
      if (i >= 19) return;
      const parts = item.split(' x ');
      if (parts.length === 2) {
        sheet.getRange(15 + i, 3).setValue(parts[0].trim());
        sheet.getRange(15 + i, 4).setValue(parts[1].trim());
      }
    });
    prices.forEach((price, i) => {
      if (i >= 19 || !price.trim()) return;
      sheet.getRange(15 + i, 5).setValue(price.trim());
    });
  }

  sheet.getRange('A1').setValue(row[1]);
  sheet.getRange('A2').setValue(row[2]);
  sheet.getRange('A1:Z1').setFontColor('#ffffff');
  sheet.getRange('A1:Z2').setFontColor('#ffffff');

  ss.setActiveSheet(sheet);
  SpreadsheetApp.getUi().alert(`✅ '${row[2]}' 주문을 불러왔습니다.\n내용을 수정한 후 [주문 수정전송]을 누르세요.`);
}

// ========================================
// onEdit 함수
// ========================================

function onEdit(e) {
  if (!e) return;
  try {
    const sheet = e.source.getActiveSheet();
    const editedCell = e.range;
    const sheetName = sheet.getName();
    if (sheetName === '구매주문서') {
      handlePurchaseOrderEdit(e, sheet, editedCell);
    }
    if (sheetName === '출력전용' && editedCell.getA1Notation() === 'B2') {
      refreshOutputSheet(sheet);
    }
    const dateSheetPattern = /^\d{8}.+요일$/;
    if (dateSheetPattern.test(sheetName)) {
      if (e.range.getColumn() <= 4 && e.range.getLastColumn() >= 4) {
        const startRow = e.range.getRow();
        const numRows = e.range.getNumRows();
        const dRange = sheet.getRange(startRow, 4, numRows, 1);
        const values = dRange.getValues();
        let changed = false;
        for (let i = 0; i < values.length; i++) {
          const raw = values[i][0];
          if (raw === '' || raw === null || raw === undefined) continue;
          if (typeof raw === 'number') continue;
          const extracted = String(raw).replace(/[^0-9.]/g, '');
          if (extracted === '') continue;
          const num = Number(extracted);
          if (!isNaN(num)) { values[i][0] = num; changed = true; }
        }
        if (changed) dRange.setValues(values);
      }
    }
  } catch (error) {
    Logger.log("onEdit 에러 발생: " + error.toString());
  }
}

function handlePurchaseOrderEdit(e, sheet, editedCell) {
  const row = editedCell.getRow();
  const col = editedCell.getColumn();
  if (col !== 2 || row < 15 || row > 33) return;
  const productName = editedCell.getValue();
  const data = e.source.getSheetByName('제품리스트').getDataRange().getValues();
  const 제품행 = data.slice(1).find(r => r[2] === productName) || [];
  const 구성들 = 제품행.slice(3, 8);
  const price = 제품행[9] || '';
  sheet.getRange(row, 3, 구성들.length, 1).clearContent();
  sheet.getRange(row, 5, 구성들.length, 1).clearContent();
  구성들.forEach((item, i) => {
    if (!item) return;
    sheet.getRange(row + i, 3).setValue(item);
    if (i === 0) sheet.getRange(row + i, 5).setValue(price);
  });
}

// ========================================
// 수량표 전송
// ========================================

function transferQuantityToMonthlySheet(deliveryDate) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const quantitySheet = ss.getSheetByName('수량표전송');
    if (!quantitySheet) { Logger.log("오류: 수량표전송 시트를 찾을 수 없습니다."); return; }

    const dateInB2 = quantitySheet.getRange('B2').getValue();

    function parseToDate(value) {
      if (value instanceof Date) return value;
      if (typeof value === 'string') {
        const match = value.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
        if (match) return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        return new Date(value);
      }
      if (typeof value === 'number') return new Date(value);
      return null;
    }

    let targetDate = parseToDate(deliveryDate);
    if (!targetDate || isNaN(targetDate.getTime())) targetDate = parseToDate(dateInB2);
    if (!targetDate || isNaN(targetDate.getTime())) {
      SpreadsheetApp.getActiveSpreadsheet().toast("❌ 유효한 배송 날짜를 찾을 수 없습니다.", "수량표 전송 실패", 5);
      return;
    }

    const monthlySpreadsheetId = getMonthlySpreadsheetId(targetDate);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`;
    const sheetName = formatDateToSheetName(targetDate);
    const sourceData = quantitySheet.getRange('A1:D12').getValues();
    const monthlySpreadsheet = SpreadsheetApp.openById(monthlySpreadsheetId);
    const targetSheet = monthlySpreadsheet.getSheetByName(sheetName);

    if (!targetSheet) {
      SpreadsheetApp.getActiveSpreadsheet().toast(`❌ '${sheetName}' 시트를 찾을 수 없습니다.`, "수량표 전송 실패", 5);
      return;
    }

    let startRow = 205;
    let lastDataRow = startRow - 1;
    const maxCheckRow = Math.min(targetSheet.getMaxRows(), 500);
    for (let row = startRow; row <= maxCheckRow; row++) {
      const bValue = targetSheet.getRange(row, 2).getValue();
      const cValue = targetSheet.getRange(row, 3).getValue();
      const dValue = targetSheet.getRange(row, 4).getValue();
      if (bValue || cValue || dValue) lastDataRow = row;
    }

    const currentRow = lastDataRow < startRow ? startRow : lastDataRow + 5;
    const targetRange = targetSheet.getRange(currentRow, 1, 12, 4);
    targetRange.setValues(sourceData);
    targetRange.setFontWeight("normal");
    Utilities.sleep(1000);

    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ 수량표 데이터가 '${yearMonth}수량표 > ${sheetName}' 시트 ${currentRow}행에 저장되었습니다!`,
      "수량표 전송 완료", 3
    );
  } catch (error) {
    SpreadsheetApp.getActiveSpreadsheet().toast(`❌ 수량표 전송 실패\n\n${error.message}`, "오류", 5);
  }
}

function formatDateToSheetName(date) {
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${year}${month}${day}${dayNames[date.getDay()]}`;
}

function transferQuantityData() {
  try {
    var sourceSpreadsheetId = "1B3TldmH1d7tBiXSR2bbgKCGk3ccEVfTbcu9pOP6GGv0";
    var sourceSheetName = "수량표전송";
    var targetSpreadsheetId = "1CQAUYtRcu741qGuVz_e9VGO7I01ITdLAo1VP9mqWtrU";
    var targetSheetName = "수량표전송";
    var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
    var sourceSheet = sourceSpreadsheet.getSheetByName(sourceSheetName);
    if (!sourceSheet) { SpreadsheetApp.getUi().alert("원본 시트 '" + sourceSheetName + "'를 찾을 수 없습니다."); return; }
    var targetSpreadsheet = SpreadsheetApp.openById(targetSpreadsheetId);
    var targetSheet = targetSpreadsheet.getSheetByName(targetSheetName);
    if (!targetSheet) targetSheet = targetSpreadsheet.insertSheet(targetSheetName);
    var lastRow = sourceSheet.getLastRow();
    var lastCol = sourceSheet.getLastColumn();
    if (lastRow === 0 || lastCol === 0) { SpreadsheetApp.getUi().alert("원본 시트에 데이터가 없습니다."); return; }
    var sourceData = sourceSheet.getRange(1, 1, lastRow, lastCol).getValues();
    var sourceFormats = sourceSheet.getRange(1, 1, lastRow, lastCol).getNumberFormats();
    targetSheet.clear();
    targetSheet.getRange(1, 1, lastRow, lastCol).setValues(sourceData);
    targetSheet.getRange(1, 1, lastRow, lastCol).setNumberFormats(sourceFormats);
    for (var col = 1; col <= lastCol; col++) targetSheet.setColumnWidth(col, sourceSheet.getColumnWidth(col));
    SpreadsheetApp.getActiveSpreadsheet().toast("전송 완료!", "전송 완료", 5);
  } catch (error) {
    SpreadsheetApp.getUi().alert("오류 발생: " + error.toString());
  }
}

// ========================================
// 주문 전송 (sendOrder)
// ========================================

function sendOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('구매주문서');
  const cal = CalendarApp.getCalendarById('1578sandal@gmail.com');

  let dateRaw = sheet.getRange('C6').getValue();
  if (!dateRaw) throw new Error('❌ 배송날짜가 입력되지 않았습니다. C6 셀을 확인해주세요.');

  if (!(dateRaw instanceof Date)) {
    if (typeof dateRaw === 'string') {
      const match = dateRaw.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (match) dateRaw = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      else dateRaw = new Date(dateRaw);
    } else {
      dateRaw = new Date(dateRaw);
    }
    if (isNaN(dateRaw.getTime())) throw new Error('❌ 배송날짜 형식이 올바르지 않습니다.');
  }

  const orderDateRaw = sheet.getRange('C5').getValue();
  const timeRaw = sheet.getRange('C7').getDisplayValue();
  const deliveryMethod = sheet.getRange('C8').getValue();
  const orderer = sheet.getRange('E6').getValue();
  const ordererTel = sheet.getRange('E7').getValue();
  const recipient = sheet.getRange('E8').getValue();
  const recipientTel = sheet.getRange('E9').getValue();
  const phraseNo = sheet.getRange('C10').getValue();
  const phraseText = sheet.getRange('E10').getValue();
  const payMethod = sheet.getRange('E5').getValue();
  const address = sheet.getRange('C11').getValue();
  const memo = sheet.getRange('C12').getValue();
  const products = sheet.getRange('C15:D33').getValues().filter(r => r[0]);
  const productNames = sheet.getRange('B15:B33').getValues().flat().filter(name => name);
  const prices = sheet.getRange('E15:E33').getValues().flat().map(p => p !== '' ? String(p) : '');

  if (!orderer || !dateRaw) throw new Error('❌ 주문자 또는 배송일 누락');

  const [h, m] = parseKoreanTimeString(timeRaw);
  const start = new Date(dateRaw); start.setHours(h, m);
  const end = new Date(start);

  const title = `${address} - 주문자: ${orderer}`;
  const desc = buildEventDescription(orderer, ordererTel, recipient, recipientTel, phraseNo, phraseText, payMethod, address, h, m, deliveryMethod, memo, productNames, products);

  const event = cal.createEvent(title, start, end, { description: desc, location: address });
  const eventId = event.getId();

  const formattedDate = Utilities.formatDate(dateRaw, Session.getScriptTimeZone(), 'yyyyMMdd');
  const cleanOrderer = orderer.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim();
  const newFileName = `${formattedDate}_${cleanOrderer}`;

  saveEstimatePdf('견적서', newFileName, FOLDER_IDS.ESTIMATE);
  saveEstimatePdf('구매주문서', `${newFileName}_주문서`, FOLDER_IDS.ORDER);
  saveSheetCopy(newFileName, FOLDER_IDS.SHEET_COPY);
  transferQuantityToMonthlySheet(dateRaw);

  saveOrderHistory(eventId, newFileName, {
    orderer, ordererTel, recipient, recipientTel,
    orderDate: orderDateRaw instanceof Date ? orderDateRaw : null,
    date: dateRaw, time: timeRaw, deliveryMethod,
    address, phraseNo, phraseText, payMethod, memo,
    products, productNames, prices
  });

  sheet.getRange('A1').clearContent();
  sheet.getRange('A2').clearContent();
  sheet.getRange('A1:Z1').setFontColor('#ffffff');
  sheet.getRange('A1:Z2').setFontColor('#ffffff');
  sheet.getRange('C5').clearContent();
  sheet.getRange('C6').clearContent();
  sheet.getRange('C7').clearContent();
  sheet.getRange('C10').clearContent();
  sheet.getRange('C11').clearContent();
  sheet.getRange('C12').clearContent();
  sheet.getRange('E5:E10').clearContent();
  sheet.getRange('B15:B33').clearContent();
  sheet.getRange('C15:D33').clearContent();
  sheet.getRange('E15:E33').clearContent();

  SpreadsheetApp.getActiveSpreadsheet().toast(`✅ 주문 전송 완료: ${newFileName}`, "완료", 4);
}

// ========================================
// 주문 수정전송 (modifyOrder)
// ========================================

function modifyOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('구매주문서');

  const existingEventId = sheet.getRange('A1').getValue();
  const existingFileName = sheet.getRange('A2').getValue();

  if (!existingEventId) {
    SpreadsheetApp.getUi().alert('❌ 불러온 주문이 없습니다.\n먼저 [주문 불러오기]로 수정할 주문을 불러오세요.');
    return;
  }

  const cal = CalendarApp.getCalendarById('1578sandal@gmail.com');

  let dateRaw = sheet.getRange('C6').getValue();
  if (!dateRaw) throw new Error('❌ 배송날짜가 입력되지 않았습니다.');
  if (!(dateRaw instanceof Date)) {
    if (typeof dateRaw === 'string') {
      const match = dateRaw.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (match) dateRaw = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      else dateRaw = new Date(dateRaw);
    } else {
      dateRaw = new Date(dateRaw);
    }
    if (isNaN(dateRaw.getTime())) throw new Error('❌ 배송날짜 형식이 올바르지 않습니다.');
  }

  const orderDateRaw = sheet.getRange('C5').getValue();
  const timeRaw = sheet.getRange('C7').getDisplayValue();
  const deliveryMethod = sheet.getRange('C8').getValue();
  const orderer = sheet.getRange('E6').getValue();
  const ordererTel = sheet.getRange('E7').getValue();
  const recipient = sheet.getRange('E8').getValue();
  const recipientTel = sheet.getRange('E9').getValue();
  const phraseNo = sheet.getRange('C10').getValue();
  const phraseText = sheet.getRange('E10').getValue();
  const payMethod = sheet.getRange('E5').getValue();
  const address = sheet.getRange('C11').getValue();
  const memo = sheet.getRange('C12').getValue();
  const products = sheet.getRange('C15:D33').getValues().filter(r => r[0]);
  const productNames = sheet.getRange('B15:B33').getValues().flat().filter(name => name);
  const prices = sheet.getRange('E15:E33').getValues().flat().map(p => p !== '' ? String(p) : '');

  const [h, m] = parseKoreanTimeString(timeRaw);
  const start = new Date(dateRaw); start.setHours(h, m);
  const end = new Date(start);

  try {
    const event = cal.getEventById(existingEventId);
    if (event) {
      const newTitle = `${address} - 주문자: ${orderer}`;
      const newDesc = buildEventDescription(orderer, ordererTel, recipient, recipientTel, phraseNo, phraseText, payMethod, address, h, m, deliveryMethod, memo, productNames, products);
      event.setTitle(newTitle);
      event.setDescription(newDesc);
      event.setTime(start, end);
      event.setLocation(address);
    } else {
      SpreadsheetApp.getActiveSpreadsheet().toast('⚠️ 캘린더 이벤트를 찾지 못했습니다. 캘린더는 수동 수정이 필요합니다.', '주의', 5);
    }
  } catch (e) {
    SpreadsheetApp.getActiveSpreadsheet().toast('⚠️ 캘린더 업데이트 실패: ' + e.message, '주의', 5);
  }

  const formattedDate = Utilities.formatDate(dateRaw, Session.getScriptTimeZone(), 'yyyyMMdd');
  const cleanOrderer = orderer.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim();
  const newFileName = `${formattedDate}_${cleanOrderer}`;

  deleteFileByName(existingFileName, FOLDER_IDS.ESTIMATE);
  deleteFileByName(`${existingFileName}_주문서`, FOLDER_IDS.ORDER);
  deleteFileByName(existingFileName, FOLDER_IDS.SHEET_COPY);

  saveEstimatePdf('견적서', newFileName, FOLDER_IDS.ESTIMATE);
  saveEstimatePdf('구매주문서', `${newFileName}_주문서`, FOLDER_IDS.ORDER);
  saveSheetCopy(newFileName, FOLDER_IDS.SHEET_COPY);
  transferQuantityToMonthlySheet(dateRaw);

  saveOrderHistory(existingEventId, newFileName, {
    orderer, ordererTel, recipient, recipientTel,
    orderDate: orderDateRaw instanceof Date ? orderDateRaw : null,
    date: dateRaw, time: timeRaw, deliveryMethod,
    address, phraseNo, phraseText, payMethod, memo,
    products, productNames, prices
  });

  sheet.getRange('A1').clearContent();
  sheet.getRange('A2').clearContent();
  sheet.getRange('A1:Z1').setFontColor('#ffffff');
  sheet.getRange('A1:Z2').setFontColor('#ffffff');
  sheet.getRange('C5').clearContent();
  sheet.getRange('C6').clearContent();
  sheet.getRange('C7').clearContent();
  sheet.getRange('C10').clearContent();
  sheet.getRange('C11').clearContent();
  sheet.getRange('C12').clearContent();
  sheet.getRange('E5:E10').clearContent();
  sheet.getRange('B15:B33').clearContent();
  sheet.getRange('C15:D33').clearContent();
  sheet.getRange('E15:E33').clearContent();

  SpreadsheetApp.getActiveSpreadsheet().toast(`✅ 수정 완료: ${newFileName}`, "완료", 4);
}

// ========================================
// 공통 유틸 함수
// ========================================

function buildEventDescription(orderer, ordererTel, recipient, recipientTel, phraseNo, phraseText, payMethod, address, h, m, deliveryMethod, memo, productNames, products) {
  return `📦 주문 정보\n`
    + `- 주문자: ${orderer}\n`
    + `- 주문자 연락처: ${ordererTel}\n`
    + `- 수신자: ${recipient}\n`
    + `- 연락처: ${recipientTel}\n`
    + `- 문구번호: ${phraseNo}\n`
    + `- 문구내용: ${phraseText}\n`
    + `- 결제방식: ${payMethod}\n`
    + `- 배송주소: ${address}\n`
    + `- 배송시간: ${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}\n`
    + `- 배송방식: ${deliveryMethod}\n`
    + (memo ? `- 메모: ${memo}\n` : '')
    + (productNames.length > 0 ? `\n📄 제품명:\n` + productNames.map(n => `• ${n}`).join('\n') + '\n' : '')
    + `\n📄 제품 구성:\n`
    + products.map(([n, q]) => `• ${n} x ${q}`).join('\n') + '\n\n'
    + `★ 스토어주문서는 예약주문건이라 미리 배송을 눌러두는 점 양해 부탁드립니다!\n`
    + `★ 배송은 차량으로 배송하기에 정확한 배송은 어려우나, 늦지 않게 예약된 시간 즈음으로 도착합니다.`;
}

function deleteFileByName(fileName, folderId) {
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByName(fileName + '.pdf');
    while (files.hasNext()) files.next().setTrashed(true);
    const sheets = folder.getFilesByName(fileName);
    while (sheets.hasNext()) sheets.next().setTrashed(true);
  } catch (e) {
    Logger.log('파일 삭제 실패: ' + fileName + ' / ' + e.toString());
  }
}

function parseKoreanTimeString(str) {
  const isPM = str.includes('오후');
  const match = str.match(/(\d+):(\d+)/);
  if (!match) throw new Error('시간 형식 오류: ' + str);
  let h = parseInt(match[1], 10), m = parseInt(match[2], 10);
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return [h, m];
}

function saveEstimatePdf(sheetName, fileName, folderId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const folder = DriveApp.getFolderById(folderId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`시트를 찾을 수 없음: ${sheetName}`);
  const opts = ['format=pdf','size=A4','portrait=true','fitw=true','sheetnames=false','printtitle=false','pagenumbers=false','gridlines=false',`gid=${sheet.getSheetId()}`].join('&');
  const baseUrl = ss.getUrl().replace(/\/edit.*$/, '');
  const blob = UrlFetchApp.fetch(`${baseUrl}/export?${opts}`, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  }).getBlob().setName(`${fileName}.pdf`);
  folder.createFile(blob);
}

function saveSheetCopy(fileName, folderId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const folder = DriveApp.getFolderById(folderId);
  const copy = ss.copy(`${fileName}`);
  const file = DriveApp.getFileById(copy.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return copy;
}

function fixRowHeight() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('구매주문서');
  sheet.getRange('A1').clearContent();
  sheet.getRange('A2').clearContent();
  sheet.getRange('A1:Z1').setFontColor('#ffffff');
  sheet.getRange('A1:Z2').setFontColor('#ffffff');
}

// ========================================
// onOpen 함수
// ========================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🧾 주문 관리')
    .addItem('주문 전송', 'sendOrder')
    .addItem('주문 수정전송', 'modifyOrder')
    .addItem('주문 불러오기 (수정용)', 'loadOrder')
    .addToUi();
}
