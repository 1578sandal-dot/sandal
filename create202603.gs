/**
 * 202603수량표 파일 생성 스크립트
 *
 * 작업 내용:
 * A. 첫 4개 시트 복사:
 *    1. 제품명구성
 *    2. 제품db
 *    3. 스텝표
 *    4. 수량표사본
 * B. 5번째 시트부터: 수량표사본을 복사하여 20260301일요일~20260331화요일 시트 생성
 */

function create202603수량표() {
  try {
    console.log('202603수량표 생성 시작');

    // 1. 폴더 찾기
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const subFolder = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202602수량표 파일 열기 (소스 파일)
    const source202602 = openSpreadsheetInFolder(subFolder, '202602수량표');
    if (!source202602) {
      throw new Error('202602수량표 파일을 찾을 수 없습니다.');
    }

    console.log('202602수량표 파일 열기 완료');

    // 3. 새 파일 생성
    const newFile = SpreadsheetApp.create('202603수량표');
    console.log('새 파일 생성 완료: 202603수량표');

    // 4. 새 파일을 올바른 폴더로 이동
    const file = DriveApp.getFileById(newFile.getId());
    file.moveTo(subFolder);
    console.log('파일을 🔢작업수량리스트🔢 폴더로 이동 완료');

    // 5. 기본 시트 삭제 예약 (나중에 삭제)
    const defaultSheet = newFile.getSheets()[0];

    // 6. A. 첫 4개 시트 복사 (제품명구성, 제품db, 스텝표, 수량표사본)
    const sheetsToCopy = ['제품명구성', '제품db', '스텝표', '수량표사본'];

    console.log(`복사할 시트: ${sheetsToCopy.join(', ')}`);

    for (let i = 0; i < sheetsToCopy.length; i++) {
      const sheetName = sheetsToCopy[i];
      const sourceSheet = source202602.getSheetByName(sheetName);

      if (!sourceSheet) {
        console.warn(`⚠️ 시트를 찾을 수 없음: ${sheetName}, 건너뜀`);
        continue;
      }

      const copiedSheet = sourceSheet.copyTo(newFile);
      copiedSheet.setName(sheetName);
      console.log(`✅ 시트 복사 완료: ${sheetName}`);
    }

    // 7. 수량표사본 시트 찾기 (템플릿으로 사용)
    let templateSheet = newFile.getSheetByName('수량표사본');
    if (!templateSheet) {
      throw new Error('수량표사본 시트를 찾을 수 없습니다.');
    }

    console.log('템플릿 시트(수량표사본) 찾기 완료');

    // 8. B. 2026년 3월 1일~31일 시트 생성 (5번째 시트부터)
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

    for (let day = 1; day <= 31; day++) {
      const date = new Date(2026, 2, day); // 2026년 3월 (월은 0부터 시작하므로 2)
      const dayOfWeek = weekdays[date.getDay()];
      const dayStr = String(day).padStart(2, '0');
      const sheetName = `202603${dayStr}${dayOfWeek}요일`;

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

    console.log('✅ 202603수량표 생성 완료!');
    console.log(`총 시트 개수: ${newFile.getSheets().length}개`);
    console.log(`파일 URL: ${newFile.getUrl()}`);

    return {
      success: true,
      fileUrl: newFile.getUrl(),
      sheetCount: newFile.getSheets().length
    };

  } catch (error) {
    console.error('❌ 202603수량표 생성 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

function openSpreadsheetInFolder(folder, fileName) {
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
function test_create202603() {
  const result = create202603수량표();
  console.log('실행 결과:', result);
}

/**
 * 202603수량표에 서식 지정 스크립트 추가 안내
 */
function add서식지정Script202603() {
  try {
    console.log('서식 지정 스크립트 추가 시작');

    // 1. 폴더 찾기
    const rootFolder = DriveApp.getFoldersByName('SANDAL').next();
    const subFolder = rootFolder.getFoldersByName('🔢작업수량리스트🔢').next();

    // 2. 202603수량표 파일 열기
    const target202603 = openSpreadsheetInFolder(subFolder, '202603수량표');
    if (!target202603) {
      throw new Error('202603수량표 파일을 찾을 수 없습니다.');
    }

    console.log('202603수량표 파일 열기 완료');

    // 3. 안내 메시지 표시
    const message =
      '✅ 202603수량표 파일을 열었습니다.\n\n' +
      '다음 단계:\n' +
      '1. 202602수량표를 열어 확장 프로그램 > Apps Script 실행\n' +
      '2. Code.gs의 전체 코드를 복사\n' +
      '3. 202603수량표에서 확장 프로그램 > Apps Script 실행\n' +
      '4. Code.gs 파일을 만들고 복사한 코드 붙여넣기\n' +
      '5. 저장 후 스프레드시트 새로고침\n\n' +
      '파일 URL: ' + target202603.getUrl();

    console.log(message);

    return {
      success: true,
      fileUrl: target202603.getUrl(),
      message: message
    };

  } catch (error) {
    console.error('❌ 스크립트 추가 실패:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
