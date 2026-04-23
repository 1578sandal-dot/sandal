// ========================================
// 통합 Apps Script 코드 (개선 버전)
// - 구매주문서 자동화
// - 수량표 데이터 전송 (월별 자동 선택)
// - 주문히스토리 + 불러오기 + 수정전송
// ========================================

// ========================================
// 월별 스프레드시트 설정
// ========================================

const MONTHLY_SPREADSHEET_IDS = {
  '202603': '1mC1bhcLHrDKGLtatsYSiBWnuosp1E4ZOBMasyvKRsQc',  // 2026년 3월
  '202604': '1vMpdE5pg54axE7QE_KDesHSJv2jZU8-7teLOSFAo3F0',  // 2026년 4월
  '202605': '1BmzpBuZSwWXonz9dB3sPCObX98gCSZEDziuF2wHj6sM',  // 2026년 5월
  '202606': '10USsHJgzrncuTpt1FNS56FRY3wblU1dv1bbtTIbscqM',  // 2026년 6월
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
    throw new Error(
      `${year}년 ${month}월 수량표 스프레드시트 ID가 등록되지 않았습니다.\n\n` +
      `Apps Script 코드 상단의 MONTHLY_SPREADSHEET_IDS 객체에\n` +
      `'${yearMonth}': '스프레드시트_ID' 형식으로 추가해주세요.`
    );
  }

  return spreadsheetId;
}

// ========================================
// 드라이브 폴더 설정
// ========================================

const FOLDER_IDS = {
  ESTIMATE: '1RjMT4IAYtwStaQE59P9vc90teyUlb0Mc',  // 견적서 폴더
  ORDER: '1GWYS_STun4obsw3628wVyNJLhI_01Euj',     // 주문서 폴더
  SHEET_COPY: '1dJA5w6hKPIzYyNPi5-1g22GrLP9aJJgH', // 시트 사본 폴더
};

// ========================================
// 주문히스토리 시트 관리
// ========================================

function getHistorySheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let histSheet = ss.getSheetByName('주문히스토리');
  if (!histSheet) {
    histSheet = ss.insertSheet('주문히스토리');
    histSheet.appendRow([
      '저장시각', '주문날짜', '배송날짜', '배송시간', '배송방식',
      '주문자', '주문자연락처', '수령인', '수령인연락처',
      '문구번호', '문구내용', '결제방식', '배송주소', '배송메세지',
      '제품명목록', '제품구성목록', '수량목록', '단가목록',
      '이벤트ID', '파일명'
    ]);
  }
  return histSheet;
}

function saveOrderHistory(data) {
  const histSheet = getHistorySheet();
  histSheet.appendRow([
    new Date(),
    data.orderDate,
    data.deliveryDate,
    data.deliveryTime,
    data.deliveryMethod,
    data.orderer,
    data.ordererTel,
    data.recipient,
    data.recipientTel,
    data.phraseNo,
    data.phraseText,
    data.payMethod,
    data.address,
    data.memo,
    data.productNames,
    data.productCompositions,
    data.quantities,
    data.prices,
    data.eventId,
    data.fileName
  ]);
}

// ========================================
// 불러오기 함수
// ========================================

function loadOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('구매주문서');
  const histSheet = ss.getSheetByName('주문히스토리');

  if (!histSheet) {
    SpreadsheetApp.getUi().alert('주문히스토리 시트가 없습니다. 먼저 주문전송을 해주세요.');
    return;
  }

  const lastRow = histSheet.getLastRow();
  if (lastRow < 2) {
    SpreadsheetApp.getUi().alert('저장된 주문 히스토리가 없습니다.');
    return;
  }

  const row = histSheet.getRange(lastRow, 1, 1, 20).getValues()[0];

  // 히스토리 컬럼 인덱스 (0-based)
  const orderDate      = row[1];
  const deliveryDate   = row[2];
  const deliveryTime   = row[3];
  const deliveryMethod = row[4];
  const orderer        = row[5];
  const ordererTel     = row[6];
  const recipient      = row[7];
  const recipientTel   = row[8];
  const phraseNo       = row[9];
  const phraseText     = row[10];
  const payMethod      = row[11];
  const address        = row[12];
  const memo           = row[13];
  const productNamesStr    = row[14];
  const productCompsStr    = row[15];
  const quantitiesStr      = row[16];
  const pricesStr          = row[17];
  const eventId            = row[18];
  const fileName           = row[19];

  // 기본 정보 복원
  sheet.getRange('C5').setValue(orderDate);
  sheet.getRange('C6').setValue(deliveryDate);
  sheet.getRange('C7').setValue(deliveryTime);
  sheet.getRange('C8').setValue(deliveryMethod);
  sheet.getRange('E5').setValue(payMethod);
  sheet.getRange('E6').setValue(orderer);
  sheet.getRange('E7').setValue(ordererTel);
  sheet.getRange('E8').setValue(recipient);
  sheet.getRange('E9').setValue(recipientTel);
  sheet.getRange('C10').setValue(phraseNo);
  sheet.getRange('E10').setValue(phraseText);
  sheet.getRange('C11').setValue(address);
  sheet.getRange('C12').setValue(memo);

  // 제품 정보 복원
  const productNames = productNamesStr ? String(productNamesStr).split('||') : [];
  const productComps = productCompsStr ? String(productCompsStr).split('||') : [];
  const quantities   = quantitiesStr   ? String(quantitiesStr).split('||')   : [];
  const prices       = pricesStr       ? String(pricesStr).split('||')       : [];

  // B15:E33 초기화
  sheet.getRange('B15:E33').clearContent();

  let currentRow = 15;
  for (let i = 0; i < productNames.length && currentRow <= 33; i++) {
    const name  = productNames[i];
    const comps = productComps[i] ? productComps[i].split('|') : [];
    const qtys  = quantities[i]   ? quantities[i].split('|')   : [];
    const price = prices[i] || '';

    for (let j = 0; j < comps.length && currentRow <= 33; j++) {
      if (j === 0) {
        sheet.getRange(currentRow, 2).setValue(name);
        sheet.getRange(currentRow, 5).setValue(price);
      }
      sheet.getRange(currentRow, 3).setValue(comps[j]);
      sheet.getRange(currentRow, 4).setValue(qtys[j] || '');
      currentRow++;
    }
  }

  // A1/A2에 이벤트ID/파일명 저장 (흰색 폰트)
  sheet.getRange('A1').setValue(eventId);
  sheet.getRange('A2').setValue(fileName);
  fixRowHeight();

  SpreadsheetApp.getActiveSpreadsheet().toast('✅ 마지막 주문을 불러왔습니다.', '불러오기 완료', 3);
}

// ========================================
// A1/A2 흰색 폰트 처리
// ========================================

function fixRowHeight() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('구매주문서');
  sheet.getRange('A1').setFontColor('#ffffff');
  sheet.getRange('A2').setFontColor('#ffffff');
}

// ========================================
// 수정전송 함수
// ========================================

function modifyOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('구매주문서');
  const cal = CalendarApp.getCalendarById('1578sandal@gmail.com');

  // A1/A2에서 기존 이벤트ID, 파일명 읽기
  const oldEventId = String(sheet.getRange('A1').getValue()).trim();
  const oldFileName = String(sheet.getRange('A2').getValue()).trim();

  if (!oldEventId) {
    SpreadsheetApp.getUi().alert('❌ 불러오기를 먼저 실행해주세요.\n(이벤트 ID가 없습니다)');
    return;
  }

  // 주문 정보 읽기
  let dateRaw = sheet.getRange('C6').getValue();
  if (!dateRaw) throw new Error('❌ 배송날짜가 입력되지 않았습니다.');
  if (!(dateRaw instanceof Date)) {
    if (typeof dateRaw === 'string') {
      const match = dateRaw.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (match) {
        dateRaw = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      } else {
        dateRaw = new Date(dateRaw);
      }
    } else {
      dateRaw = new Date(dateRaw);
    }
    if (isNaN(dateRaw.getTime())) throw new Error('❌ 배송날짜 형식이 올바르지 않습니다.');
  }

  const timeRaw      = sheet.getRange('C7').getDisplayValue();
  const deliveryMethod = sheet.getRange('C8').getValue();
  const orderer      = sheet.getRange('E6').getValue();
  const ordererTel   = sheet.getRange('E7').getValue();
  const recipient    = sheet.getRange('E8').getValue();
  const recipientTel = sheet.getRange('E9').getValue();
  const phraseNo     = sheet.getRange('C10').getValue();
  const phraseText   = sheet.getRange('E10').getValue();
  const payMethod    = sheet.getRange('E5').getValue();
  const address      = sheet.getRange('C11').getValue();
  const memo         = sheet.getRange('C12').getValue();
  const orderDate    = sheet.getRange('C5').getValue();
  const products     = sheet.getRange('C15:D33').getValues().filter(r => r[0]);
  const productNames = sheet.getRange('B15:B33').getValues().flat().filter(n => n);

  if (!orderer) throw new Error('❌ 주문자 누락');

  const [h, m] = parseKoreanTimeString(timeRaw);
  const start = new Date(dateRaw); start.setHours(h, m);
  const end = new Date(start);

  // 기존 캘린더 이벤트 수정
  try {
    const event = cal.getEventById(oldEventId);
    if (event) {
      const title = `${address} - 주문자: ${orderer}`;
      const desc = buildEventDescription({
        orderer, ordererTel, recipient, recipientTel,
        phraseNo, phraseText, payMethod, address, h, m,
        deliveryMethod, memo, productNames, products
      });
      event.setTitle(title);
      event.setDescription(desc);
      event.setTime(start, end);
    } else {
      Logger.log('이벤트를 찾을 수 없어 새로 생성합니다: ' + oldEventId);
      cal.createEvent(`${address} - 주문자: ${orderer}`, start, end, {
        description: buildEventDescription({
          orderer, ordererTel, recipient, recipientTel,
          phraseNo, phraseText, payMethod, address, h, m,
          deliveryMethod, memo, productNames, products
        }),
        location: address
      });
    }
  } catch(e) {
    Logger.log('캘린더 수정 오류: ' + e.toString());
  }

  // 기존 PDF/사본 삭제 후 재생성
  const formattedDate = Utilities.formatDate(dateRaw, Session.getScriptTimeZone(), 'yyyyMMdd');
  const cleanOrderer = orderer.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim();
  const newFileName = `${formattedDate}_${cleanOrderer}`;

  deleteFileByName(oldFileName, FOLDER_IDS.ESTIMATE);
  deleteFileByName(oldFileName + '_주문서', FOLDER_IDS.ORDER);
  deleteFileByName(oldFileName, FOLDER_IDS.SHEET_COPY);

  saveEstimatePdf('견적서', newFileName, FOLDER_IDS.ESTIMATE);
  saveEstimatePdf('구매주문서', `${newFileName}_주문서`, FOLDER_IDS.ORDER);
  saveSheetCopy(newFileName, FOLDER_IDS.SHEET_COPY);

  // 수량표 재전송
  transferQuantityToMonthlySheet(dateRaw);

  // A1/A2 업데이트 및 히스토리 저장
  const newEventId = oldEventId; // 이벤트 수정이므로 ID 유지
  sheet.getRange('A1').setValue(newEventId);
  sheet.getRange('A2').setValue(newFileName);
  fixRowHeight();

  // 히스토리 저장
  const priceValues = [];
  const productNamesArr = [];
  const productCompsArr = [];
  const quantitiesArr = [];

  let bValues = sheet.getRange('B15:E33').getValues();
  let currentProductName = '';
  let currentComps = [];
  let currentQtys = [];
  let currentPrice = '';

  for (let i = 0; i < bValues.length; i++) {
    const bVal = bValues[i][0];
    const cVal = bValues[i][1];
    const dVal = bValues[i][2];
    const eVal = bValues[i][3];

    if (bVal) {
      if (currentProductName) {
        productNamesArr.push(currentProductName);
        productCompsArr.push(currentComps.join('|'));
        quantitiesArr.push(currentQtys.join('|'));
        priceValues.push(currentPrice);
      }
      currentProductName = bVal;
      currentComps = cVal ? [cVal] : [];
      currentQtys = dVal !== '' ? [dVal] : [];
      currentPrice = eVal || '';
    } else if (cVal && currentProductName) {
      currentComps.push(cVal);
      currentQtys.push(dVal !== '' ? dVal : '');
    }
  }
  if (currentProductName) {
    productNamesArr.push(currentProductName);
    productCompsArr.push(currentComps.join('|'));
    quantitiesArr.push(currentQtys.join('|'));
    priceValues.push(currentPrice);
  }

  saveOrderHistory({
    orderDate,
    deliveryDate: dateRaw,
    deliveryTime: timeRaw,
    deliveryMethod,
    orderer,
    ordererTel,
    recipient,
    recipientTel,
    phraseNo,
    phraseText,
    payMethod,
    address,
    memo,
    productNames: productNamesArr.join('||'),
    productCompositions: productCompsArr.join('||'),
    quantities: quantitiesArr.join('||'),
    prices: priceValues.join('||'),
    eventId: newEventId,
    fileName: newFileName
  });

  SpreadsheetApp.getActiveSpreadsheet().toast('✅ 수정전송이 완료되었습니다.', '수정전송 완료', 3);
}

// ▶ 이벤트 설명 텍스트 빌드
function buildEventDescription(p) {
  return `📦 주문 정보\n`
    + `- 주문자: ${p.orderer}\n`
    + `- 주문자 연락처: ${p.ordererTel}\n`
    + `- 수신자: ${p.recipient}\n`
    + `- 연락처: ${p.recipientTel}\n`
    + `- 문구번호: ${p.phraseNo}\n`
    + `- 문구내용: ${p.phraseText}\n`
    + `- 결제방식: ${p.payMethod}\n`
    + `- 배송주소: ${p.address}\n`
    + `- 배송시간: ${String(p.h).padStart(2,'0')}:${String(p.m).padStart(2,'0')}\n`
    + `- 배송방식: ${p.deliveryMethod}\n`
    + (p.memo ? `- 메모: ${p.memo}\n` : ``)
    + (p.productNames.length > 0
      ? `\n📄 제품명:\n` + p.productNames.map(n => `• ${n}`).join('\n') + `\n`
      : ``)
    + `\n📄 제품 구성:\n`
    + p.products.map(([n,q]) => `• ${n} x ${q}`).join('\n') + `\n\n`
    + `★ 스토어주문서는 예약주문건이라 미리 배송을 눌러두는 점 양해 부탁드립니다!\n`
    + `★ 배송은 차량으로 배송하기에 정확한 배송은 어려우나, 늦지 않게 예약된 시간 즈음으로 도착합니다.`;
}

// ▶ 파일명으로 파일 찾아 삭제
function deleteFileByName(fileName, folderId) {
  if (!fileName) return;
  try {
    const folder = DriveApp.getFolderById(folderId);
    const files = folder.getFilesByName(fileName + '.pdf');
    while (files.hasNext()) {
      files.next().setTrashed(true);
    }
    const files2 = folder.getFilesByName(fileName);
    while (files2.hasNext()) {
      files2.next().setTrashed(true);
    }
  } catch(e) {
    Logger.log('파일 삭제 오류: ' + e.toString());
  }
}

// ========================================
// ▶▶▶ onEdit 함수 (통합) ◀◀◀
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
          if (!isNaN(num)) {
            values[i][0] = num;
            changed = true;
          }
        }

        if (changed) dRange.setValues(values);
      }
    }

  } catch (error) {
    Logger.log("onEdit 에러 발생: " + error.toString());
  }
}

// ▶ 구매주문서: 제품명 입력 시 구성 자동 삽입
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
    if (i === 0) {
      sheet.getRange(row + i, 5).setValue(price);
    }
  });
}

// ========================================
// 수량표 데이터 전송 함수
// ========================================

function transferQuantityToMonthlySheet(deliveryDate) {
  try {
    Logger.log("=== 수량표 전송 시작 ===");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const quantitySheet = ss.getSheetByName('수량표전송');

    if (!quantitySheet) {
      Logger.log("오류: 수량표전송 시트를 찾을 수 없습니다.");
      return;
    }

    const dateInB2 = quantitySheet.getRange('B2').getValue();

    function parseToDate(value) {
      if (value instanceof Date) return value;
      if (typeof value === 'string') {
        const match = value.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
        if (match) {
          return new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
        }
        return new Date(value);
      }
      if (typeof value === 'number') return new Date(value);
      return null;
    }

    let targetDate = parseToDate(deliveryDate);
    if (!targetDate || isNaN(targetDate.getTime())) {
      targetDate = parseToDate(dateInB2);
    }

    if (!targetDate || isNaN(targetDate.getTime())) {
      Logger.log("오류: 유효한 배송 날짜를 찾을 수 없습니다.");
      SpreadsheetApp.getActiveSpreadsheet().toast('❌ 유효한 배송 날짜를 찾을 수 없습니다.', '수량표 전송 실패', 5);
      return;
    }

    const monthlySpreadsheetId = getMonthlySpreadsheetId(targetDate);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`;

    const sheetName = formatDateToSheetName(targetDate);
    const sourceRange = quantitySheet.getRange('A1:D12');
    const sourceData = sourceRange.getValues();

    const monthlySpreadsheet = SpreadsheetApp.openById(monthlySpreadsheetId);
    const targetSheet = monthlySpreadsheet.getSheetByName(sheetName);

    if (!targetSheet) {
      Logger.log(`오류: '${sheetName}' 시트를 찾을 수 없습니다.`);
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `❌ '${sheetName}' 시트를 찾을 수 없습니다.\n\n${yearMonth}수량표에 해당 시트가 있는지 확인해주세요.`,
        '수량표 전송 실패', 5
      );
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
      '수량표 전송 완료', 3
    );

  } catch (error) {
    Logger.log("transferQuantityToMonthlySheet 에러: " + error.toString());
    SpreadsheetApp.getActiveSpreadsheet().toast(`❌ 수량표 전송 실패\n\n${error.message}`, '오류', 5);
  }
}

function formatDateToSheetName(date) {
  const year = date.getFullYear().toString();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return `${year}${month}${day}${dayNames[date.getDay()]}`;
}

// ========================================
// 구매주문서 주문전송
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
      if (match) {
        dateRaw = new Date(parseInt(match[1]), parseInt(match[2]) - 1, parseInt(match[3]));
      } else {
        dateRaw = new Date(dateRaw);
      }
    } else {
      dateRaw = new Date(dateRaw);
    }
    if (isNaN(dateRaw.getTime())) throw new Error('❌ 배송날짜 형식이 올바르지 않습니다.');
  }

  const orderDate    = sheet.getRange('C5').getValue();
  const timeRaw      = sheet.getRange('C7').getDisplayValue();
  const deliveryMethod = sheet.getRange('C8').getValue();
  const orderer      = sheet.getRange('E6').getValue();
  const ordererTel   = sheet.getRange('E7').getValue();
  const recipient    = sheet.getRange('E8').getValue();
  const recipientTel = sheet.getRange('E9').getValue();
  const phraseNo     = sheet.getRange('C10').getValue();
  const phraseText   = sheet.getRange('E10').getValue();
  const payMethod    = sheet.getRange('E5').getValue();
  const address      = sheet.getRange('C11').getValue();
  const memo         = sheet.getRange('C12').getValue();
  const products     = sheet.getRange('C15:D33').getValues().filter(r => r[0]);
  const productNamesRaw = sheet.getRange('B15:B33').getValues().flat().filter(n => n);

  if (!orderer || !dateRaw) throw new Error('❌ 주문자 또는 배송일 누락');

  const [h, m] = parseKoreanTimeString(timeRaw);
  const start = new Date(dateRaw); start.setHours(h, m);
  const end = new Date(start);

  const title = `${address} - 주문자: ${orderer}`;
  const desc = buildEventDescription({
    orderer, ordererTel, recipient, recipientTel,
    phraseNo, phraseText, payMethod, address, h, m,
    deliveryMethod, memo, productNames: productNamesRaw, products
  });

  const event = cal.createEvent(title, start, end, { description: desc, location: address });
  const eventId = event.getId();

  const formattedDate = Utilities.formatDate(dateRaw, Session.getScriptTimeZone(), 'yyyyMMdd');
  const cleanOrderer = orderer.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim();
  const newFileName = `${formattedDate}_${cleanOrderer}`;

  saveEstimatePdf('견적서', newFileName, FOLDER_IDS.ESTIMATE);
  saveEstimatePdf('구매주문서', `${newFileName}_주문서`, FOLDER_IDS.ORDER);
  saveSheetCopy(newFileName, FOLDER_IDS.SHEET_COPY);

  transferQuantityToMonthlySheet(dateRaw);

  // 히스토리 저장
  const priceValues = [];
  const productNamesArr = [];
  const productCompsArr = [];
  const quantitiesArr = [];

  const bValues = sheet.getRange('B15:E33').getValues();
  let currentProductName = '';
  let currentComps = [];
  let currentQtys = [];
  let currentPrice = '';

  for (let i = 0; i < bValues.length; i++) {
    const bVal = bValues[i][0];
    const cVal = bValues[i][1];
    const dVal = bValues[i][2];
    const eVal = bValues[i][3];

    if (bVal) {
      if (currentProductName) {
        productNamesArr.push(currentProductName);
        productCompsArr.push(currentComps.join('|'));
        quantitiesArr.push(currentQtys.join('|'));
        priceValues.push(currentPrice);
      }
      currentProductName = bVal;
      currentComps = cVal ? [cVal] : [];
      currentQtys = dVal !== '' ? [dVal] : [];
      currentPrice = eVal || '';
    } else if (cVal && currentProductName) {
      currentComps.push(cVal);
      currentQtys.push(dVal !== '' ? dVal : '');
    }
  }
  if (currentProductName) {
    productNamesArr.push(currentProductName);
    productCompsArr.push(currentComps.join('|'));
    quantitiesArr.push(currentQtys.join('|'));
    priceValues.push(currentPrice);
  }

  // A1/A2에 이벤트ID/파일명 저장
  sheet.getRange('A1').setValue(eventId);
  sheet.getRange('A2').setValue(newFileName);
  fixRowHeight();

  saveOrderHistory({
    orderDate,
    deliveryDate: dateRaw,
    deliveryTime: timeRaw,
    deliveryMethod,
    orderer,
    ordererTel,
    recipient,
    recipientTel,
    phraseNo,
    phraseText,
    payMethod,
    address,
    memo,
    productNames: productNamesArr.join('||'),
    productCompositions: productCompsArr.join('||'),
    quantities: quantitiesArr.join('||'),
    prices: priceValues.join('||'),
    eventId,
    fileName: newFileName
  });

  // 입력 필드 초기화
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
}

// ▶ "오전/오후 hh:mm" 파싱
function parseKoreanTimeString(str) {
  const isPM = str.includes('오후');
  const match = str.match(/(\d+):(\d+)/);
  if (!match) throw new Error('시간 형식 오류: ' + str);
  let h = parseInt(match[1], 10), m = parseInt(match[2], 10);
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return [h, m];
}

// ▶ 특정 시트만 PDF로 export → 지정 폴더에 저장
function saveEstimatePdf(sheetName, fileName, folderId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const folder = DriveApp.getFolderById(folderId);
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error(`시트를 찾을 수 없음: ${sheetName}`);

  const opts = [
    'format=pdf', 'size=A4', 'portrait=true', 'fitw=true',
    'sheetnames=false', 'printtitle=false', 'pagenumbers=false',
    'gridlines=false', `gid=${sheet.getSheetId()}`
  ].join('&');

  const baseUrl = ss.getUrl().replace(/\/edit.*$/, '');
  const exportUrl = `${baseUrl}/export?${opts}`;

  const blob = UrlFetchApp.fetch(exportUrl, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() }
  }).getBlob().setName(`${fileName}.pdf`);

  folder.createFile(blob);
}

// ▶ 시트 사본 저장
function saveSheetCopy(fileName, folderId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const folder = DriveApp.getFolderById(folderId);
  const copy = ss.copy(`${fileName}`);
  const file = DriveApp.getFileById(copy.getId());
  folder.addFile(file);
  DriveApp.getRootFolder().removeFile(file);
  return copy;
}

// ========================================
// ▶▶▶ onOpen 함수 ◀◀◀
// ========================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🧾 주문 관리')
    .addItem('주문전송', 'sendOrder')
    .addItem('수정전송', 'modifyOrder')
    .addItem('불러오기', 'loadOrder')
    .addToUi();
}
