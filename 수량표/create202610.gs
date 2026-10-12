/**
 * 202610수량표 파일 생성 스크립트
 *
 * 작업 내용:
 * A. 다음 시트 복사 (202609조식수량표에서):
 *    1. 출력전용
 *    2. 변경히스토리
 *    3. 제품명구성
 *    4. 제품db
 *    5. 스텝표
 *    6. 당근스텝
 *    7. 작업팀회의
 *    8. 수량표사본
 * B. 수량표사본 시트를 복사하여 20261001목요일~20261031토요일 시트 생성
 */

// 202609조식수량표 파일 ID (2026-09-17 확인, 파일명 검색 대신 직접 지정)
const SOURCE_202609_조식_ID = '1GNALHcKHfWTMGggq1kUS6PqTHwKKNqX0yssY4_Qkobk';

function create202610수량표() {
  try {
    console.log('202610수량표 생성 시작');

    // 1. 폴더 찾기
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const subFolder = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202609조식수량표 파일 열기 (소스 파일, fileId로 직접 참조)
    const source202609 = SpreadsheetApp.openById(SOURCE_202609_조식_ID);
    console.log('202609조식수량표 파일 열기 완료');

    // 3. 새 파일 생성
    const newFile = SpreadsheetApp.create('202610조식수량표');
    console.log('새 파일 생성 완료: 202610조식수량표');

    // 4. 새 파일을 올바른 폴더로 이동
    const file = DriveApp.getFileById(newFile.getId());
    file.moveTo(subFolder);
    console.log('파일을 🔢작업수량리스트🔢 폴더로 이동 완료');

    // 5. 기본 시트 삭제 예약
    const defaultSheet = newFile.getSheets()[0];

    // 6. 시트 복사 (202609조식수량표 실제 구성 기준으로 실행 전 확인 필요 —
    //    diagnose202609SheetNames()로 먼저 실제 탭 이름을 확인할 것)
    const sheetsToCopy = ['출력전용', '변경히스토리', '제품명구성', '제품db', '스텝표', '당근스텝', '작업팀회의', '수량표사본'];

    console.log(`복사할 시트: ${sheetsToCopy.join(', ')}`);

    for (let i = 0; i < sheetsToCopy.length; i++) {
      const sheetName = sheetsToCopy[i];
      const sourceSheet = source202609.getSheetByName(sheetName);

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
    let templateSheet = source202609.getSheetByName(templateSheetName);
    if (!templateSheet) {
      throw new Error(`${templateSheetName} 시트를 찾을 수 없습니다. 202609조식수량표에서 해당 시트를 확인해 주세요.`);
    }

    console.log(`템플릿 시트(${templateSheetName}) 찾기 완료`);

    // 8. 2026년 10월 1일~31일 시트 생성
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 31; day++) {
      const date = new Date(2026, 9, day); // 2026년 10월 (월은 0부터 시작하므로 9)
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202610${dayStr}${dayOfWeek}요일`;

      const newSheet = templateSheet.copyTo(newFile);
      newSheet.setName(sheetName);

      console.log(`✅ 날짜 시트 생성 완료: ${sheetName}`);
    }

    // 9. 기본 시트 삭제
    if (defaultSheet) {
      newFile.deleteSheet(defaultSheet);
      console.log('기본 시트 삭제 완료');
    }

    console.log('✅ 202610수량표 생성 완료!');
    console.log(`총 시트 개수: ${newFile.getSheets().length}개`);
    console.log(`파일 URL: ${newFile.getUrl()}`);

    return {
      success: true,
      fileUrl: newFile.getUrl(),
      fileId: newFile.getId(),
      sheetCount: newFile.getSheets().length
    };

  } catch (error) {
    console.error('❌ 202610수량표 생성 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 실행 전 확인용: 202609조식수량표의 실제 시트 탭 이름을 로그로 출력
function diagnose202609SheetNames() {
  const ss = SpreadsheetApp.openById(SOURCE_202609_조식_ID);
  const names = ss.getSheets().map(s => s.getName());
  console.log(names.join(', '));
  return names;
}

// 테스트 실행 함수
function test_create202610() {
  const result = create202610수량표();
  console.log('실행 결과:', result);
}
