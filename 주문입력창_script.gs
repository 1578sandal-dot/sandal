// ========================================
// 통합 Apps Script 코드 (최종 버전)
// - 구매주문서 자동화
// - 수량표 데이터 전송 (월별 자동 선택)
// ========================================

// ========================================
// 월별 스프레드시트 설정
// ========================================

const MONTHLY_SPREADSHEET_IDS = {
  '202511': '1CQAUYtRcu741qGuVz_e9VGO7I01ITdLAo1VP9mqWtrU',  // 2025년 11월
  '202512': '1j4N6puFEb5CcSZezQ8P4r1qDf0Q0PYYgFVdjO9h-BEg',  // 2025년 12월
  '202601': '1DljpCMigcTLty-m-MviunIp0pOVhcH1vT3R7SSfEDTo',  // 2026년 1월
  '202602': '1vHBnPp3a4zQimJI9WdRf9CSjmzhzhXPXH6pBLqxCh3Y',  // 2026년 2월
  '202603': '19urkmEur3NUbruBzqfM8g_uFeyPK0Cmr6mltnT9qp30',  // 2026년 3월
  // 필요한 달 계속 추가...
};

/**
 * 배송 날짜에 해당하는 월별 스프레드시트 ID를 반환합니다.
 * @param {Date} date - 배송 날짜
 * @returns {string} 스프레드시트 ID
 */
function getMonthlySpreadsheetId(date) {
  // 날짜 유효성 검사
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error(
      '❌ 유효하지 않은 날짜입니다.\n\n' +
      '배송 날짜가 올바르게 설정되었는지 확인해주세요.'
    );
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
// ▶▶▶ onEdit 함수 (통합) ◀◀◀
// ========================================

function onEdit(e) {
  if (!e) return;

  try {
    const sheet = e.source.getActiveSheet();
    const editedCell = e.range;
    const sheetName = sheet.getName();

    // 1) 구매주문서 시트: 제품명 입력 시 구성 자동 삽입
    if (sheetName === '구매주문서') {
      handlePurchaseOrderEdit(e, sheet, editedCell);
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

  // C/E 열 초기화
  sheet.getRange(row, 3, 구성들.length, 1).clearContent();
  sheet.getRange(row, 5, 구성들.length, 1).clearContent();

  // 구성과 가격 채우기
  구성들.forEach((item, i) => {
    if (!item) return;
    // C열(구성) 입력
    sheet.getRange(row + i, 3).setValue(item);
    // E열(단가)는 첫 줄(i===0)만 입력
    if (i === 0) {
      sheet.getRange(row + i, 5).setValue(price);
    }
  });
}

// ========================================
// 수량표 데이터 전송 함수 (개선 버전)
// ========================================

/**
 * 주문 전송 시 자동으로 수량표를 월별 수량표로 전송합니다.
 * @param {Date} deliveryDate - 배송 날짜
 */
function transferQuantityToMonthlySheet(deliveryDate) {
  try {
    Logger.log("=== 수량표 전송 시작 ===");
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const quantitySheet = ss.getSheetByName('수량표전송');

    if (!quantitySheet) {
      Logger.log("오류: 수량표전송 시트를 찾을 수 없습니다.");
      return;
    }
    Logger.log("1. 수량표전송 시트 찾기: 성공");

    // 수량표전송 시트의 B2에서 날짜 읽기
    const dateInB2 = quantitySheet.getRange('B2').getValue();

    // 날짜 파싱 함수
    function parseToDate(value) {
      if (value instanceof Date) {
        return value;
      }

      if (typeof value === 'string') {
        // 한국어 날짜 형식 파싱 (예: "2025년 11월 18일 화요일")
        const match = value.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
        if (match) {
          const year = parseInt(match[1], 10);
          const month = parseInt(match[2], 10) - 1;
          const day = parseInt(match[3], 10);
          return new Date(year, month, day);
        }
        // 일반 문자열 파싱
        return new Date(value);
      }

      if (typeof value === 'number') {
        return new Date(value);
      }

      return null;
    }

    // 날짜 파싱
    let targetDate = parseToDate(deliveryDate);

    // deliveryDate가 유효하지 않으면 B2에서 읽은 날짜 사용
    if (!targetDate || isNaN(targetDate.getTime())) {
      targetDate = parseToDate(dateInB2);
    }

    // 날짜 유효성 검증
    if (!targetDate || isNaN(targetDate.getTime())) {
      Logger.log("오류: 유효한 배송 날짜를 찾을 수 없습니다.");
      SpreadsheetApp.getActiveSpreadsheet().toast(
        "❌ 유효한 배송 날짜를 찾을 수 없습니다.",
        "수량표 전송 실패",
        5
      );
      return;
    }
    Logger.log("2. 배송 날짜: " + targetDate);
    Logger.log("   - 연도: " + targetDate.getFullYear());
    Logger.log("   - 월: " + (targetDate.getMonth() + 1));
    Logger.log("   - 일: " + targetDate.getDate());
    Logger.log("   - 요일: " + targetDate.getDay());

    // ✅ 날짜에 맞는 월별 스프레드시트 ID 자동 선택
    const monthlySpreadsheetId = getMonthlySpreadsheetId(targetDate);
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const yearMonth = `${year}${month}`;
    Logger.log(`3. 대상 스프레드시트: ${yearMonth}수량표 (ID: ${monthlySpreadsheetId})`);

    // 날짜를 "251130일요일" 형식으로 변환 (2자리 연도만 사용)
    const sheetName = formatDateToSheetName(targetDate);
    Logger.log("4. 대상 시트명: " + sheetName);

    // A1:D12 데이터 복사 (원본 범위)
    const sourceRange = quantitySheet.getRange('A1:D12');
    const sourceData = sourceRange.getValues();
    Logger.log("5. 원본 데이터 읽기: 성공");

    // 월별 수량표 스프레드시트 열기
    Logger.log("6. 대상 스프레드시트 열기 시도...");
    const monthlySpreadsheet = SpreadsheetApp.openById(monthlySpreadsheetId);
    Logger.log("7. 대상 스프레드시트 열기: 성공");

    // 해당 날짜 시트 찾기
    Logger.log("8. 시트 찾기 시도: " + sheetName);
    const targetSheet = monthlySpreadsheet.getSheetByName(sheetName);

    if (!targetSheet) {
      Logger.log(`오류: '${sheetName}' 시트를 찾을 수 없습니다.`);
      SpreadsheetApp.getActiveSpreadsheet().toast(
        `❌ '${sheetName}' 시트를 찾을 수 없습니다.\n\n${yearMonth}수량표에 해당 시트가 있는지 확인해주세요.`,
        "수량표 전송 실패",
        5
      );
      return;
    }
    Logger.log("9. 대상 시트 찾기: 성공");

    // 110행부터 시작해서 마지막 데이터 블록 찾기
    let startRow = 110;

    // 한 번에 A열 전체 데이터 가져오기 (API 호출 최소화)
    Logger.log("10. A열 데이터 읽기 시도...");
    const maxCheckRow = Math.min(targetSheet.getMaxRows(), 500); // 최대 500행까지만 확인
    const aColumnValues = targetSheet.getRange(startRow, 1, maxCheckRow - startRow + 1, 1).getValues();
    Logger.log("11. A열 데이터 읽기: 성공 (" + aColumnValues.length + "행)");

    // 마지막 데이터 블록 찾기 (17행 단위로 체크)
    let lastDataRow = startRow;
    for (let offset = 0; offset <= aColumnValues.length - 12; offset += 17) {
      // 현재 블록에 데이터가 있는지 확인
      let hasData = false;
      for (let i = 0; i < 12; i++) {
        const cellValue = aColumnValues[offset + i][0];
        if (cellValue !== null && cellValue !== undefined && cellValue !== '') {
          hasData = true;
          break;
        }
      }

      // 데이터가 있으면 마지막 위치 업데이트
      if (hasData) {
        lastDataRow = startRow + offset;
      }
    }

    // 마지막 데이터 다음 블록에 추가 (17행 간격)
    const currentRow = lastDataRow + 17;
    Logger.log("12. 데이터 추가 위치: " + currentRow + "행 (마지막 데이터: " + lastDataRow + "행)");

    // 데이터 복사 (단순하게)
    Logger.log("13. 데이터 복사 시작: " + currentRow + "행");
    targetSheet.getRange(currentRow, 1, 12, 4).setValues(sourceData);

    // 데이터 반영 대기
    Utilities.sleep(1000);

    Logger.log("14. 데이터 복사 완료");
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `✅ 수량표 데이터가 '${yearMonth}수량표 > ${sheetName}' 시트 ${currentRow}행에 저장되었습니다!`,
      "수량표 전송 완료",
      3
    );

  } catch (error) {
    Logger.log("transferQuantityToMonthlySheet 에러: " + error.toString());

    // 에러 메시지 개선 (실제 에러 표시)
    SpreadsheetApp.getActiveSpreadsheet().toast(
      `❌ 수량표 전송 실패\n\n${error.message}`,
      "오류",
      5
    );
  }
}

// ▶ 날짜를 "251210수요일" 형식으로 변환 (2자리 연도)
function formatDateToSheetName(date) {
  const year = date.getFullYear().toString().slice(2); // "25" (2자리)
  const month = String(date.getMonth() + 1).padStart(2, '0'); // "12"
  const day = String(date.getDate()).padStart(2, '0'); // "10"

  const dayOfWeek = date.getDay();
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = dayNames[dayOfWeek];

  return `${year}${month}${day}${dayName}`;  // "251210수요일"
}

// ▶ 수동으로 수량표 데이터 전송 (메뉴에서 실행)
function transferQuantityData() {
  try {
    // 원본 스프레드시트 (데이터를 가져올 곳)
    var sourceSpreadsheetId = "1B3TldmH1d7tBiXSR2bbgKCGk3ccEVfTbcu9pOP6GGv0";
    var sourceSheetName = "수량표전송";

    // 대상 스프레드시트 (데이터를 보낼 곳)
    var targetSpreadsheetId = "1CQAUYtRcu741qGuVz_e9VGO7I01ITdLAo1VP9mqWtrU";
    var targetSheetName = "수량표전송"; // 대상 시트 이름 (필요시 변경)

    // 원본 스프레드시트 및 시트 열기
    var sourceSpreadsheet = SpreadsheetApp.openById(sourceSpreadsheetId);
    var sourceSheet = sourceSpreadsheet.getSheetByName(sourceSheetName);

    if (!sourceSheet) {
      SpreadsheetApp.getUi().alert("원본 시트 '" + sourceSheetName + "'를 찾을 수 없습니다.");
      return;
    }

    // 대상 스프레드시트 및 시트 열기
    var targetSpreadsheet = SpreadsheetApp.openById(targetSpreadsheetId);
    var targetSheet = targetSpreadsheet.getSheetByName(targetSheetName);

    if (!targetSheet) {
      // 시트가 없으면 생성
      targetSheet = targetSpreadsheet.insertSheet(targetSheetName);
    }

    // 원본 데이터 가져오기
    var lastRow = sourceSheet.getLastRow();
    var lastCol = sourceSheet.getLastColumn();

    if (lastRow === 0 || lastCol === 0) {
      SpreadsheetApp.getUi().alert("원본 시트에 데이터가 없습니다.");
      return;
    }

    var sourceData = sourceSheet.getRange(1, 1, lastRow, lastCol).getValues();
    var sourceFormats = sourceSheet.getRange(1, 1, lastRow, lastCol).getNumberFormats();

    // 대상 시트 초기화 (기존 데이터 삭제)
    targetSheet.clear();

    // 데이터 붙여넣기
    targetSheet.getRange(1, 1, lastRow, lastCol).setValues(sourceData);
    targetSheet.getRange(1, 1, lastRow, lastCol).setNumberFormats(sourceFormats);

    // 열 너비 복사 (선택사항)
    for (var col = 1; col <= lastCol; col++) {
      var columnWidth = sourceSheet.getColumnWidth(col);
      targetSheet.setColumnWidth(col, columnWidth);
    }

    // 완료 메시지
    SpreadsheetApp.getActiveSpreadsheet().toast(
      "'" + sourceSheetName + "' 데이터가 성공적으로 전송되었습니다! (" + lastRow + "행 × " + lastCol + "열)",
      "전송 완료",
      5
    );

    Logger.log("데이터 전송 완료: " + lastRow + "행 × " + lastCol + "열");

  } catch (error) {
    SpreadsheetApp.getUi().alert("오류 발생: " + error.toString());
    Logger.log("transferQuantityData 에러: " + error.toString());
  }
}

// ========================================
// 구매주문서 관련 함수들
// ========================================

/**
 * 주문서 → 캘린더 이벤트 생성 & 견적서 + 주문서 PDF 저장
 */
function sendOrder() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('구매주문서');
  const cal = CalendarApp.getCalendarById('1578sandal@gmail.com');

  // 주문 정보 읽기 (✅ 이미지 기준 올바른 셀 범위)
  let dateRaw = sheet.getRange('C6').getValue();      // 배송날짜

  // 날짜 유효성 검사 및 변환
  if (!dateRaw) {
    throw new Error('❌ 배송날짜가 입력되지 않았습니다. C6 셀을 확인해주세요.');
  }

  // 날짜가 Date 객체가 아니면 변환 시도
  if (!(dateRaw instanceof Date)) {
    // 한국어 날짜 문자열 파싱 (예: "2025년 11월 18일 화요일")
    if (typeof dateRaw === 'string') {
      const match = dateRaw.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
      if (match) {
        const year = parseInt(match[1], 10);
        const month = parseInt(match[2], 10) - 1; // JavaScript는 0-based
        const day = parseInt(match[3], 10);
        dateRaw = new Date(year, month, day);
      } else {
        // 일반 문자열로 파싱 시도
        dateRaw = new Date(dateRaw);
      }
    } else {
      // 숫자나 다른 형식이면 Date 객체로 변환
      dateRaw = new Date(dateRaw);
    }

    // 변환 실패시 오류 발생
    if (isNaN(dateRaw.getTime())) {
      throw new Error('❌ 배송날짜 형식이 올바르지 않습니다. C6 셀을 확인해주세요.');
    }
  }

  const timeRaw = sheet.getRange('C7').getDisplayValue(); // 배송시간
  const deliveryMethod = sheet.getRange('C8').getValue(); // 배송방식
  const orderer = sheet.getRange('E6').getValue();        // 주문자
  const ordererTel = sheet.getRange('E7').getValue();     // 주문자 연락처
  const recipient = sheet.getRange('E8').getValue();      // 수령인
  const recipientTel = sheet.getRange('E9').getValue();  // 수령인 연락처
  const phraseNo = sheet.getRange('C10').getValue();      // 문구번호
  const phraseText = sheet.getRange('E10').getValue();    // 문구내용
  const payMethod = sheet.getRange('E5').getValue();      // 결제방식
  const address = sheet.getRange('C11').getValue();       // 배송주소
  const memo = sheet.getRange('C12').getValue();          // 배송메세지
  const products = sheet.getRange('C15:D33').getValues().filter(r => r[0]);
  const productNames = sheet.getRange('B15:B33').getValues().flat().filter(name => name);

  if (!orderer || !dateRaw) {
    throw new Error('❌ 주문자 또는 배송일 누락');
  }

  // 시간 파싱
  const [h, m] = parseKoreanTimeString(timeRaw);
  const start = new Date(dateRaw); start.setHours(h, m);
  const end = new Date(start);

  // 캘린더 이벤트 생성
  const title = `${address} - 주문자: ${orderer}`;
  let desc = `📦 주문 정보\n`
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
           + (memo ? `- 메모: ${memo}\n` : ``)
           + (productNames.length > 0
              ? `\n📄 제품명:\n` + productNames.map(name => `• ${name}`).join('\n') + `\n`
              : ``)
           + `\n📄 제품 구성:\n`
           + products.map(([n,q]) => `• ${n} x ${q}`).join('\n') + `\n\n`
           + `★ 스토어주문서는 예약주문건이라 미리 배송을 눌러두는 점 양해 부탁드립니다!\n`
           + `★ 배송은 차량으로 배송하기에 정확한 배송은 어려우나, 늦지 않게 예약된 시간 즈음으로 도착합니다.`;

  cal.createEvent(title, start, end, {
    description: desc,
    location: address
  });

  // PDF 저장
  const formattedDate = Utilities.formatDate(dateRaw, Session.getScriptTimeZone(), 'yyyyMMdd');
  const cleanOrderer = orderer.replace(/[\/\\\:\*\?\"\<\>\|]/g, '').trim();
  const newFileName = `${formattedDate}_${cleanOrderer}`;

  saveEstimatePdf('견적서', newFileName, FOLDER_IDS.ESTIMATE);
  saveEstimatePdf('구매주문서', `${newFileName}_주문서`, FOLDER_IDS.ORDER);
  saveSheetCopy(newFileName, FOLDER_IDS.SHEET_COPY);

  // ✅ 수량표 데이터를 월별 수량표로 전송 (자동 선택)
  transferQuantityToMonthlySheet(dateRaw);

  // 입력 필드 초기화 (✅ 이미지 기준 올바른 범위)
  sheet.getRange('C5').clearContent();  // 주문날짜
  sheet.getRange('C6').clearContent();  // 배송날짜
  sheet.getRange('C7').clearContent();  // 배송시간
  sheet.getRange('C10').clearContent(); // 문구번호
  sheet.getRange('C11').clearContent(); // 배송주소
  sheet.getRange('C12').clearContent(); // 배송메세지
  sheet.getRange('E5:E10').clearContent(); // 결제방식~문구내용
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
    'format=pdf',
    'size=A4',
    'portrait=true',
    'fitw=true',
    'sheetnames=false',
    'printtitle=false',
    'pagenumbers=false',
    'gridlines=false',
    `gid=${sheet.getSheetId()}`
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

  // 현재 스프레드시트의 사본 생성
  const copy = ss.copy(`${fileName}`);

  // 생성된 파일을 지정 폴더로 이동
  const file = DriveApp.getFileById(copy.getId());
  folder.addFile(file);

  // 원본 위치(내 드라이브)에서 제거
  DriveApp.getRootFolder().removeFile(file);

  return copy;
}

// ▶ 주문 버튼 만드는 방법 안내
function createOrderButton() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('구매주문서');

  // 기존 이미지/도형 삭제 (중복 방지)
  const drawings = sheet.getDrawings();
  drawings.forEach(drawing => drawing.remove());

  SpreadsheetApp.getUi().alert(
    '버튼 만들기',
    '1. 삽입 > 이미지 또는 도형 선택\n' +
    '2. 원하는 버튼 이미지/도형 추가\n' +
    '3. 이미지 클릭 > ⋮ > 스크립트 할당\n' +
    '4. "sendOrder" 입력 후 확인',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ========================================
// ▶▶▶ onOpen 함수 (통합) ◀◀◀
// ========================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  // 📦 주문 관리 메뉴
  ui.createMenu('📦 주문 관리')
    .addItem('주문 전송하기', 'sendOrder')
    .addItem('버튼 만드는 방법', 'createOrderButton')
    .addSeparator()
    .addItem('수량표 데이터 전송', 'transferQuantityData')
    .addToUi();
}
