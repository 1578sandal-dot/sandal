/**
 * 오늘 처음했어
 *
 * 안전한 캘린더 이벤트 동기화 시스템 (이동 로직 개선)
 *
 * 수정 사항:
 * 1. "이동됨" 플래그를 블록의 첫 행에만 설정
 * 2. clearExistingData에서 블록 전체를 확인하여 보호
 */

const CONFIG = {
  ROOT_FOLDER: "SANDAL",
  SUB_FOLDER: "🔢작업수량리스트🔢",
  CAL_ID: "primary",
  MONTHS_TO_SYNC: 1,
  DATA_START_ROW: 130,
  EVENT_SPACING: 6,
  MOVE_DATA_SPACING: 5, // 데이터 이동 시 기존 데이터와의 간격
  WEEKDAYS: ["일", "월", "화", "수", "목", "금", "토"]
};

function 캘린더동기화() {
  try {
    console.log(`[${new Date().toISOString()}] 캘린더 동기화 시작 (9월30일+10월 처리)`);
    
    const tz = Session.getScriptTimeZone();
    const cal = getCalendar(CONFIG.CAL_ID);
    if (!cal) {
      throw new Error(`캘린더를 찾을 수 없습니다: ${CONFIG.CAL_ID}`);
    }

    // 9월 30일만 처리
    console.log(`9월 30일 처리 시작`);
    try {
      const result930 = processSpecificDate("20250930", cal, tz);
      if (result930.success) {
        console.log(`9월 30일 처리 완료 - 이벤트 ${result930.eventCount}개`);
      } else {
        console.error(`9월 30일 처리 실패: ${result930.error}`);
      }
    } catch (error) {
      console.error(`9월 30일 처리 중 예외 발생:`, error);
    }

    // 10월 전체 처리
    const target = "202510";
    console.log(`동기화 대상: ${target}`);
    
    try {
      const result = processMonth(target, cal, tz);
      if (result.success) {
        console.log(`${target} 처리 완료 - 이벤트 ${result.eventCount}개`);
      } else {
        console.error(`${target} 처리 실패: ${result.error}`);
      }
    } catch (error) {
      console.error(`${target} 처리 중 예외 발생:`, error);
    }

    console.log(`9월30일+10월 동기화 완료`);
    
  } catch (error) {
    console.error('캘린더 동기화 실패:', error);
    throw error;
  }
}

function processSpecificDate(dateString, cal, tz) {
  try {
    const year = parseInt(dateString.substring(0, 4));
    const month = parseInt(dateString.substring(4, 6));
    const day = parseInt(dateString.substring(6, 8));
    
    const targetDate = new Date(year, month - 1, day);
    const nextDay = new Date(year, month - 1, day + 1);
    
    console.log(`${dateString} 처리: ${targetDate.toDateString()}`);
    
    const fileName = `${dateString.substring(0, 6)}수량표`;
    const ss = openSpreadsheetByPath(CONFIG.ROOT_FOLDER, CONFIG.SUB_FOLDER, fileName);
    if (!ss) {
      return { success: false, error: `스프레드시트를 찾을 수 없습니다: ${fileName}` };
    }

    const events = cal.getEvents(targetDate, nextDay);
    console.log(`${dateString}: 총 ${events.length}개 이벤트`);

    if (events.length === 0) {
      return { success: true, eventCount: 0 };
    }

    const weekday = CONFIG.WEEKDAYS[targetDate.getDay()];
    const sheetName = `${dateString}${weekday}요일`;
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      console.warn(`시트를 찾을 수 없습니다: ${sheetName}`);
      return { success: false, error: `시트를 찾을 수 없습니다: ${sheetName}` };
    }

    console.log(`${sheetName}: 모든 이벤트 처리 - 총 ${events.length}개`);

    // 기존 데이터 정리 (개선된 로직)
    clearExistingData(sheet);

    // 모든 이벤트 처리
    let currentRow = CONFIG.DATA_START_ROW;
    events.forEach((ev, index) => {
      console.log(`${sheetName}: 이벤트 ${index + 1}/${events.length} 처리 - ${ev.getTitle()}`);
      currentRow = processEvent(sheet, ev, currentRow);
    });

    return { success: true, eventCount: events.length };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function processMonth(ym, cal, tz) {
  try {
    const fileName = `${ym}수량표`;
    const { firstDay, lastDay } = getMonthRange(ym);
    
    console.log(`${ym} 처리 시작: ${firstDay.toDateString()} ~ ${lastDay.toDateString()}`);
    
    const ss = openSpreadsheetByPath(CONFIG.ROOT_FOLDER, CONFIG.SUB_FOLDER, fileName);
    if (!ss) {
      return { success: false, error: `스프레드시트를 찾을 수 없습니다: ${fileName}` };
    }

    const events = cal.getEvents(firstDay, lastDay);
    const groupedEvents = groupEventsByDate(events, tz);
    
    console.log(`${ym}: 총 ${events.length}개 이벤트, ${Object.keys(groupedEvents).length}일`);

    // 날짜별 처리
    let totalProcessed = 0;
    for (const [dateKey, evs] of Object.entries(groupedEvents)) {
      try {
        const processed = processDateEvents(ss, dateKey, evs, tz);
        totalProcessed += processed;
      } catch (error) {
        console.error(`${dateKey} 처리 실패:`, error);
      }
    }

    return { success: true, eventCount: totalProcessed };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function processDateEvents(ss, dateKey, events, tz) {
  const weekday = CONFIG.WEEKDAYS[events[0].getStartTime().getDay()];
  const sheetName = `${dateKey}${weekday}요일`;
  const sheet = ss.getSheetByName(sheetName);
  
  if (!sheet) {
    console.warn(`시트를 찾을 수 없습니다: ${sheetName}`);
    return 0;
  }

  console.log(`${sheetName}: 모든 이벤트 처리 - 총 ${events.length}개`);

  // 기존 데이터 정리 (개선된 로직)
  clearExistingData(sheet);

  // 모든 이벤트 처리
  let currentRow = CONFIG.DATA_START_ROW;
  events.forEach((ev, index) => {
    console.log(`${sheetName}: 이벤트 ${index + 1}/${events.length} 처리 - ${ev.getTitle()}`);
    currentRow = processEvent(sheet, ev, currentRow);
  });

  return events.length;
}

/**
 * 개선된 데이터 정리 함수
 * - "이동됨" 플래그가 있는 블록 전체를 보호
 */
function clearExistingData(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < CONFIG.DATA_START_ROW) return;

  try {
    console.log(`${sheet.getName()}: 데이터 정리 시작 (보호된 블록 확인)`);
    
    // "이동됨" 플래그가 있는 블록의 범위를 찾기
    const protectedBlocks = findProtectedBlocks(sheet, lastRow);
    
    console.log(`${sheet.getName()}: ${protectedBlocks.length}개의 보호된 블록 발견`);
    
    // 각 행을 순회하며 정리
    for (let row = CONFIG.DATA_START_ROW; row <= lastRow; row++) {
      // 이 행이 보호된 블록에 속하는지 확인
      if (isRowInProtectedBlock(row, protectedBlocks)) {
        continue;
      }
      
      // 보호되지 않은 행은 데이터 확인 후 삭제
      const hasData = checkIfRowHasData(sheet, row);
      if (hasData) {
        clearRowData(sheet, row);
      }
    }
    
    console.log(`${sheet.getName()}: 보호된 데이터 정리 완료`);
    
  } catch (error) {
    console.error('보호된 데이터 정리 실패:', error);
  }
}

/**
 * "이동됨" 플래그가 있는 블록들의 범위를 찾기
 */
function findProtectedBlocks(sheet, lastRow) {
  const blocks = [];
  
  for (let row = CONFIG.DATA_START_ROW; row <= lastRow; row++) {
    const flagValue = sheet.getRange(row, 6).getValue();
    const flag = String(flagValue).trim();
    
    if (flag === "이동됨" || flag === "삭제됨") {
      // 이 행부터 시작하는 블록 찾기
      const blockEnd = findBlockEnd(sheet, row, lastRow);
      blocks.push({ start: row, end: blockEnd });
      console.log(`${sheet.getName()}: 보호된 블록 발견 ${row}~${blockEnd}행 (${flag})`);
      
      // 블록 끝까지 건너뛰기
      row = blockEnd;
    }
  }
  
  return blocks;
}

/**
 * 블록의 끝을 찾기 (데이터가 연속된 마지막 행)
 */
function findBlockEnd(sheet, startRow, lastRow) {
  let endRow = startRow;
  
  for (let row = startRow; row <= lastRow; row++) {
    const bValue = sheet.getRange(row, 2).getValue();
    const cValue = sheet.getRange(row, 3).getValue();
    
    if (bValue || cValue) {
      endRow = row;
    } else if (row > startRow) {
      // 빈 행을 만나면 블록 끝
      break;
    }
  }
  
  return endRow;
}

/**
 * 특정 행이 보호된 블록에 속하는지 확인
 */
function isRowInProtectedBlock(row, protectedBlocks) {
  return protectedBlocks.some(block => row >= block.start && row <= block.end);
}

// === 기존 함수들 ===

function getCalendar(calId) {
  try {
    return CalendarApp.getCalendarById(calId);
  } catch (error) {
    console.error(`캘린더 접근 실패 (${calId}):`, error);
    return null;
  }
}

function getMonthRange(ym) {
  const year = Number(ym.substring(0, 4));
  const month = Number(ym.substring(4, 6));
  
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0, 23, 59, 59);
  
  return { firstDay, lastDay };
}

function groupEventsByDate(events, tz) {
  const grouped = {};
  
  events.forEach(ev => {
    const dateKey = Utilities.formatDate(ev.getStartTime(), tz, "yyyyMMdd");
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(ev);
  });
  
  return grouped;
}

function checkIfRowHasData(sheet, row) {
  try {
    const bValue = sheet.getRange(row, 2).getValue();
    const cValue = sheet.getRange(row, 3).getValue();
    const dValue = sheet.getRange(row, 4).getValue();
    
    return !!(bValue || cValue || dValue);
  } catch (error) {
    console.error(`행 데이터 확인 실패 (${row}행):`, error);
    return false;
  }
}

function clearRowData(sheet, row) {
  try {
    const clearRange = sheet.getRange(row, 2, 1, 7);
    clearRange.clearContent();
    clearRange.clearFormat();
    
  } catch (error) {
    console.error(`행 데이터 삭제 실패 (${row}행):`, error);
  }
}

function processEvent(sheet, event, startRow) {
  try {
    const desc = event.getDescription() || "";
    const eventId = event.getId();
    const title = event.getTitle();
    
    console.log(`이벤트 처리: ${title} (시작행: ${startRow})`);

    const safeStartRow = findSafeStartRow(sheet, startRow);
    if (safeStartRow !== startRow) {
      console.log(`보호된 데이터로 인해 ${startRow} → ${safeStartRow}로 위치 조정`);
    }

    const parsedData = parseEventDescription(desc);
    
    if (parsedData.infoLines.length === 0 && parsedData.cdValues.length === 0) {
      parsedData.infoLines.push(title);
    }

    const rowsUsed = writeEventData(sheet, parsedData, safeStartRow, eventId);
    const nextRow = findNextAvailableRow(sheet, safeStartRow + rowsUsed);
    
    return nextRow;
    
  } catch (error) {
    console.error('이벤트 처리 실패:', error);
    return startRow + 1;
  }
}

function findSafeStartRow(sheet, preferredRow) {
  const lastRow = sheet.getLastRow();
  let checkRow = preferredRow;
  
  for (let i = 0; i < 50 && checkRow <= lastRow + 10; i++) {
    if (isRowProtected(sheet, checkRow)) {
      checkRow++;
      continue;
    }
    
    let hasProtectedInRange = false;
    for (let j = 0; j < 5; j++) {
      if (isRowProtected(sheet, checkRow + j)) {
        hasProtectedInRange = true;
        break;
      }
    }
    
    if (!hasProtectedInRange) {
      return checkRow;
    }
    
    checkRow += 5;
  }
  
  return Math.max(lastRow + 1, preferredRow);
}

function isRowProtected(sheet, row) {
  try {
    if (row < CONFIG.DATA_START_ROW) return false;
    
    const flagValue = sheet.getRange(row, 6).getValue();
    const flag = String(flagValue).trim();
    
    return flag === "이동됨" || flag === "삭제됨";
  } catch (error) {
    return false;
  }
}

function findNextAvailableRow(sheet, currentEndRow) {
  const spacing = CONFIG.EVENT_SPACING;
  let nextRow = currentEndRow + spacing;
  
  return findSafeStartRow(sheet, nextRow);
}

function parseEventDescription(desc) {
  const cleanDesc = (desc || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<b>|<\/b>/gi, "")
    .replace(/&nbsp;/gi, " ");
  
  const descLines = cleanDesc
    .split(/\r?\n/)
    .map(line => line.replace(/[•*\-📄]/g, "").trim())
    .filter(line => line.length > 0)
    .filter(line => !isNoticeMessage(line));

  const infoLines = [];
  const cdValues = [];
  let isProductSection = false;

  descLines.forEach((line, index) => {
    if (/^제품명\s*[:：]\s*/.test(line)) {
      const productName = line.replace(/^제품명\s*[:：]\s*/, "").trim();
      if (productName) {
        cdValues.push([productName, ""]);
      }
      isProductSection = true;
      return;
    }
    
    if (/^제품\s*구성\s*[:：]?\s*$/.test(line)) {
      isProductSection = true;
      return;
    }
    
    if (isProductSection) {
      const quantityPattern = /(.+?)\s*[×xX＊*]\s*(\d+)/;
      const match = line.match(quantityPattern);
      
      if (match) {
        const itemName = match[1].trim();
        const quantity = parseInt(match[2], 10);
        cdValues.push([itemName, quantity]);
      } else if (line.trim()) {
        cdValues.push([line.trim(), ""]);
      }
    } else {
      infoLines.push(line);
    }
  });

  return { infoLines, cdValues };
}

function isNoticeMessage(line) {
  if (line.includes('★')) {
    return true;
  }
  
  const noticePatterns = [
    /스토어주문서는\s*예약주문건/,
    /배송을\s*눌러두는\s*점\s*양해/,
    /차량으로\s*배송하기에/,
    /정확한\s*배송은\s*어려우나/,
    /예약된\s*시간\s*즈음으로/
  ];
  
  return noticePatterns.some(pattern => pattern.test(line));
}

function writeEventData(sheet, parsedData, startRow, eventId) {
  const { infoLines, cdValues } = parsedData;
  let maxRows = 0;

  try {
    if (infoLines.length > 0) {
      const bRange = sheet.getRange(startRow, 2, infoLines.length, 1);
      bRange.setValues(infoLines.map(v => [v]));
      formatRange(bRange);
      maxRows = Math.max(maxRows, infoLines.length);
    }

    if (cdValues.length > 0) {
      const cdRange = sheet.getRange(startRow, 3, cdValues.length, 2);
      cdRange.setValues(cdValues);
      formatRange(cdRange);
      maxRows = Math.max(maxRows, cdValues.length);
    }

    if (eventId) {
      sheet.getRange(startRow, 8).setValue(eventId);
    }

    if (maxRows > 0) {
      applyBorders(sheet, startRow, maxRows);
    }

    return maxRows;
    
  } catch (error) {
    console.error('데이터 기록 실패:', error);
    return 1;
  }
}

function formatRange(range) {
  range.setFontWeight("normal")
       .setFontColor("black")
       .setWrap(true);
}

function applyBorders(sheet, startRow, height) {
  try {
    const borderRange = sheet.getRange(startRow, 2, height, 3);
    borderRange.setBorder(
      true, true, true, true,
      true, true,
      "black", SpreadsheetApp.BorderStyle.SOLID
    );
  } catch (error) {
    console.error('테두리 적용 실패:', error);
  }
}

function openSpreadsheetByPath(rootName, subName, fileName) {
  try {
    const rootFolders = DriveApp.getFoldersByName(rootName);
    if (!rootFolders.hasNext()) {
      console.error(`루트 폴더를 찾을 수 없습니다: ${rootName}`);
      return null;
    }
    const rootFolder = rootFolders.next();

    const subFolders = rootFolder.getFoldersByName(subName);
    if (!subFolders.hasNext()) {
      console.error(`서브 폴더를 찾을 수 없습니다: ${subName}`);
      return null;
    }
    const subFolder = subFolders.next();

    const files = subFolder.getFilesByName(fileName);
    if (!files.hasNext()) {
      console.error(`파일을 찾을 수 없습니다: ${fileName}`);
      return null;
    }
    
    const file = files.next();
    return SpreadsheetApp.open(file);
    
  } catch (error) {
    console.error(`스프레드시트 열기 실패 (${fileName}):`, error);
    return null;
  }
}

// === 메뉴 및 사용자 인터페이스 ===

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  
  ui.createMenu('📅 캘린더 동기화')
    .addItem('📥 9월30일+10월 주문 업데이트', 'menuUpdateOrders')
    .addSeparator()
    .addItem('ℹ️ 사용법 보기', 'showUsage')
    .addToUi();
  
  console.log('메뉴가 생성되었습니다!');
}

function menuUpdateOrders() {
  try {
    SpreadsheetApp.getUi().alert('📥 9월30일+10월 주문을 업데이트하고 있습니다...\n잠시만 기다려주세요.');
    
    캘린더동기화();
    
    SpreadsheetApp.getUi().alert('✅ 9월30일+10월 주문 업데이트가 완료되었습니다!');
    
  } catch (error) {
    console.error('업데이트 실패:', error);
    SpreadsheetApp.getUi().alert('❌ 업데이트 중 오류가 발생했습니다:\n' + error.message);
  }
}

function showUsage() {
  const message = `
📋 캘린더 동기화 사용법

🎯 작동 방식:
   • 업데이트 버튼 → 캘린더 데이터 가져오기
   • G열에 "당일" 입력 → 다음날로 이동
   • 이동된 블록은 다음 업데이트에서 보호됨

⚠️ 개선사항:
   • "이동됨" 플래그를 블록의 첫 행에만 설정
   • 블록 전체가 자동으로 보호됨
   • 불필요한 플래그 중복 방지
  `;
  
  SpreadsheetApp.getUi().alert(message);
}

// === 수동 이동 기능 (개선됨) ===

function onEdit(e) {
  try {
    const sheet = e.range.getSheet();
    const row = e.range.getRow();
    const col = e.range.getColumn();
    const value = String(e.value || "").trim();
    
    console.log(`편집 감지: 시트=${sheet.getName()}, 행=${row}, 열=${col}, 값=${value}`);
    
    if (col !== 7) return;
    if (value !== "당일") return;
    if (row < 130) {
      SpreadsheetApp.getUi().alert('❌ 130행 이후의 데이터 영역에서만 이동 가능합니다.');
      return;
    }
    
    const flagValue = sheet.getRange(row, 6).getValue();
    if (String(flagValue).trim() === "이동됨") {
      SpreadsheetApp.getUi().alert('⚠️ 이미 이동된 데이터입니다.');
      return;
    }
    
    console.log('이동 조건 충족 - 이동 시작');
    
    const result = moveEventToNextDay(sheet, row);
    
    if (result.success) {
      SpreadsheetApp.getUi().alert(`✅ 이벤트가 ${result.targetSheetName} 시트로 이동되었습니다!`);
      console.log(`이동 완료: ${result.targetSheetName}`);
    } else {
      SpreadsheetApp.getUi().alert(`❌ 이동 실패: ${result.error}`);
      console.error(`이동 실패: ${result.error}`);
    }
    
  } catch (error) {
    console.error('onEdit 오류:', error);
    SpreadsheetApp.getUi().alert('❌ 이동 중 오류가 발생했습니다: ' + error.message);
  }
}

/**
 * 개선된 이동 함수
 * - "이동됨" 플래그를 블록의 첫 행에만 설정
 */
function moveEventToNextDay(sheet, clickedRow) {
  try {
    const blockInfo = findEventBlock(sheet, clickedRow);
    if (!blockInfo.found) {
      return { success: false, error: '이벤트 블록을 찾을 수 없습니다.' };
    }
    
    console.log(`이벤트 블록 발견: ${blockInfo.startRow}~${blockInfo.endRow} (${blockInfo.height}행)`);
    
    const nextDayInfo = calculateNextDay(sheet.getName());
    if (!nextDayInfo.success) {
      return { success: false, error: nextDayInfo.error };
    }
    
    const ss = sheet.getParent();
    const targetSheet = ss.getSheetByName(nextDayInfo.sheetName);
    if (!targetSheet) {
      return { success: false, error: `다음날 시트를 찾을 수 없습니다: ${nextDayInfo.sheetName}` };
    }
    
    const targetRow = findTargetRow(targetSheet);
    const success = copyEventBlock(sheet, blockInfo, targetSheet, targetRow);
    if (!success) {
      return { success: false, error: '데이터 복사에 실패했습니다.' };
    }
    
    // ✅ "이동됨" 플래그를 블록의 첫 행에만 설정
    targetSheet.getRange(targetRow, 6).setValue("이동됨");
    targetSheet.getRange(targetRow, 7).setValue("당일");
    
    console.log(`${nextDayInfo.sheetName} ${targetRow}행에 "이동됨" 플래그 설정`);
    
    clearOriginalData(sheet, blockInfo);
    sheet.getRange(blockInfo.startRow, 6).setValue("삭제됨");
    
    return { 
      success: true, 
      targetSheetName: nextDayInfo.sheetName,
      movedRows: blockInfo.height 
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

function findEventBlock(sheet, clickedRow) {
  try {
    const lastRow = sheet.getLastRow();
    let startRow = clickedRow;
    let endRow = clickedRow;
    
    for (let r = clickedRow; r >= 130; r--) {
      const bValue = sheet.getRange(r, 2).getValue();
      const cValue = sheet.getRange(r, 3).getValue();
      
      if (bValue || cValue) {
        startRow = r;
      } else if (r < clickedRow) {
        break;
      }
    }
    
    for (let r = clickedRow; r <= lastRow; r++) {
      const bValue = sheet.getRange(r, 2).getValue();
      const cValue = sheet.getRange(r, 3).getValue();
      
      if (bValue || cValue) {
        endRow = r;
      } else if (r > clickedRow) {
        break;
      }
    }
    
    const height = endRow - startRow + 1;
    
    return {
      found: height > 0,
      startRow: startRow,
      endRow: endRow,
      height: height
    };
    
  } catch (error) {
    console.error('블록 찾기 오류:', error);
  }
}

function calculateNextDay(currentSheetName) {
  try {
    const datePart = currentSheetName.substring(0, 8);
    
    if (!/^\d{8}$/.test(datePart)) {
      return { success: false, error: '시트명에서 날짜를 인식할 수 없습니다.' };
    }
    
    const year = parseInt(datePart.substring(0, 4));
    const month = parseInt(datePart.substring(4, 6)) - 1;
    const day = parseInt(datePart.substring(6, 8));
    
    const nextDate = new Date(year, month, day + 1);
    const nextDateString = Utilities.formatDate(nextDate, Session.getScriptTimeZone(), "yyyyMMdd");
    const weekday = ["일", "월", "화", "수", "목", "금", "토"][nextDate.getDay()];
    const nextSheetName = `${nextDateString}${weekday}요일`;
    
    return { 
      success: true, 
      sheetName: nextSheetName,
      date: nextDate
    };
    
  } catch (error) {
    return { success: false, error: '날짜 계산 오류: ' + error.message };
  }
}

function findTargetRow(targetSheet) {
  // 항상 130행에 삽입
  return CONFIG.DATA_START_ROW;
}

function copyEventBlock(sourceSheet, blockInfo, targetSheet, targetRow) {
  try {
    // 기존 데이터가 있는지 확인
    const lastRow = targetSheet.getLastRow();
    const hasExistingData = lastRow >= targetRow;

    // 삽입할 총 행 수 계산 (데이터 + 간격)
    let totalRowsToInsert = blockInfo.height;
    if (hasExistingData) {
      totalRowsToInsert += CONFIG.MOVE_DATA_SPACING; // 데이터 간 간격 추가
      console.log(`${targetSheet.getName()}: 기존 데이터와 ${CONFIG.MOVE_DATA_SPACING}행 간격을 두고 삽입`);
    }

    if (hasExistingData) {
      // 기존 데이터를 아래로 밀어내기
      const existingDataRows = lastRow - targetRow + 1;
      console.log(`${targetSheet.getName()}: 기존 데이터 ${existingDataRows}행을 아래로 이동`);

      // 삽입할 공간(데이터 + 간격)만큼 행 삽입
      targetSheet.insertRowsAfter(targetRow - 1, totalRowsToInsert);
    }

    // 데이터 복사
    const sourceRange = sourceSheet.getRange(blockInfo.startRow, 2, blockInfo.height, 3);
    const targetRange = targetSheet.getRange(targetRow, 2, blockInfo.height, 3);

    const values = sourceRange.getValues();
    targetRange.setValues(values);

    sourceRange.copyTo(targetRange, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
    targetRange.setBorder(true, true, true, true, true, true, "black", SpreadsheetApp.BorderStyle.SOLID);

    if (hasExistingData) {
      console.log(`데이터 복사 완료: ${blockInfo.height}행 (${CONFIG.MOVE_DATA_SPACING}행 간격 포함하여 ${targetRow}행에 삽입)`);
    } else {
      console.log(`데이터 복사 완료: ${blockInfo.height}행 (${targetRow}행에 삽입)`);
    }
    return true;

  } catch (error) {
    console.error('데이터 복사 오류:', error);
    return false;
  }
}

function clearOriginalData(sheet, blockInfo) {
  try {
    const clearRange = sheet.getRange(blockInfo.startRow, 2, blockInfo.height, 3);
    clearRange.clearContent();
    clearRange.setBorder(false, false, false, false, false, false);
    
    console.log(`원본 데이터 삭제 완료: ${blockInfo.height}행`);
    
  } catch (error) {
    console.error('원본 데이터 삭제 오류:', error);
  }
}

// === 테스트 함수들 ===

function 테스트동기화() {
  console.log('테스트 모드로 9월30일+10월 동기화 시작');
  캘린더동기화();
}