/**
 * 202606수량표 파일 생성 스크립트
 *
 * 작업 내용:
 * A. 다음 시트 복사 (202605수량표에서):
 *    1. 조식변경내용
 *    2. 조식5월누락 → 조식6월누락으로 이름 변경
 *    3. 출력전용
 *    4. 제품명구성
 *    5. 제품db
 *    6. 스텝표
 *    7. 작업팀회의
 *    8. 수량표사본
 * B. 수량표사본 시트를 복사하여 20260601월요일~20260630화요일 시트 생성
 */

function create202606수량표() {
  try {
    console.log('202606수량표 생성 시작');

    // 1. 폴더 찾기
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const subFolder = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202605수량표 파일 열기 (소스 파일)
    const source202605 = openSpreadsheetInFolder606(subFolder, '202605수량표');
    if (!source202605) {
      throw new Error('202605수량표 파일을 찾을 수 없습니다.');
    }

    console.log('202605수량표 파일 열기 완료');

    // 3. 새 파일 생성
    const newFile = SpreadsheetApp.create('202606수량표');
    console.log('새 파일 생성 완료: 202606수량표');

    // 4. 새 파일을 올바른 폴더로 이동
    const file = DriveApp.getFileById(newFile.getId());
    file.moveTo(subFolder);
    console.log('파일을 🔢작업수량리스트🔢 폴더로 이동 완료');

    // 5. 기본 시트 삭제 예약
    const defaultSheet = newFile.getSheets()[0];

    // 6. 시트 복사
    const sheetsToCopy = ['조식변경내용', '조식5월누락', '출력전용', '제품명구성', '제품db', '스텝표', '작업팀회의', '수량표사본'];

    console.log(`복사할 시트: ${sheetsToCopy.join(', ')}`);

    for (let i = 0; i < sheetsToCopy.length; i++) {
      const sheetName = sheetsToCopy[i];
      const sourceSheet = source202605.getSheetByName(sheetName);

      if (!sourceSheet) {
        console.warn(`⚠️ 시트를 찾을 수 없음: ${sheetName}, 건너뜀`);
        continue;
      }

      const copiedSheet = sourceSheet.copyTo(newFile);
      const newSheetName = sheetName === '조식5월누락' ? '조식6월누락' : sheetName;
      copiedSheet.setName(newSheetName);
      console.log(`✅ 시트 복사 완료: ${newSheetName}`);
    }

    // 7. 수량표사본 시트 찾기 (날짜 시트 템플릿으로 사용)
    const templateSheetName = '수량표사본';
    let templateSheet = source202605.getSheetByName(templateSheetName);
    if (!templateSheet) {
      throw new Error(`${templateSheetName} 시트를 찾을 수 없습니다. 202605수량표에서 해당 시트를 확인해 주세요.`);
    }

    console.log(`템플릿 시트(${templateSheetName}) 찾기 완료`);

    // 8. 2026년 6월 1일~30일 시트 생성
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 30; day++) {
      const date = new Date(2026, 5, day); // 2026년 6월 (월은 0부터 시작하므로 5)
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202606${dayStr}${dayOfWeek}요일`;

      const newSheet = templateSheet.copyTo(newFile);
      newSheet.setName(sheetName);

      console.log(`✅ 날짜 시트 생성 완료: ${sheetName}`);
    }

    // 9. 기본 시트 삭제
    if (defaultSheet) {
      newFile.deleteSheet(defaultSheet);
      console.log('기본 시트 삭제 완료');
    }

    console.log('✅ 202606수량표 생성 완료!');
    console.log(`총 시트 개수: ${newFile.getSheets().length}개`);
    console.log(`파일 URL: ${newFile.getUrl()}`);

    return {
      success: true,
      fileUrl: newFile.getUrl(),
      sheetCount: newFile.getSheets().length
    };

  } catch (error) {
    console.error('❌ 202606수량표 생성 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function openSpreadsheetInFolder606(folder, fileName) {
  try {
    const files = folder.getFilesByName(fileName);
    if (!files.hasNext()) {
      return null;
    }
    const file = files.next();
    return SpreadsheetApp.open(file);
  } catch (error) {
    console.error(`파일 열기 실패 (${fileName}):`, error);
    return null;
  }
}

// 테스트 실행 함수
function test_create202606() {
  const result = create202606수량표();
  console.log('실행 결과:', result);
}
