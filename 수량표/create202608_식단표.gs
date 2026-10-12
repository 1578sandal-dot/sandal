const SOURCE_DIET_SS_ID = '1JTqjG7RtyDA5CmFT4mCyQnwg89eXhLcDnVvfy0GKChk';
const WEEKDAY_KR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

function create202608식단표() {
  try {
    const sourceSS = SpreadsheetApp.openById(SOURCE_DIET_SS_ID);
    const sourceSheets = sourceSS.getSheets();
    console.log(`원본 시트 수: ${sourceSheets.length}개`);

    const newSS = SpreadsheetApp.create('202608식단표(고객용)');
    const newFile = DriveApp.getFileById(newSS.getId());

    const sourceFile = DriveApp.getFileById(SOURCE_DIET_SS_ID);
    const parents = sourceFile.getParents();
    if (parents.hasNext()) {
      newFile.moveTo(parents.next());
    }

    const defaultSheet = newSS.getSheets()[0];

    // 식단 내용을 지워야 하는 시트 목록 (카테고리/회사명/식단표정보는 그대로)
    const SKIP_CLEAR = ['카테고리', '회사명/이메일', '식단표정보'];

    for (const sheet of sourceSheets) {
      const copiedSheet = sheet.copyTo(newSS);
      copiedSheet.setName(sheet.getName());
      console.log(`복사: ${sheet.getName()}`);

      if (!SKIP_CLEAR.includes(sheet.getName())) {
        processSheet(copiedSheet);
      }
    }

    try { newSS.deleteSheet(defaultSheet); } catch (e) {}

    const url = newSS.getUrl();
    console.log(`✅ 완료! URL: ${url}`);
    SpreadsheetApp.getUi().alert(`✅ 202608 식단표 생성 완료!\n시트 수: ${newSS.getSheets().length}개\n\n${url}`);

  } catch (error) {
    console.error('❌ 오류:', error);
    SpreadsheetApp.getUi().alert(`❌ 오류 발생:\n${error.message}`);
  }
}

function processSheet(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 1 || lastCol < 1) return;

  const range = sheet.getRange(1, 1, lastRow, lastCol);
  const display = range.getDisplayValues(); // 화면에 보이는 텍스트
  const values = range.getValues();         // 실제 값 (Date 여부 확인용)

  // 날짜 행 인덱스 파악
  const dateRowIndexes = new Set();
  for (let r = 0; r < display.length; r++) {
    for (let c = 0; c < display[r].length; c++) {
      if (isDateStr(display[r][c])) {
        dateRowIndexes.add(r);
        break;
      }
    }
  }

  // 새 값 배열 준비 (display 기반으로 수정)
  const newValues = display.map((row, r) => {
    const isDateRow = dateRowIndexes.has(r);
    return row.map((dispVal, c) => {
      if (isDateStr(dispVal)) {
        return toAugust(dispVal);
      }
      if (!isDateRow && shouldClear(dispVal, values[r][c])) {
        return '';
      }
      // 날짜 행이 아닌 행의 Date 객체 → 그대로 유지
      if (values[r][c] instanceof Date) return values[r][c];
      return dispVal === '' ? '' : values[r][c];
    });
  });

  range.setValues(newValues);
  console.log(`  → ${sheet.getName()} 처리 완료 (날짜행 ${dateRowIndexes.size}개)`);
}

function isDateStr(val) {
  if (!val || typeof val !== 'string') return false;
  // "7월1일", "7월 1일", 영어 요일 포함 모두 커버
  return /^\d+월\s*\d+일/.test(val.trim());
}

function toAugust(str) {
  const match = str.trim().match(/\d+월\s*(\d+)일/);
  if (!match) return str;
  const day = parseInt(match[1]);
  const date = new Date(2026, 7, day); // 8월 = index 7
  return `8월${day}일 ${WEEKDAY_KR[date.getDay()]}`;
}

function shouldClear(dispVal, rawVal) {
  if (!dispVal || dispVal.trim() === '') return false;
  if (rawVal instanceof Date) return false;
  const str = dispVal.trim();
  if (/^\d+주$/.test(str)) return false;
  if (/^\d+월\s*\d+일/.test(str)) return false;
  return true;
}

// ── 디버그: 날짜 셀 타입 확인용 ──
function debugDateCell() {
  const ss = SpreadsheetApp.openById(SOURCE_DIET_SS_ID);
  const sheet = ss.getSheets()[3];
  const range = sheet.getRange(1, 1, 20, 12);
  const values = range.getValues();
  const display = range.getDisplayValues();

  for (let r = 0; r < 20; r++) {
    for (let c = 0; c < 12; c++) {
      const d = display[r][c];
      const v = values[r][c];
      if (d && d !== '') {
        console.log(`[${r+1},${c+1}] display="${d}" type=${typeof v} isDate=${v instanceof Date} raw="${v}"`);
      }
    }
  }
}
