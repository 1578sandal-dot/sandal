/**
 * 202601수량표용 서식 지정 스크립트
 * 202512수량표의 Code.js와 동일한 기능
 */

// === 메뉴 생성 ===

function onOpen() {
  const ui = SpreadsheetApp.getUi();

  ui.createMenu('📋 서식 도구')
    .addItem('선택 범위 서식 지정', 'applyFormatting')
    .addItem('12행 블록 서식 지정', 'applyFormattingToBlock')
    .addToUi();

  console.log('메뉴가 생성되었습니다!');
}

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
