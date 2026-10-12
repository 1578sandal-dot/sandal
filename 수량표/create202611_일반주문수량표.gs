/**
 * 202611일반주문수량표 파일 생성 스크립트
 *
 * 작업 내용:
 * A. 다음 시트 복사 (202610일반주문수량표에서):
 *    1. 제품명구성
 *    2. 제품db
 *    3. 수량표사본
 * B. 수량표사본 시트를 복사하여 20261101일요일~20261130월요일 시트 생성
 * 폴더: SANDAL > 🔢작업수량리스트🔢
 * (2026-10-12: 기존 "SANDAL > 일반주문 > 수량표" 경로에서 변경됨 — 202610일반주문수량표도
 *  실제로는 🔢작업수량리스트🔢 폴더에 있음, 조식수량표와 동일 폴더로 통합)
 */

// 202610일반주문수량표 파일 ID (2026-10-12 확인, 파일명 검색 대신 직접 지정)
const SOURCE_202610_ID = '150X2XQoICzmD5cTWJ49mN2X5vComtnr30mSy778Shhs';

function create202611일반주문수량표() {
  try {
    console.log('202611일반주문수량표 생성 시작');

    // 1. 폴더 찾기 (SANDAL > 🔢작업수량리스트🔢 — 202610일반주문수량표와 동일 폴더)
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const 작업수량리스트폴더 = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202610일반주문수량표 파일 열기 (소스 파일, ID로 직접 지정)
    const source202610 = SpreadsheetApp.openById(SOURCE_202610_ID);
    console.log('202610일반주문수량표 파일 열기 완료');

    // 3. 새 파일 생성
    const newFile = SpreadsheetApp.create('202611일반주문수량표');
    console.log('새 파일 생성 완료: 202611일반주문수량표');

    // 4. 새 파일을 올바른 폴더로 이동
    const file = DriveApp.getFileById(newFile.getId());
    file.moveTo(작업수량리스트폴더);
    console.log('파일을 SANDAL > 🔢작업수량리스트🔢 폴더로 이동 완료');

    // 5. 기본 시트 삭제 예약
    const defaultSheet = newFile.getSheets()[0];

    // 6. 시트 복사 (202610일반주문수량표 실제 구성 기준)
    const sheetsToCopy = ['제품명구성', '제품db', '수량표사본'];

    console.log(`복사할 시트: ${sheetsToCopy.join(', ')}`);

    for (let i = 0; i < sheetsToCopy.length; i++) {
      const sheetName = sheetsToCopy[i];
      const sourceSheet = source202610.getSheetByName(sheetName);

      if (!sourceSheet) {
        console.warn(`⚠️ 시트를 찾을 수 없음: ${sheetName}, 건너뜀`);
        continue;
      }

      const copiedSheet = sourceSheet.copyTo(newFile);
      copiedSheet.setName(sheetName);
      console.log(`✅ 시트 복사 완료: ${sheetName}`);
    }

    // 7. 수량표사본 시트 찾기 (날짜 시트 템플릿으로 사용)
    const templateSheetName = '수량표사본';
    let templateSheet = source202610.getSheetByName(templateSheetName);
    if (!templateSheet) {
      throw new Error(`${templateSheetName} 시트를 찾을 수 없습니다.`);
    }

    console.log(`템플릿 시트(${templateSheetName}) 찾기 완료`);

    // 8. 2026년 11월 1일~30일 시트 생성
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 30; day++) {
      const date = new Date(2026, 10, day); // 2026년 11월 (월은 0부터 시작하므로 10)
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202611${dayStr}${dayOfWeek}요일`;

      const newSheet = templateSheet.copyTo(newFile);
      newSheet.setName(sheetName);

      console.log(`✅ 날짜 시트 생성 완료: ${sheetName}`);
    }

    // 9. 기본 시트 삭제
    if (defaultSheet) {
      newFile.deleteSheet(defaultSheet);
      console.log('기본 시트 삭제 완료');
    }

    console.log('✅ 202611일반주문수량표 생성 완료!');
    console.log(`총 시트 개수: ${newFile.getSheets().length}개`);
    console.log(`파일 URL: ${newFile.getUrl()}`);

    return {
      success: true,
      fileUrl: newFile.getUrl(),
      fileId: newFile.getId(),
      sheetCount: newFile.getSheets().length
    };

  } catch (error) {
    console.error('❌ 202611일반주문수량표 생성 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 테스트 실행 함수
function test_create202611일반주문() {
  const result = create202611일반주문수량표();
  console.log('실행 결과:', result);
}
