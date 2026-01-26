// ========================================
// 설정 및 상수 (2025.12 버전)
// ========================================

const CONFIG = {
  COLUMNS: {
    PRODUCT_NAME_1: 2,        // B열
    PRODUCT_NAME_2: 3,        // C열
    MOVE_TRIGGER: 5,          // E열
    DATE_COLUMN: 2,           // B열 (날짜)
  },
  DB: {
    SHEET_NAME: '제품DB',
    PRODUCT_NAME_COL: 2,      // C열 (0-based index)
    COMPONENT_START_COL: 4,   // E열 (0-based index)
    COMPONENT_END_COL: 8,     // I열 (0-based index)
  },
  ORDER: {
    BLOCK_SIZE: 12,           // 주문 블록 행 수
    TARGET_ROW: 100,          // 이동 시 삽입될 행 (100행부터 시작)
    MOVE_KEYWORD: '당일',
  },
  FORMAT: {
    DEFAULT_COLS: 5,          // A~E열
    DATE_FORMAT: 'yyyy. M. d',
  },
};

// 제품 DB 캐시 (성능 최적화)
let productCache = null;
let productCacheTime = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5분

// ========================================
// 메인 트리거 함수
// ========================================

/**
 * 셀 편집 시 자동 실행되는 트리거 함수
 * @param {Object} e - 이벤트 객체
 */
function onEdit(e) {
  // e 객체가 없으면 종료 (수동 실행 방지)
  if (!e || !e.range) {
    Logger.log("onEdit 트리거가 아닙니다.");
    return;
  }

  try {
    const sheet = e.range.getSheet();
    const row = e.range.getRow();
    const col = e.range.getColumn();
    const value = e.value;

    // B열 또는 C열에 제품명 입력 시 구성정보 자동입력
    if (col === CONFIG.COLUMNS.PRODUCT_NAME_1 || col === CONFIG.COLUMNS.PRODUCT_NAME_2) {
      handleProductNameInput(e, sheet, row, col);
    }

    // E열에 "당일" 입력 시 다음날로 이동
    if (col === CONFIG.COLUMNS.MOVE_TRIGGER && value === CONFIG.ORDER.MOVE_KEYWORD) {
      moveOrderToNextDay(sheet, row);
    }
  } catch (error) {
    Logger.log('onEdit 에러: ' + error.toString());
  }
}

// ========================================
// 제품 정보 자동입력 기능
// ========================================

/**
 * 제품명 입력 시 구성정보를 자동으로 입력합니다.
 * @param {Object} e - 이벤트 객체
 * @param {Sheet} sheet - 현재 시트
 * @param {number} row - 행 번호
 * @param {number} col - 열 번호
 */
function handleProductNameInput(e, sheet, row, col) {
  const productName = e.value;

  // 제품명이 비어있으면 종료
  if (!productName || productName.toString().trim() === '') {
    return;
  }

  try {
    // 제품 DB에서 정보 조회
    const components = getProductComponents(productName);

    // 제품이 없거나 구성정보가 없으면 종료
    if (!components || components.length === 0) {
      return;
    }

    // 기존 데이터 삭제 (구성정보가 들어갈 범위)
    sheet.getRange(row + 1, col, components.length, 1).clearContent();

    // 새로운 구성정보 입력
    const values = components.map(item => [item]);
    sheet.getRange(row + 1, col, components.length, 1).setValues(values);

  } catch (error) {
    Logger.log('제품 정보 입력 에러: ' + error.toString());
  }
}

/**
 * 제품 DB에서 제품의 구성정보를 조회합니다. (캐싱 적용)
 * @param {string} productName - 제품명
 * @returns {Array<string>} 구성정보 배열
 */
function getProductComponents(productName) {
  const trimmedName = productName.toString().trim();

  // 캐시 갱신 확인 (5분마다)
  const now = Date.now();
  if (!productCache || !productCacheTime || (now - productCacheTime > CACHE_DURATION)) {
    refreshProductCache();
  }

  // 캐시에서 제품 조회
  return productCache.get(trimmedName) || null;
}

/**
 * 제품 DB 캐시를 갱신합니다.
 */
function refreshProductCache() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dbSheet = ss.getSheetByName(CONFIG.DB.SHEET_NAME);

  if (!dbSheet) {
    throw new Error(`"${CONFIG.DB.SHEET_NAME}" 시트를 찾을 수 없습니다.`);
  }

  const dbData = dbSheet.getDataRange().getValues();
  productCache = new Map();

  // 제품 DB를 Map으로 변환 (O(1) 조회 성능)
  for (let i = 1; i < dbData.length; i++) {
    const productName = dbData[i][CONFIG.DB.PRODUCT_NAME_COL];

    if (!productName || productName.toString().trim() === '') {
      continue;
    }

    // E~I열(index 4~8)에서 구성정보 추출
    const components = [];
    for (let j = CONFIG.DB.COMPONENT_START_COL; j <= CONFIG.DB.COMPONENT_END_COL; j++) {
      if (dbData[i][j] && dbData[i][j].toString().trim() !== '') {
        components.push(dbData[i][j]);
      }
    }

    if (components.length > 0) {
      productCache.set(productName.toString().trim(), components);
    }
  }

  productCacheTime = Date.now();
}

// ========================================
// 주문 이동 기능
// ========================================

/**
 * 주문 정보를 다음날 시트로 이동합니다.
 * @param {Sheet} sourceSheet - 원본 시트
 * @param {number} startRow - 시작 행
 */
function moveOrderToNextDay(sourceSheet, startRow) {
  try {
    // 다음날 시트 정보 가져오기
    const nextSheetInfo = getNextDaySheetInfo(sourceSheet.getName());
    const spreadsheet = sourceSheet.getParent();
    const targetSheet = spreadsheet.getSheetByName(nextSheetInfo.sheetName);

    if (!targetSheet) {
      throw new Error(`다음날 시트를 찾을 수 없습니다: ${nextSheetInfo.sheetName}`);
    }

    // 원본 데이터 복사 (행 삽입 전에 수행)
    const lastCol = sourceSheet.getLastColumn();
    const sourceRange = sourceSheet.getRange(startRow, 1, CONFIG.ORDER.BLOCK_SIZE, lastCol);

    // 모든 데이터와 서식 복사
    const copiedValues = sourceRange.getValues();
    const copiedFormulas = sourceRange.getFormulas();
    const copiedFormats = sourceRange.getNumberFormats();
    const copiedBackgrounds = sourceRange.getBackgrounds();
    const copiedFontColors = sourceRange.getFontColors();
    const copiedFontWeights = sourceRange.getFontWeights();
    const copiedFontSizes = sourceRange.getFontSizes();
    const copiedFontFamilies = sourceRange.getFontFamilies();
    const copiedHorizontalAlignments = sourceRange.getHorizontalAlignments();
    const copiedVerticalAlignments = sourceRange.getVerticalAlignments();
    const copiedWrapStrategies = sourceRange.getWrapStrategies();
    const copiedTextStyles = sourceRange.getTextStyles();

    // 대상 시트에 행 삽입
    targetSheet.insertRowsBefore(CONFIG.ORDER.TARGET_ROW, CONFIG.ORDER.BLOCK_SIZE);

    // 복사한 데이터를 새로 삽입된 행에 붙여넣기
    const targetRange = targetSheet.getRange(CONFIG.ORDER.TARGET_ROW, 1, CONFIG.ORDER.BLOCK_SIZE, lastCol);

    // 값과 수식 적용 (수식이 있으면 수식, 없으면 값)
    for (let i = 0; i < CONFIG.ORDER.BLOCK_SIZE; i++) {
      for (let j = 0; j < lastCol; j++) {
        if (copiedFormulas[i][j]) {
          targetRange.getCell(i + 1, j + 1).setFormula(copiedFormulas[i][j]);
        } else {
          targetRange.getCell(i + 1, j + 1).setValue(copiedValues[i][j]);
        }
      }
    }

    // 모든 서식 적용
    targetRange.setNumberFormats(copiedFormats);
    targetRange.setBackgrounds(copiedBackgrounds);
    targetRange.setFontColors(copiedFontColors);
    targetRange.setFontWeights(copiedFontWeights);
    targetRange.setFontSizes(copiedFontSizes);
    targetRange.setFontFamilies(copiedFontFamilies);
    targetRange.setHorizontalAlignments(copiedHorizontalAlignments);
    targetRange.setVerticalAlignments(copiedVerticalAlignments);
    targetRange.setWrapStrategies(copiedWrapStrategies);
    targetRange.setTextStyles(copiedTextStyles);

    // 테두리 복사 - copyTo를 사용하여 테두리까지 복사
    sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);

    // 원본 행 삭제
    sourceSheet.deleteRows(startRow, CONFIG.ORDER.BLOCK_SIZE);

    Browser.msgBox("주문 정보가 " + nextSheetInfo.sheetName + " 시트 " + CONFIG.ORDER.TARGET_ROW + "행으로 이동되었습니다.");

  } catch (error) {
    Browser.msgBox("오류 발생: " + error.toString());
  }
}

/**
 * 시트 이름에서 다음날 시트 정보를 계산합니다.
 * @param {string} sheetName - 현재 시트 이름
 * @returns {Object} 다음날 시트 정보 {sheetName, date}
 */
function getNextDaySheetInfo(sheetName) {
  const dateMatch = sheetName.match(/(\d{8})/);

  if (!dateMatch) {
    throw new Error('시트 이름에서 날짜를 찾을 수 없습니다. (형식: YYYYMMDD)');
  }

  const currentDate = dateMatch[1];
  const year = parseInt(currentDate.substring(0, 4), 10);
  const month = parseInt(currentDate.substring(4, 6), 10) - 1;
  const day = parseInt(currentDate.substring(6, 8), 10);

  const date = new Date(year, month, day);
  date.setDate(date.getDate() + 1);

  const nextYear = String(date.getFullYear());
  const nextMonth = String(date.getMonth() + 1).padStart(2, '0');
  const nextDay = String(date.getDate()).padStart(2, '0');
  const nextDateStr = `${nextYear}${nextMonth}${nextDay}`;

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysOfWeek[date.getDay()];
  const nextSheetName = `${nextDateStr}${dayOfWeek}요일`;

  return {
    sheetName: nextSheetName,
    date: date,
  };
}

// ========================================
// 서식 지정 함수
// ========================================

function applyFormatting() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const range = sheet.getActiveRange();

    if (!range) {
      Browser.msgBox("먼저 서식을 적용할 범위를 선택해주세요.");
      return;
    }

    const startRow = range.getRow();
    const startCol = range.getColumn();
    const numRows = range.getNumRows();
    const numCols = range.getNumColumns();

    // 1. 전체 범위에 테두리 적용
    range.setBorder(
      true, true, true, true, true, true,
      "black", SpreadsheetApp.BorderStyle.SOLID
    );

    // 2. B열의 날짜/시간 형식 변경
    if (startCol <= 2 && startCol + numCols - 1 >= 2) {
      const dateCell = sheet.getRange(startRow + 1, 2);
      dateCell.setNumberFormat("yyyy. m. d");

      const timeCell = sheet.getRange(startRow + 2, 2);
      const timeValue = timeCell.getValue();

      if (timeValue) {
        let timeText = '';

        if (timeValue instanceof Date) {
          const hours = timeValue.getHours();
          const minutes = timeValue.getMinutes();
          const period = hours >= 12 ? '오후' : '오전';
          const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
          timeText = `${period} ${displayHours}:${String(minutes).padStart(2, '0')}`;
        } else if (typeof timeValue === 'string') {
          timeText = timeValue.replace(/:\d{2}$/, '');
        }

        if (timeText) {
          timeCell.setNumberFormat('@');
          timeCell.setValue(timeText);
        }
      }
    }

    // 3. 가운데 정렬
    range.setHorizontalAlignment("center");
    range.setVerticalAlignment("middle");

    // 4. 텍스트 줄바꿈
    range.setWrap(true);

    Browser.msgBox("서식 지정이 완료되었습니다!");

  } catch (error) {
    Browser.msgBox("오류 발생: " + error.toString());
  }
}

function applyFormattingToBlock() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const activeCell = sheet.getActiveCell();

    if (!activeCell) {
      Browser.msgBox("셀을 선택해주세요.");
      return;
    }

    const startRow = activeCell.getRow();
    const range = sheet.getRange(startRow, 1, 12, 5);

    // 1. 테두리
    range.setBorder(
      true, true, true, true, true, true,
      "black", SpreadsheetApp.BorderStyle.SOLID
    );

    // 2. B열 날짜/시간 형식
    const dateCell = sheet.getRange(startRow + 1, 2);
    dateCell.setNumberFormat("yyyy. m. d");

    const timeCell = sheet.getRange(startRow + 2, 2);
    const timeValue = timeCell.getValue();

    if (timeValue) {
      let timeText = '';

      if (timeValue instanceof Date) {
        const hours = timeValue.getHours();
        const minutes = timeValue.getMinutes();
        const period = hours >= 12 ? '오후' : '오전';
        const displayHours = hours > 12 ? hours - 12 : (hours === 0 ? 12 : hours);
        timeText = `${period} ${displayHours}:${String(minutes).padStart(2, '0')}`;
      } else if (typeof timeValue === 'string') {
        timeText = timeValue.replace(/:\d{2}$/, '');
      }

      if (timeText) {
        timeCell.setNumberFormat('@');
        timeCell.setValue(timeText);
      }
    }

    // 3. 가운데 정렬
    range.setHorizontalAlignment("center");
    range.setVerticalAlignment("middle");

    // 4. 줄바꿈
    range.setWrap(true);

    Browser.msgBox(`${startRow}행부터 ${startRow + 11}행까지 서식이 적용되었습니다!`);

  } catch (error) {
    Browser.msgBox("오류 발생: " + error.toString());
  }
}

// ========================================
// 메뉴
// ========================================

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('📋 서식 도구')
    .addItem('선택 범위 서식 지정', 'applyFormatting')
    .addItem('12행 블록 서식 지정', 'applyFormattingToBlock')
    .addToUi();
}
