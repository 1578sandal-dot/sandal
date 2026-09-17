/**
 * 수량표 서식 지정 스크립트
 */

// === 서식 지정 함수 ===

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

/**
 * 날짜+요일 시트(예: 20260406월요일)의 D열에서 숫자가 아닌 문자를 제거하고 순수 숫자만 남김
 * 제품명구성, 제품db, 스텝표, 수량표 등 다른 시트는 건너뜀
 */
function cleanDColumnNumbers() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const dateSheetPattern = /^\d{8}.+요일$/;

    if (!dateSheetPattern.test(sheet.getName())) {
      Browser.msgBox("날짜+요일 시트에서만 실행할 수 있습니다.");
      return;
    }

    let totalChanged = 0;
    const processedSheets = 1;

    {
      const lastRow = sheet.getLastRow();
      if (lastRow < 1) {
        Browser.msgBox("데이터가 없습니다.");
        return;
      }

      const dRange = sheet.getRange(1, 4, lastRow, 1);
      const values = dRange.getValues();

      for (let i = 0; i < values.length; i++) {
        const raw = values[i][0];

        if (raw === '' || raw === null || raw === undefined) continue;
        if (typeof raw === 'number') continue;

        const extracted = String(raw).replace(/[^0-9.]/g, '');
        if (extracted === '') continue;

        const num = Number(extracted);
        if (!isNaN(num)) {
          sheet.getRange(i + 1, 4).setValue(num);
          totalChanged++;
        }
      }
    }

    Browser.msgBox(`완료! 날짜 시트 ${processedSheets}개에서 총 ${totalChanged}개 셀을 숫자로 변환했습니다.`);

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
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 서식 도구')
    .addItem('선택 범위 서식 지정', 'applyFormatting')
    .addItem('12행 블록 서식 지정', 'applyFormattingToBlock')
    .addToUi();
  ui.createMenu('📋 출력 도구')
    .addItem('출력전용 시트 생성', '출력뷰생성')
    .addToUi();
  ui.createMenu('📋 최종작업 굵게')
    .addItem('현재 시트 굵게 처리', 'applyFinalQuantityBoldToActiveSheet')
    .addItem('모든 날짜 시트 굵게 처리', 'applyFinalQuantityBoldToAllSheets')
    .addToUi();
}

// === 최종 작업 수량 굵게 처리 ===
// "최종 작업 ○○" 헤더가 있는 블록에서 수량 열이 0보다 크면 해당 행 전체 열을 굵게, 아니면 굵게 해제.
// 헤더 텍스트는 그룹 내 아무 열에나 있을 수 있음(예: K58처럼 "이름" 열에 있는 경우가 많음).
const FINAL_QTY_GROUPS = [
  { first: 7, last: 8 },    // G, H (p_ 접두사 블록: 이름-수량 2열)
  { first: 10, last: 12 },  // J, K, L
  { first: 15, last: 17 },  // O, P, Q
  { first: 19, last: 21 },  // S, T, U
  { first: 23, last: 25 },  // W, X, Y
  { first: 27, last: 29 },  // AA, AB, AC
  { first: 31, last: 33 },  // AE, AF, AG
];

// 그룹 범위(first~last) 내 한 행(rowVals)에 "최종"으로 시작하는 텍스트가 있는 셀이 있으면 헤더 행으로 간주.
function isFinalQtyHeaderRow_(rowVals) {
  return rowVals.some(v => String(v).trim().indexOf('최종') === 0);
}

function applyFinalQuantityBoldToActiveSheet() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const count = applyFinalQuantityBoldOnSheet(sheet);
  SpreadsheetApp.getUi().alert(`'${sheet.getName()}' 시트에서 ${count}개 블록을 처리했습니다.`);
}

// 진단용: 각 그룹(J-L, O-Q, S-U, W-Y, AA-AC, AE-AG)에서 "최종 작업"으로 시작하는
// 셀을 찾아 실제 행 번호/열/텍스트/병합여부를 알림으로 보여준다. 하나도 못 찾으면 그것도 표시.
function diagnoseFinalQuantityHeaders() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  let log = `시트: ${sheet.getName()}, lastRow=${lastRow}\n\n`;

  FINAL_QTY_GROUPS.forEach(group => {
    const numCols = group.last - group.first + 1;
    const range = sheet.getRange(1, group.first, lastRow, numCols);
    const values = range.getValues();
    const colLetters = [];
    for (let c = group.first; c <= group.last; c++) {
      colLetters.push(sheet.getRange(1, c).getA1Notation().replace(/\d+$/, ''));
    }
    log += `[그룹 ${colLetters.join('-')}]\n`;

    let found = 0;
    for (let i = 0; i < values.length; i++) {
      if (isFinalQtyHeaderRow_(values[i])) {
        const colOffset = values[i].findIndex(v => String(v).trim().indexOf('최종') === 0);
        const cellA1 = sheet.getRange(i + 1, group.first + colOffset).getA1Notation();
        const merged = sheet.getRange(i + 1, group.first + colOffset).getMergedRanges();
        const mergedInfo = merged.length > 0 ? merged[0].getA1Notation() : '(병합없음)';
        log += `  행${i + 1}(${cellA1}) = "${values[i][colOffset]}" 병합범위=${mergedInfo}\n`;
        found++;
      }
    }
    if (found === 0) log += `  (헤더 못 찾음 — 첫 5행 값: ${values.slice(0, 5).map(r => JSON.stringify(r[0])).join(', ')})\n`;
    log += '\n';
  });

  Logger.log(log);
  SpreadsheetApp.getUi().alert('진단 결과 (보기>실행기록에도 기록됨)', log, SpreadsheetApp.getUi().ButtonSet.OK);
}

// 진단용: A~AZ 전체 열에서 "최종"이 들어간 모든 셀의 실제 주소를 찾아 보여준다.
function diagnoseFindAllFinalCells() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const lastRow = sheet.getLastRow();
  const lastCol = Math.max(sheet.getLastColumn(), 52); // AZ = 52열까지 최소 스캔
  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();

  let log = `시트: ${sheet.getName()}, lastRow=${lastRow}, 스캔 열수=${lastCol}\n\n`;
  let found = 0;

  for (let r = 0; r < values.length; r++) {
    for (let c = 0; c < values[r].length; c++) {
      const text = String(values[r][c]).trim();
      if (text.indexOf('최종') !== -1) {
        const a1 = sheet.getRange(r + 1, c + 1).getA1Notation();
        log += `${a1}: "${text}"\n`;
        found++;
      }
    }
  }

  if (found === 0) log += '("최종"이 포함된 셀을 전혀 찾지 못함)\n';

  Logger.log(log);
  SpreadsheetApp.getUi().alert(`"최종" 포함 셀 전체 검색 결과 (총 ${found}개)`, log, SpreadsheetApp.getUi().ButtonSet.OK);
}

function applyFinalQuantityBoldToAllSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dateSheetPattern = /^\d{8}.+요일$/;
  const sheets = ss.getSheets().filter(s => dateSheetPattern.test(s.getName()));
  let total = 0;
  sheets.forEach(sheet => {
    total += applyFinalQuantityBoldOnSheet(sheet);
  });
  SpreadsheetApp.getUi().alert(`날짜 시트 ${sheets.length}개에서 총 ${total}개 블록을 처리했습니다.`);
}

// 시트 전체에서 "최종 작업"으로 시작하는 헤더를 찾아 그 아래 블록마다 굵게 처리 적용.
// 반환값: 처리한 블록 개수
function applyFinalQuantityBoldOnSheet(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 1) return 0;

  let blockCount = 0;
  FINAL_QTY_GROUPS.forEach(group => {
    const numRows = lastRow;
    const values = sheet.getRange(1, group.first, numRows, group.last - group.first + 1).getValues();
    const numCols = group.last - group.first + 1;

    let row = 0;
    while (row < values.length) {
      if (isFinalQtyHeaderRow_(values[row])) {
        let end = row + 1;
        while (end < values.length) {
          const rowVals = values[end];
          const isEmpty = rowVals.every(v => v === '' || v === null);
          if (isEmpty) break;
          end++;
        }
        applyBoldForBlock_(sheet, group, values, row + 1, end);
        blockCount++;
        row = end;
      } else {
        row++;
      }
    }
  });
  return blockCount;
}

// values는 group 범위(first~last열) 전체의 getValues() 결과, startIdx~endIdx(미포함)가 데이터 행 구간(0-based)
function applyBoldForBlock_(sheet, group, values, startIdx, endIdx) {
  const numCols = group.last - group.first + 1;
  const qtyColIdx = numCols - 1; // 그룹의 마지막 열이 수량 열
  for (let i = startIdx; i < endIdx; i++) {
    const qty = values[i][qtyColIdx];
    const isMeaningful = typeof qty === 'number' && qty > 0;
    const range = sheet.getRange(i + 1, group.first, 1, numCols);
    range.setFontWeight(isMeaningful ? 'bold' : 'normal');
  }
}

// 편집된 범위가 FINAL_QTY_GROUPS 중 하나(J-L, O-Q, S-U, W-Y, AA-AC, AE-AG)와 겹치면
// 해당 그룹만 재계산해서 굵게 처리를 갱신한다. 처리했으면 true 반환(다른 시트로 다시 검사).
function handleFinalQuantityBoldEdit_(sheet, editedRange) {
  const editStartCol = editedRange.getColumn();
  const editEndCol = editStartCol + editedRange.getNumColumns() - 1;

  const matchedGroup = FINAL_QTY_GROUPS.find(g => editStartCol <= g.last && editEndCol >= g.first);
  if (!matchedGroup) return false;

  const lastRow = sheet.getLastRow();
  if (lastRow < 1) return true;

  const numCols = matchedGroup.last - matchedGroup.first + 1;
  const values = sheet.getRange(1, matchedGroup.first, lastRow, numCols).getValues();

  let row = 0;
  while (row < values.length) {
    if (isFinalQtyHeaderRow_(values[row])) {
      let end = row + 1;
      while (end < values.length) {
        const isEmpty = values[end].every(v => v === '' || v === null);
        if (isEmpty) break;
        end++;
      }
      applyBoldForBlock_(sheet, matchedGroup, values, row + 1, end);
      row = end;
    } else {
      row++;
    }
  }
  return true;
}
const GENERAL_START_ROW = 205;

function onEdit(e) {
  if (!e) return;
  try {
    const sheet = e.source.getActiveSheet();
    const editedCell = e.range;
    const sheetName = sheet.getName();
    const dateSheetPattern = /^\d{8}.+요일$/;
    if (!dateSheetPattern.test(sheetName)) return;

    if (handleFinalQuantityBoldEdit_(sheet, editedCell)) return;

    if (editedCell.getColumn() !== 1) return;
    if (editedCell.getNumRows() > 1 || editedCell.getNumColumns() > 1) return;
    if (editedCell.getRow() < GENERAL_START_ROW) return;

    const val = String(editedCell.getValue()).trim();
    if (val !== '전체당일' && val !== '유부당일') return;

    const editedRow = editedCell.getRow();
    // findBlock/이후 재작성 과정에서 병합 셀 때문에 블록 크기가 잘못 계산되는 것을 방지
    unmergeRangeForBlocks_(sheet, GENERAL_START_ROW, sheet.getLastRow() - GENERAL_START_ROW + 1);
    const block = findBlock(sheet, editedRow);
    if (!block) {
      SpreadsheetApp.getUi().alert('블록을 찾을 수 없습니다.');
      return;
    }

    const blockData = sheet.getRange(block.start, 1, block.size, 4).getValues();
    const ordererRow = blockData.find(r => String(r[0]).trim() === '주문자');
    const ordererName = ordererRow ? String(ordererRow[1]).trim() : '알 수 없음';

    const ui = SpreadsheetApp.getUi();
    const response = ui.alert(
      '당일 이동 확인',
      `'${ordererName}' 주문을 다음날 시트로 이동합니다. 계속하시겠습니까?`,
      ui.ButtonSet.OK_CANCEL
    );
    if (response !== ui.Button.OK) {
      editedCell.setValue('');
      return;
    }

    const nextSheet = getNextDaySheet(e.source, sheetName);
    if (!nextSheet) {
      ui.alert('다음날 시트를 찾을 수 없습니다.');
      editedCell.setValue('');
      return;
    }

    const data = sheet.getRange(block.start, 1, block.size, 4).getValues();

    if (val === '유부당일') {
      const nextData = data.map(r => {
        const isYubu = String(r[2]).trim().includes('유부');
        return [r[0], r[1], r[2], isYubu ? r[3] : 0];
      });
      appendBlockToSheet(nextSheet, nextData);
      const updatedData = data.map(r => {
        if (String(r[2]).trim().includes('유부')) return [r[0], r[1], r[2], 0];
        return r;
      });
      sheet.getRange(block.start, 1, block.size, 4).setValues(updatedData);
    } else {
      appendBlockToSheet(nextSheet, data);
      const updatedData = data.map(r => [r[0], r[1], r[2], r[3] !== '' ? 0 : '']);
      sheet.getRange(block.start, 1, block.size, 4).setValues(updatedData);
    }

    sheet.getRange(editedCell.getRow(), 1).setValue('이동완료');
    sortBlocks(nextSheet);
    ui.alert(`✅ '${ordererName}' 주문이 ${nextSheet.getName()}으로 이동되었습니다.`);

  } catch (error) {
    Logger.log('onEdit 에러: ' + error.toString());
    SpreadsheetApp.getUi().alert('오류 발생: ' + error.message);
  }
}

function findBlock(sheet, row) {
  const lastRow = sheet.getLastRow();
  if (lastRow < GENERAL_START_ROW) return null;
  const allData = sheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, 4).getValues();
  const idx = row - GENERAL_START_ROW;

  let headerIdx = idx;
  while (headerIdx >= 0) {
    if (String(allData[headerIdx][1]).trim() === '내용') break;
    headerIdx--;
  }
  if (headerIdx < 0) return null;

  let endIdx = headerIdx;
  for (let i = headerIdx + 1; i < allData.length; i++) {
    const a = String(allData[i][0]).trim();
    const b = String(allData[i][1]).trim();
    const c = String(allData[i][2]).trim();
    const d = String(allData[i][3]).trim();
    if (a === '' && b === '' && c === '' && d === '') break;
    endIdx = i;
  }

  return { start: GENERAL_START_ROW + headerIdx, size: endIdx - headerIdx + 1 };
}

function getNextDaySheet(ss, sheetName) {
  const sheets = ss.getSheets();
  const dateSheetPattern = /^\d{8}.+요일$/;
  const dateSheets = sheets.filter(s => dateSheetPattern.test(s.getName()));
  const idx = dateSheets.findIndex(s => s.getName() === sheetName);
  if (idx === -1 || idx === dateSheets.length - 1) return null;
  return dateSheets[idx + 1];
}

function appendBlockToSheet(sheet, data) {
  const lastRow = sheet.getLastRow();
  if (lastRow < GENERAL_START_ROW) {
    sheet.getRange(GENERAL_START_ROW, 1, data.length, 4).setValues(data);
    return;
  }
  const colAD = sheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, 4).getValues();
  let lastDataRow = 0;
  for (let i = 0; i < colAD.length; i++) {
    if (colAD[i].some(v => v !== '' && v !== null)) lastDataRow = GENERAL_START_ROW + i;
  }
  const startRow = lastDataRow === 0 ? GENERAL_START_ROW : lastDataRow + 3;
  sheet.getRange(startRow, 1, data.length, 4).setValues(data);
}

// 2026-08-05: 병합 셀(예: 박스포장 안내 문구를 B221:B230처럼 세로 병합)이 있으면
// getValues()가 병합 앵커 셀 외에는 빈 문자열을 반환한다.
// 병합만 해제하고 값은 앵커 셀에만 남긴다 (다른 셀에 복제하지 않음 —
// 복제하면 blockRows[i][1]이 매 행 채워져 버려 오히려 판정에 혼선을 준다).
function unmergeRangeForBlocks_(sheet, startRow, numRows) {
  if (numRows <= 0) return;
  const range = sheet.getRange(startRow, 1, numRows, 4);
  const merged = range.getMergedRanges();
  if (merged.length === 0) return;
  merged.forEach(function (m) {
    m.breakApart();
  });
  SpreadsheetApp.flush(); // 병합 해제를 즉시 반영시켜 이후 getValues()가 정확한 값을 읽도록 보장
}

function sortBlocks(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < GENERAL_START_ROW) return;

  unmergeRangeForBlocks_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
  const allData = sheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, 4).getValues();
  const blocks = [];
  let i = 0;

  while (i < allData.length) {
    if (String(allData[i][1]).trim() === '내용') {
      let endIdx = i;
      for (let j = i + 1; j < allData.length; j++) {
        const a = String(allData[j][0]).trim();
        const b = String(allData[j][1]).trim();
        const c = String(allData[j][2]).trim();
        const d = String(allData[j][3]).trim();
        if (a === '' && b === '' && c === '' && d === '') break;
        endIdx = j;
      }
      const blockRows = allData.slice(i, endIdx + 1);
      const timeStr = blockRows.length >= 3 ? String(blockRows[2][1]).trim() : '';
      const isToday = String(blockRows[0][0]).trim().includes('당일');
      blocks.push({ rows: blockRows, timeStr, isToday });
      i = endIdx + 1;
    } else {
      i++;
    }
  }

  if (blocks.length === 0) return;

  blocks.sort((a, b) => {
    if (a.isToday && !b.isToday) return -1;
    if (!a.isToday && b.isToday) return 1;
    return parseTime(a.timeStr) - parseTime(b.timeStr);
  });

  const totalRows = blocks.reduce((sum, b) => sum + b.rows.length + 3, 0);
  sheet.getRange(GENERAL_START_ROW, 1, Math.max(lastRow - GENERAL_START_ROW + 1, totalRows), 4).clearContent();

  let writeRow = GENERAL_START_ROW;
  for (const block of blocks) {
    sheet.getRange(writeRow, 1, block.rows.length, 4).setValues(block.rows);
    writeRow += block.rows.length + 3;
  }
}

function parseTime(timeStr) {
  const isPM = timeStr.includes('오후');
  const match = timeStr.match(/(\d+):(\d+)/);
  if (!match) return 9999;
  let h = parseInt(match[1]), m = parseInt(match[2]);
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h * 60 + m;
}

// sortBlocks와 완전히 동일한 로직이지만, 매 단계를 로그로 남기는 진단 전용 버전.
// 실제 시트는 변경하지 않고 문자열 로그만 반환한다.
function sortBlocks_진단버전(sheet) {
  let log = '';
  const lastRow = sheet.getLastRow();
  log += `lastRow=${lastRow}\n`;
  if (lastRow < GENERAL_START_ROW) { log += '(GENERAL_START_ROW 미만이라 즉시 종료)\n'; return log; }

  unmergeRangeForBlocks_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
  const allData = sheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, 4).getValues();
  log += `allData.length=${allData.length}\n`;
  const blocks = [];
  let i = 0;

  while (i < allData.length) {
    if (String(allData[i][1]).trim() === '내용') {
      let endIdx = i;
      for (let j = i + 1; j < allData.length; j++) {
        const a = String(allData[j][0]).trim();
        const b = String(allData[j][1]).trim();
        const c = String(allData[j][2]).trim();
        const d = String(allData[j][3]).trim();
        if (a === '' && b === '' && c === '' && d === '') break;
        endIdx = j;
      }
      const blockRows = allData.slice(i, endIdx + 1);
      const timeStr = blockRows.length >= 3 ? String(blockRows[2][1]).trim() : '';
      const isToday = String(blockRows[0][0]).trim().includes('당일');
      blocks.push({ rows: blockRows, timeStr, isToday, origStart: GENERAL_START_ROW + i, origEnd: GENERAL_START_ROW + endIdx });
      log += `블록 발견: 원본행=${GENERAL_START_ROW + i}~${GENERAL_START_ROW + endIdx} rows.length=${blockRows.length} timeStr="${timeStr}" isToday=${isToday}\n`;
      i = endIdx + 1;
    } else {
      i++;
    }
  }

  log += `총 블록 수=${blocks.length}\n`;
  if (blocks.length === 0) { log += '(블록 없어 즉시 종료 — clearContent 실행 안 됨)\n'; return log; }

  blocks.sort((a, b) => {
    if (a.isToday && !b.isToday) return -1;
    if (!a.isToday && b.isToday) return 1;
    return parseTime(a.timeStr) - parseTime(b.timeStr);
  });
  log += '정렬 후 블록 순서: ' + blocks.map(b => `[${b.origStart}~${b.origEnd}, size=${b.rows.length}, time="${b.timeStr}"]`).join(', ') + '\n';

  const totalRows = blocks.reduce((sum, b) => sum + b.rows.length + 3, 0);
  const clearSize = Math.max(lastRow - GENERAL_START_ROW + 1, totalRows);
  log += `totalRows=${totalRows}, clearContent 범위=${GENERAL_START_ROW}~${GENERAL_START_ROW + clearSize - 1} (size=${clearSize})\n`;

  let writeRow = GENERAL_START_ROW;
  for (const block of blocks) {
    log += `쓰기: writeRow=${writeRow}, size=${block.rows.length} → ${writeRow}~${writeRow + block.rows.length - 1}\n`;
    writeRow += block.rows.length + 3;
  }

  return log;
}

// ============================================================
// 2026-08-05 진단용: B221:D231 소실 재현 테스트
// 원본 20260811화요일 시트는 건드리지 않고, 사본 시트를 만들어
// 그 안에서 sortBlocks 실행 전/후 값을 비교해 원인을 증명한다.
// 실행 후 "테스트_소실재현"이라는 시트가 새로 생기며, 로그(보기 > 실행 기록)에
// 실행 전/후 값이 출력된다. 확인 후 그 시트는 삭제해도 무방하다.
// ============================================================
function 진단_소실재현테스트() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const original = ss.getSheetByName('20260811화요일');
  if (!original) {
    SpreadsheetApp.getUi().alert('20260811화요일 시트를 찾을 수 없습니다.');
    return;
  }

  // 0) 상세 로그용 사본 (여기서는 값을 안 바꾸는 진단 버전만 실행)
  const oldDiag = ss.getSheetByName('테스트_진단로그용');
  if (oldDiag) ss.deleteSheet(oldDiag);
  const diagSheet = original.copyTo(ss);
  diagSheet.setName('테스트_진단로그용');
  let log = '=== sortBlocks 진단 (값 안 바꿈, 로그만) ===\n';
  log += sortBlocks_진단버전(diagSheet);
  ss.deleteSheet(diagSheet); // 진단만 하고 바로 정리

  // 기존 테스트 시트가 있으면 지우고 새로 복사 (실제 값 변경 검증용, 별도 깨끗한 사본)
  const oldTest = ss.getSheetByName('테스트_소실재현');
  if (oldTest) ss.deleteSheet(oldTest);
  const testSheet = original.copyTo(ss);
  testSheet.setName('테스트_소실재현');

  // 1) B221 병합 여부 및 실행 전 B221:D231 값 기록
  const b221 = testSheet.getRange('B221');
  const mergedRanges = b221.getMergedRanges();
  const isMerged = mergedRanges.length > 0;
  const mergedA1 = isMerged ? mergedRanges[0].getA1Notation() : '(병합 아님)';

  const before = testSheet.getRange('B221:D231').getValues();

  log += '\n=== 실행 전 (병합 유지 상태, 원본 그대로) ===\n';
  log += `getLastRow(): ${testSheet.getLastRow()}\n`;
  log += `B221 병합 범위: ${mergedA1}\n`;
  before.forEach((row, i) => {
    log += `${221 + i}행: B="${row[0]}" C="${row[1]}" D="${row[2]}"\n`;
  });

  // 2) sortBlocks를 테스트 시트에 대해 직접 실행 (실제 당일이동과 동일한 재정렬 로직)
  // 주의: 여기서 병합을 미리 풀지 않는다. sortBlocks 내부의 unmergeRangeForBlocks_가
  // 병합이 살아있는 "실제 상황 그대로"를 처음 마주치도록 둬야 정확한 검증이 된다.
  sortBlocks(testSheet);
  log += `\ngetLastRow() (sortBlocks 후): ${testSheet.getLastRow()}\n`;

  // 3) 실행 후 값 기록
  const after = testSheet.getRange('B221:D231').getValues();
  log += '\n=== sortBlocks 실행 후 ===\n';
  after.forEach((row, i) => {
    log += `${221 + i}행: B="${row[0]}" C="${row[1]}" D="${row[2]}"\n`;
  });

  Logger.log(log);
  SpreadsheetApp.getUi().alert(
    '진단 완료. 결과는 보기 > 실행 기록(또는 Ctrl+Enter)에서 확인하세요.\n' +
    '"테스트_소실재현" 시트가 생성되었습니다. 확인 후 삭제해도 됩니다.\n\n' + log
  );
}
