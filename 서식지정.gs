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
