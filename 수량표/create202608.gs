/**
 * 202608수량표 파일 생성 스크립트
 *
 * 작업 내용:
 * A. 다음 시트 복사 (202607조식수량표에서):
 *    1. 출력전용
 *    2. 변경히스토리
 *    3. 제품명구성
 *    4. 제품db
 *    5. 스텝표
 *    6. 당근스텝
 *    7. 작업팀회의
 *    8. 수량표사본
 * B. 수량표사본 시트를 복사하여 20260801토요일~20260831월요일 시트 생성
 */

const SOURCE_202607_ID = '1_0qOEQZWY5uaEXz3WSyLvmm7_Nr2BoI7e2UHO-iRCKk';
const NEW_202608_ID = '1sStFR4A1s3KuNVzMei4JNEsaxUuGz5Qrj4xAGmlUmhE';

// 이미 생성된 202608조식수량표에 누락된 시트만 보충 복사
function addMissingSheetsTo202608() {
  const source202607 = SpreadsheetApp.openById(SOURCE_202607_ID);
  const target202608 = SpreadsheetApp.openById(NEW_202608_ID);

  const missingSheets = ['변경히스토리', '당근스텝'];

  missingSheets.forEach(sheetName => {
    if (target202608.getSheetByName(sheetName)) {
      console.log(`이미 존재함: ${sheetName}, 건너뜀`);
      return;
    }
    const sourceSheet = source202607.getSheetByName(sheetName);
    if (!sourceSheet) {
      console.warn(`⚠️ 원본에서 시트를 찾을 수 없음: ${sheetName}`);
      return;
    }
    const copiedSheet = sourceSheet.copyTo(target202608);
    copiedSheet.setName(sheetName);
    console.log(`✅ 보충 복사 완료: ${sheetName}`);
  });

  console.log('보충 작업 완료');
}

function create202608수량표() {
  try {
    console.log('202608수량표 생성 시작');

    // 1. 폴더 찾기
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const subFolder = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202607조식수량표 파일 열기 (소스 파일, fileId로 직접 참조)
    const source202607 = SpreadsheetApp.openById(SOURCE_202607_ID);
    console.log('202607조식수량표 파일 열기 완료');

    // 3. 새 파일 생성
    const newFile = SpreadsheetApp.create('202608조식수량표');
    console.log('새 파일 생성 완료: 202608조식수량표');

    // 4. 새 파일을 올바른 폴더로 이동
    const file = DriveApp.getFileById(newFile.getId());
    file.moveTo(subFolder);
    console.log('파일을 🔢작업수량리스트🔢 폴더로 이동 완료');

    // 5. 기본 시트 삭제 예약
    const defaultSheet = newFile.getSheets()[0];

    // 6. 시트 복사
    const sheetsToCopy = ['출력전용', '변경히스토리', '제품명구성', '제품db', '스텝표', '당근스텝', '작업팀회의', '수량표사본'];

    console.log(`복사할 시트: ${sheetsToCopy.join(', ')}`);

    for (let i = 0; i < sheetsToCopy.length; i++) {
      const sheetName = sheetsToCopy[i];
      const sourceSheet = source202607.getSheetByName(sheetName);

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
    let templateSheet = source202607.getSheetByName(templateSheetName);
    if (!templateSheet) {
      throw new Error(`${templateSheetName} 시트를 찾을 수 없습니다. 202607조식수량표에서 해당 시트를 확인해 주세요.`);
    }

    console.log(`템플릿 시트(${templateSheetName}) 찾기 완료`);

    // 8. 2026년 8월 1일~31일 시트 생성
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 31; day++) {
      const date = new Date(2026, 7, day); // 2026년 8월 (월은 0부터 시작하므로 7)
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202608${dayStr}${dayOfWeek}요일`;

      const newSheet = templateSheet.copyTo(newFile);
      newSheet.setName(sheetName);

      console.log(`✅ 날짜 시트 생성 완료: ${sheetName}`);
    }

    // 9. 기본 시트 삭제
    if (defaultSheet) {
      newFile.deleteSheet(defaultSheet);
      console.log('기본 시트 삭제 완료');
    }

    console.log('✅ 202608수량표 생성 완료!');
    console.log(`총 시트 개수: ${newFile.getSheets().length}개`);
    console.log(`파일 URL: ${newFile.getUrl()}`);

    return {
      success: true,
      fileUrl: newFile.getUrl(),
      sheetCount: newFile.getSheets().length
    };

  } catch (error) {
    console.error('❌ 202608수량표 생성 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 테스트 실행 함수
function test_create202608() {
  const result = create202608수량표();
  console.log('실행 결과:', result);
}
