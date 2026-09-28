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

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📋 서식 도구')
    .addItem('선택 범위 서식 지정', 'applyFormatting')
    .addSeparator()
    .addItem('🔄 자동 정렬 활성화(최초 1회)', 'installOnChangeTrigger_')
    .addToUi();
  ui.createMenu('📋 최종작업 굵게')
    .addItem('현재 시트 굵게 처리', 'applyFinalQuantityBoldToActiveSheet')
    .addItem('모든 날짜 시트 굵게 처리', 'applyFinalQuantityBoldToAllSheets')
    .addToUi();
}

// === 최종 작업 수량 굵게 처리 ===
// "최종 작업 ○○" 헤더가 있는 블록에서 수량 열이 0보다 크면 해당 행 전체 열을 굵게, 아니면 굵게 해제.
// 열 구성(202610일반주문수량표 실제 시트 기준): 번호-이름-수량 3열 그룹이 2열 간격으로 반복.
const FINAL_QTY_GROUPS = [
  { first: 8, last: 10 },   // H, I, J (최종 작업 샌드위치)
  { first: 12, last: 14 },  // L, M, N (최종 작업 유부초밥 수량)
  { first: 16, last: 18 },  // P, Q, R (최종 작업 과일 수량)
  { first: 20, last: 22 },  // T, U, V (최종작업음료수량)
  { first: 24, last: 26 },  // X, Y, Z (최종 베이커리 수량)
  { first: 28, last: 30 },  // AB, AC, AD (기타)
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

// 편집된 범위가 FINAL_QTY_GROUPS 중 하나와 겹치면 해당 그룹만 재계산해서 굵게 처리를 갱신한다.
// 처리했으면 true 반환.
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

// 9월 수량표 생성 스크립트 작성을 위해 이 파일의 실제 시트 구성과 파일 ID를 확인하는 진단용 함수
function listSheetsForSeptemberPlanning() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  console.log('파일 이름: ' + ss.getName());
  console.log('파일 ID: ' + ss.getId());
  const sheets = ss.getSheets();
  console.log('시트 개수: ' + sheets.length);
  sheets.forEach(s => console.log(s.getName()));
}

// 조식과 분리된 일반주문수량표는 1행(헤더) 다음, 2행부터 바로 일반주문 데이터가 쌓인다.
// (통합수량표 시절에는 1~204행이 조식용이라 GENERAL_START_ROW = 205였음)
const GENERAL_START_ROW = 2;
// 블록 판별(주문자/내용 등)은 A~D열 값만 보면 충분하지만, E~F열에는 셀 삽입 이미지와 서식이
// 있어 실제 이동/정렬 시에는 A~F열 전체를 range.copyTo()로 통째로 옮겨야 이미지·서식이 함께 간다.
const BLOCK_NUM_COLS = 6;

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
    const block = findBlock(sheet, editedRow);
    if (!block) {
      SpreadsheetApp.getUi().alert('블록을 찾을 수 없습니다.');
      return;
    }
    // 이동 대상으로 확정된 블록 범위만 병합 해제 (다른 블록의 병합은 그대로 둔다)
    unmergeRangeForBlocks_(sheet, block.start, block.size);

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

    // A~F열 전체(값+서식+셀 삽입 이미지)를 다음날 시트로 통째로 복사
    const destStart = appendBlockToSheet(nextSheet, sheet, block.start, block.size);

    if (val === '유부당일') {
      // 유부 아닌 항목만 수량 0으로: 복사본의 D열만 별도로 덮어씀 (이미지/서식은 copyTo로 이미 옮겨짐)
      const data = sheet.getRange(block.start, 1, block.size, 4).getValues();
      const nextD = data.map(r => [String(r[2]).trim().includes('유부') ? r[3] : 0]);
      nextSheet.getRange(destStart, 4, block.size, 1).setValues(nextD);

      const updatedD = data.map(r => [String(r[2]).trim().includes('유부') ? 0 : r[3]]);
      sheet.getRange(block.start, 4, block.size, 1).setValues(updatedD);
    } else {
      const data = sheet.getRange(block.start, 1, block.size, 4).getValues();
      const updatedD = data.map(r => [r[3] !== '' ? 0 : '']);
      sheet.getRange(block.start, 4, block.size, 1).setValues(updatedD);
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
  // A~D열 값 판별용 + E~F열은 셀 삽입 이미지가 있으면 텍스트 값이 비어도 이미지 존재 자체를 봐야 함
  // 병합은 여기서 깨지 않는다 (판별만 하는 단계 — 대상이 아닌 블록의 병합까지 불필요하게 풀리는 것을 방지)
  const allData = getBlockDetectionValues_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
  const hasImageInRow = buildImageRowSet_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
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
    if (a === '' && b === '' && c === '' && d === '' && !hasImageInRow.has(GENERAL_START_ROW + i)) break;
    endIdx = i;
  }

  return { start: GENERAL_START_ROW + headerIdx, size: endIdx - headerIdx + 1 };
}

// startRow~(startRow+numRows-1) 범위에서 E, F열에 셀 삽입 이미지가 있는 행 번호 집합을 반환.
// 이미지가 있는 행은 A~D열이 비어 있어도 블록의 끝으로 오판하면 안 되므로 findBlock/sortBlocks에서 함께 참조한다.
function buildImageRowSet_(sheet, startRow, numRows) {
  const rowSet = new Set();
  if (numRows <= 0) return rowSet;
  const endRow = startRow + numRows - 1;
  const images = sheet.getImages();
  images.forEach(function (img) {
    const anchorRow = img.getAnchorCell().getRow();
    const anchorCol = img.getAnchorCell().getColumn();
    if (anchorCol >= 5 && anchorCol <= 6 && anchorRow >= startRow && anchorRow <= endRow) {
      rowSet.add(anchorRow);
    }
  });
  return rowSet;
}

function getNextDaySheet(ss, sheetName) {
  const sheets = ss.getSheets();
  const dateSheetPattern = /^\d{8}.+요일$/;
  const dateSheets = sheets.filter(s => dateSheetPattern.test(s.getName()));
  const idx = dateSheets.findIndex(s => s.getName() === sheetName);
  if (idx === -1 || idx === dateSheets.length - 1) return null;
  return dateSheets[idx + 1];
}

// srcSheet의 (srcStartRow, size) 블록을 A~F열 전체(값+서식+셀 삽입 이미지) 그대로 destSheet 맨 아래에 복사한다.
// 반환값: 복사된 블록이 destSheet에서 실제로 시작한 행 번호.
function appendBlockToSheet(destSheet, srcSheet, srcStartRow, size) {
  const lastRow = destSheet.getLastRow();
  let startRow;
  if (lastRow < GENERAL_START_ROW) {
    startRow = GENERAL_START_ROW;
  } else {
    const colAD = destSheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, 4).getValues();
    let lastDataRow = 0;
    for (let i = 0; i < colAD.length; i++) {
      if (colAD[i].some(v => v !== '' && v !== null)) lastDataRow = GENERAL_START_ROW + i;
    }
    // 주문입력창_ver1.js의 신규 전송(+10)과 간격을 맞춰 blockRows.length 기준 자리 계산이 어긋나지 않도록 함
    startRow = lastDataRow === 0 ? GENERAL_START_ROW : lastDataRow + 10;
  }
  const src = srcSheet.getRange(srcStartRow, 1, size, BLOCK_NUM_COLS);
  const dest = destSheet.getRange(startRow, 1, size, BLOCK_NUM_COLS);
  src.copyTo(dest);
  return startRow;
}

// 2026-08-05: 병합 셀(예: 박스포장 안내 문구를 B221:B230처럼 세로 병합)이 있으면
// getValues()가 병합 앵커 셀 외에는 빈 문자열을 반환해 블록 끝 판별(A~D 모두 빈 행)이 틀어질 수 있다.
// 2026-09-XX: 예전엔 이걸 breakApart()로 실제 병합 해제까지 해서 우회했는데, onChangeHandler가
// 모든 날짜 시트에 대해 "정렬이 필요한지 판단"하려고 매번 이 함수를 먼저 호출하다 보니,
// 재배치가 전혀 필요 없는 시트에서도 사용자가 걸어둔 병합(안내 문구 등)이 계속 풀려버리는 문제가 있었다.
// 그래서 여기서는 병합을 건드리지 않고, 병합 앵커 셀의 값을 해당 범위의 다른 행에도 "가상으로" 채운
// 값 배열만 반환한다 — 블록 판별용 값 조회에는 이 결과를 쓰고, 실제 시트는 그대로 둔다.
function getBlockDetectionValues_(sheet, startRow, numRows) {
  const values = sheet.getRange(startRow, 1, numRows, 4).getValues();
  const range = sheet.getRange(startRow, 1, numRows, 4);
  const merged = range.getMergedRanges();
  merged.forEach(function (m) {
    const mRow = m.getRow();
    const mCol = m.getColumn();
    const mNumRows = m.getNumRows();
    const mNumCols = m.getNumColumns();
    if (mCol > 4) return; // A~D열 밖은 블록 판별에 쓰지 않음
    const anchorValue = values[mRow - startRow][mCol - 1];
    for (let r = 0; r < mNumRows; r++) {
      for (let c = 0; c < mNumCols && mCol - 1 + c < 4; c++) {
        const rowIdx = mRow - startRow + r;
        if (rowIdx >= 0 && rowIdx < values.length) {
          values[rowIdx][mCol - 1 + c] = anchorValue;
        }
      }
    }
  });
  return values;
}

// 실제로 블록을 재배치(copyTo)하기 직전에만 호출한다. 병합된 채로 copyTo하면 이동한 셀에
// 병합이 부분적으로 걸쳐 값이 깨질 수 있어, 재배치가 확정된 블록 범위에 한해 병합을 해제한다.
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

// 블록을 시간순(당일 우선)으로 재정렬한다. A~F열(값+서식+셀 삽입 이미지)을 통째로 옮기기 위해
// range.copyTo()를 쓰는데, 같은 시트 안에서 곧바로 최종 위치로 옮기면 아직 못 옮긴 블록을
// 덮어써버릴 수 있어 시트 하단의 임시 영역에 정렬 순서대로 먼저 복사한 뒤, 원본 블록 전체를
// 지우고 나서 임시 영역 → 최종 위치로 다시 옮기는 2단계로 처리한다.
function sortBlocks(sheet) {
  const lastRow = sheet.getLastRow();
  if (lastRow < GENERAL_START_ROW) return;

  // 판별 단계에서는 병합을 깨지 않는다 (재배치가 필요 없는 시트에서 불필요하게 병합이 풀리는 것을 방지).
  const allData = getBlockDetectionValues_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
  const hasImageInRow = buildImageRowSet_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
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
        if (a === '' && b === '' && c === '' && d === '' && !hasImageInRow.has(GENERAL_START_ROW + j)) break;
        endIdx = j;
      }
      const blockRows = allData.slice(i, endIdx + 1);
      const timeStr = blockRows.length >= 3 ? String(blockRows[2][1]).trim() : '';
      const isToday = String(blockRows[0][0]).trim().includes('당일');
      blocks.push({ origStart: GENERAL_START_ROW + i, size: blockRows.length, timeStr, isToday });
      i = endIdx + 1;
    } else {
      i++;
    }
  }

  if (blocks.length === 0) return;

  // 이미 정렬된 상태(원본 행 순서 = 시간순)면 재배치할 필요 없음 — 불필요한 복사/삭제로 이미지가
  // 깜빡이거나 손상될 여지를 줄인다.
  const sorted = blocks.slice().sort((a, b) => {
    if (a.isToday && !b.isToday) return -1;
    if (!a.isToday && b.isToday) return 1;
    return parseTime(a.timeStr) - parseTime(b.timeStr);
  });
  const alreadySorted = sorted.every((b, idx) => b === blocks[idx]);
  if (alreadySorted) return;

  // 재배치가 실제로 확정된 경우에만 병합을 해제한다. 병합된 채로 copyTo하면 이동한 위치에
  // 병합이 부분적으로 걸쳐 값이 깨질 수 있어, 여기서 풀고 나서 옮긴다.
  unmergeRangeForBlocks_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);

  // 1단계: 정렬 순서대로 시트 하단 임시 영역에 A~F열 전체를 복사
  const bufferStart = lastRow + 10;
  let bufferRow = bufferStart;
  const bufferPositions = [];
  for (const block of sorted) {
    sheet.getRange(block.origStart, 1, block.size, BLOCK_NUM_COLS)
      .copyTo(sheet.getRange(bufferRow, 1, block.size, BLOCK_NUM_COLS));
    bufferPositions.push({ bufferRow, size: block.size });
    bufferRow += block.size + 10;
  }
  const bufferEnd = bufferRow - 1;

  // 2단계: 원본 블록 영역 전체(값+서식+이미지)를 비움
  sheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, BLOCK_NUM_COLS).clear();

  // 3단계: 임시 영역 → 최종 위치로 다시 복사 후 임시 영역 정리
  let writeRow = GENERAL_START_ROW;
  for (const pos of bufferPositions) {
    sheet.getRange(pos.bufferRow, 1, pos.size, BLOCK_NUM_COLS)
      .copyTo(sheet.getRange(writeRow, 1, pos.size, BLOCK_NUM_COLS));
    writeRow += pos.size + 10;
  }
  sheet.getRange(bufferStart, 1, bufferEnd - bufferStart + 1, BLOCK_NUM_COLS).clear();
}

function parseTime(timeStr) {
  const isPM = timeStr.includes('오후');
  // "오후 3:30"처럼 분이 있는 형식과 "오전 9"처럼 분이 생략된 형식(정시) 둘 다 지원.
  // 콜론 없는 형식을 처리하지 않으면 match가 null이 되어 9999(맨 뒤)로 밀려버린다.
  const match = timeStr.match(/(\d+):(\d+)/) || timeStr.match(/(\d+)/);
  if (!match) return 9999;
  let h = parseInt(match[1]), m = match[2] !== undefined ? parseInt(match[2]) : 0;
  if (isPM && h < 12) h += 12;
  if (!isPM && h === 12) h = 0;
  return h * 60 + m;
}

// sortBlocks와 완전히 동일한 로직(A~F열 copyTo 기반)이지만, 매 단계를 로그로 남기는 진단 전용 버전.
// 실제 시트는 변경하지 않고 문자열 로그만 반환한다.
function sortBlocks_진단버전(sheet) {
  let log = '';
  const lastRow = sheet.getLastRow();
  log += `lastRow=${lastRow}\n`;
  if (lastRow < GENERAL_START_ROW) { log += '(GENERAL_START_ROW 미만이라 즉시 종료)\n'; return log; }

  const allData = sheet.getRange(GENERAL_START_ROW, 1, lastRow - GENERAL_START_ROW + 1, 4).getValues();
  const hasImageInRow = buildImageRowSet_(sheet, GENERAL_START_ROW, lastRow - GENERAL_START_ROW + 1);
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
        if (a === '' && b === '' && c === '' && d === '' && !hasImageInRow.has(GENERAL_START_ROW + j)) break;
        endIdx = j;
      }
      const blockRows = allData.slice(i, endIdx + 1);
      const timeStr = blockRows.length >= 3 ? String(blockRows[2][1]).trim() : '';
      const isToday = String(blockRows[0][0]).trim().includes('당일');
      blocks.push({ origStart: GENERAL_START_ROW + i, size: blockRows.length, timeStr, isToday });
      log += `블록 발견: 원본행=${GENERAL_START_ROW + i}~${GENERAL_START_ROW + endIdx} size=${blockRows.length} timeStr="${timeStr}" isToday=${isToday}\n`;
      i = endIdx + 1;
    } else {
      i++;
    }
  }

  log += `총 블록 수=${blocks.length}\n`;
  if (blocks.length === 0) { log += '(블록 없어 즉시 종료)\n'; return log; }

  const sorted = blocks.slice().sort((a, b) => {
    if (a.isToday && !b.isToday) return -1;
    if (!a.isToday && b.isToday) return 1;
    return parseTime(a.timeStr) - parseTime(b.timeStr);
  });
  const alreadySorted = sorted.every((b, idx) => b === blocks[idx]);
  log += '정렬 후 블록 순서: ' + sorted.map(b => `[${b.origStart}, size=${b.size}, time="${b.timeStr}", isToday=${b.isToday}]`).join(', ') + '\n';
  log += `alreadySorted=${alreadySorted}\n`;
  if (alreadySorted) { log += '(이미 정렬된 상태라 재배치 없이 종료)\n'; return log; }

  const bufferStart = lastRow + 10;
  let bufferRow = bufferStart;
  for (const block of sorted) {
    log += `임시복사: 원본${block.origStart}~${block.origStart + block.size - 1} → 버퍼${bufferRow}~${bufferRow + block.size - 1}\n`;
    bufferRow += block.size + 10;
  }
  log += `원본 영역 clear: ${GENERAL_START_ROW}~${lastRow} (A~F열)\n`;

  let writeRow = GENERAL_START_ROW;
  for (const block of sorted) {
    log += `최종배치: → ${writeRow}~${writeRow + block.size - 1}\n`;
    writeRow += block.size + 10;
  }

  return log;
}

// ========================================
// 신규 주문/당일 이동과 무관하게, 시트에 어떤 경로로든 값이 바뀌면
// 자동으로 배송시간순(당일 최우선) 정렬되도록 하는 onChange 설치형 트리거.
//
// onEdit(간단 트리거)는 사람이 시트를 직접 편집할 때만 발동하고, 주문입력창_ver1.js처럼
// 다른 스프레드시트의 스크립트가 API(setValues 등)로 값을 쓸 때는 발동하지 않는다.
// onChange(설치형 트리거)는 그런 외부 스크립트발 변경도 EDIT 이벤트로 잡아내므로,
// "주문이 어떤 순서로 입력되든 항상 배송시간순으로 자동 정렬"을 보장하려면 이 방식이 필요하다.
//
// 설치형 트리거는 코드 배포만으로는 활성화되지 않고, 아래 installOnChangeTrigger_를
// (메뉴의 "🔄 자동 정렬 활성화(최초 1회)" 또는 편집기에서 직접) 한 번 실행해야 등록된다.
// ========================================

function installOnChangeTrigger_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // 중복 등록 방지: 이미 이 파일에 onChangeHandler 트리거가 있으면 새로 만들지 않음
  const existing = ScriptApp.getProjectTriggers().some(
    t => t.getHandlerFunction() === 'onChangeHandler' && t.getTriggerSourceId() === ss.getId()
  );
  if (existing) {
    SpreadsheetApp.getUi().alert('이미 자동 정렬이 활성화되어 있습니다.');
    return;
  }

  ScriptApp.newTrigger('onChangeHandler')
    .forSpreadsheet(ss)
    .onChange()
    .create();

  SpreadsheetApp.getUi().alert('✅ 자동 정렬이 활성화되었습니다.\n앞으로 주문이 어떤 경로로 입력되든 배송시간순(당일 최우선)으로 자동 정렬됩니다.');
}

// onChange 이벤트 핸들러: 변경된 range 정보가 없으므로 날짜 시트 전체를 순회하며 정렬한다.
// sortBlocks 내부의 alreadySorted 체크 덕분에 실제로 순서가 바뀔 때만 쓰기가 발생하고,
// 이미 정렬된 시트는 바로 스킵되어 정렬 자체가 다시 onChange를 유발해도 다음 실행에서 즉시 종료된다.
// 동시에 여러 onChange가 겹쳐 들어올 때(예: 당일 이동이 원본/다음날 두 시트를 동시에 건드리는 경우)
// 서로 다른 실행이 같은 시트를 동시에 재배치하지 않도록 LockService로 직렬화한다.
function onChangeHandler(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);
  } catch (err) {
    Logger.log('onChangeHandler: 락 획득 실패, 다음 변경 이벤트에서 재시도됨 - ' + err.toString());
    return;
  }

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const dateSheetPattern = /^\d{8}.+요일$/;
    const dateSheets = ss.getSheets().filter(s => dateSheetPattern.test(s.getName()));

    dateSheets.forEach(sheet => {
      try {
        sortBlocks(sheet);
      } catch (err) {
        Logger.log(`onChangeHandler: ${sheet.getName()} 정렬 실패 - ${err.toString()}`);
      }
    });
  } finally {
    lock.releaseLock();
  }
}
