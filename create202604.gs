/**
 * 202604수량표 파일 생성 스크립트
 *
 * 작업 내용:
 * A. 첫 4개 시트 복사 (202603수량표에서):
 *    1. 제품명구성
 *    2. 제품db
 *    3. 스텝표
 *    4. 수량표사본
 * B. 5번째 시트부터: 20260313금요일 시트를 복사하여 20260401수요일~20260430목요일 시트 생성
 */

function create202604수량표() {
  try {
    console.log('202604수량표 생성 시작');

    // 1. 폴더 찾기
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const subFolder = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202603수량표 파일 열기 (소스 파일)
    const source202603 = openSpreadsheetInFolder604(subFolder, '202603수량표');
    if (!source202603) {
      throw new Error('202603수량표 파일을 찾을 수 없습니다.');
    }

    console.log('202603수량표 파일 열기 완료');

    // 3. 새 파일 생성
    const newFile = SpreadsheetApp.create('202604수량표');
    console.log('새 파일 생성 완료: 202604수량표');

    // 4. 새 파일을 올바른 폴더로 이동
    const file = DriveApp.getFileById(newFile.getId());
    file.moveTo(subFolder);
    console.log('파일을 🔢작업수량리스트🔢 폴더로 이동 완료');

    // 5. 기본 시트 삭제 예약 (나중에 삭제)
    const defaultSheet = newFile.getSheets()[0];

    // 6. A. 첫 4개 시트 복사 (제품명구성, 제품db, 스텝표, 수량표)
    const sheetsToCopy = ['제품명구성', '제품db', '스텝표', '수량표'];

    console.log(`복사할 시트: ${sheetsToCopy.join(', ')}`);

    for (let i = 0; i < sheetsToCopy.length; i++) {
      const sheetName = sheetsToCopy[i];
      const sourceSheet = source202603.getSheetByName(sheetName);

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
    let templateSheet = source202603.getSheetByName(templateSheetName);
    if (!templateSheet) {
      throw new Error(`${templateSheetName} 시트를 찾을 수 없습니다. 202603수량표에서 해당 시트를 확인해 주세요.`);
    }

    console.log(`템플릿 시트(${templateSheetName}) 찾기 완료`);

    // 8. B. 2026년 4월 1일~30일 시트 생성 (5번째 시트부터)
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 30; day++) {
      const date = new Date(2026, 3, day); // 2026년 4월 (월은 0부터 시작하므로 3)
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202604${dayStr}${dayOfWeek}요일`;

      // 템플릿 복사
      const newSheet = templateSheet.copyTo(newFile);
      newSheet.setName(sheetName);

      console.log(`✅ 날짜 시트 생성 완료: ${sheetName}`);
    }

    // 9. 기본 시트 삭제
    if (defaultSheet) {
      newFile.deleteSheet(defaultSheet);
      console.log('기본 시트 삭제 완료');
    }

    console.log('✅ 202604수량표 생성 완료!');
    console.log(`총 시트 개수: ${newFile.getSheets().length}개`);
    console.log(`파일 URL: ${newFile.getUrl()}`);

    return {
      success: true,
      fileUrl: newFile.getUrl(),
      sheetCount: newFile.getSheets().length
    };

  } catch (error) {
    console.error('❌ 202604수량표 생성 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function openSpreadsheetInFolder604(folder, fileName) {
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
function test_create202604() {
  const result = create202604수량표();
  console.log('실행 결과:', result);
}
