/**
 * 202606일반주문수량표 날짜 시트 재생성 스크립트
 * 기존 날짜 시트 삭제 후 수량표사본 기준으로 다시 생성
 */

function recreate202606일반주문날짜시트() {
  try {
    const ss = SpreadsheetApp.openById('19LxrPG-nI2hvVkDp2Wd68cWDoWe5kO_mB9B5GtEncjA');
    const templateSheet = ss.getSheetByName('수량표사본');
    if (!templateSheet) throw new Error('수량표사본 시트를 찾을 수 없습니다.');

    // 기존 날짜 시트 삭제 (이름 목록 먼저 수집 후 이름으로 찾아서 삭제)
    const dateSheetPattern = /^202606\d{2}.+요일$/;
    const sheetNamesToDelete = ss.getSheets()
      .filter(s => dateSheetPattern.test(s.getName()))
      .map(s => s.getName());

    console.log(`삭제할 날짜 시트: ${sheetNamesToDelete.length}개`);
    for (const name of sheetNamesToDelete) {
      if (ss.getSheets().length <= 1) {
        console.warn(`⚠️ 시트가 1개 남아 삭제 불가: ${name}, 건너뜀`);
        continue;
      }
      const sheet = ss.getSheetByName(name);
      if (sheet) {
        ss.deleteSheet(sheet);
        console.log(`삭제: ${name}`);
      }
    }

    // 수량표사본 기준으로 날짜 시트 재생성
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 30; day++) {
      const date = new Date(2026, 5, day);
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202606${dayStr}${dayOfWeek}요일`;

      const newSheet = templateSheet.copyTo(ss);
      newSheet.setName(sheetName);
      console.log(`✅ 생성: ${sheetName}`);
    }

    console.log('✅ 202606일반주문수량표 날짜 시트 재생성 완료!');
    return { success: true };

  } catch (error) {
    console.error('❌ 실패:', error);
    return { success: false, error: error.message };
  }
}

function test_recreate202606일반주문날짜시트() {
  const result = recreate202606일반주문날짜시트();
  console.log('결과:', result);
}
