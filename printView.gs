/**
 * 출력전용 시트 관리 스크립트
 *
 * [출력전용] 시트의 B2 셀에 날짜(예: 20260403) 입력 시
 * onEdit 트리거로 자동 데이터 갱신
 *
 * 구성:
 * 1. 전체 수량 요약 (58행 최종작업 영역 기준)
 * 2. 업체별 수량 (A~D열 기준)
 */

const PCONFIG = {
  OUTPUT_SHEET: '출력전용',
  DATE_CELL: 'B2',             // 날짜 입력 셀
  FINAL_ROW: 57,               // 최종작업 헤더 행 (58행부터 데이터 시작)
  COMPANY_END_ROW: 9999,       // 업체 데이터 끝 행 (202행 이후 일반주문건 포함, 시트 끝까지)
  CATEGORIES: [
    { name: '샌드위치',            nameCol: 7,  qtyCol: 8  },
    { name: '유부초밥/사이드/컵밥', nameCol: 11, qtyCol: 12 },
    { name: '김밥',               nameCol: 15, qtyCol: 16 },
    { name: '과일/샐러드',         nameCol: 19, qtyCol: 20 },
    { name: '기타',               nameCol: 23, qtyCol: 24 },
  ],
};

// ========== 출력전용 시트 초기 생성 ==========

function 출력뷰생성() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(PCONFIG.OUTPUT_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(PCONFIG.OUTPUT_SHEET);
  }

  // 기본 레이아웃 설정
  sheet.clearContents();
  sheet.clearFormats();

  // 날짜 입력 안내
  sheet.getRange('A1').setValue('날짜 입력').setFontWeight('bold').setFontSize(12);
  sheet.getRange('B2').setValue('').setBackground('#FFF2CC');
  sheet.getRange('A2').setValue('날짜 (예: 20260403)').setFontSize(11);

  // 안내 메시지
  sheet.getRange('A4').setValue('※ B2 셀에 날짜를 입력하면 자동으로 데이터가 불러와집니다.')
    .setFontColor('#888888').setFontSize(10);

  // 열 너비
  sheet.setColumnWidth(1, 200);  // A: 제품명
  sheet.setColumnWidth(2, 80);   // B: 수량
  sheet.setColumnWidth(3, 120);  // C: 이미지
  sheet.setColumnWidth(4, 20);   // D: 구분 (최소)
  sheet.setColumnWidth(5, 200);  // E: 제품명
  sheet.setColumnWidth(6, 80);   // F: 수량
  sheet.setColumnWidth(7, 120);  // G: 이미지
  sheet.setColumnWidth(8, 20);   // H: 구분 (최소)

  SpreadsheetApp.getUi().alert('출력전용 시트가 생성됐습니다.\nB2 셀에 날짜를 입력하세요.');
}

// ========== 데이터 갱신 ==========

function refreshOutputSheet(sheet) {
  const dateInput = String(sheet.getRange(PCONFIG.DATE_CELL).getValue()).trim();
  if (!dateInput || dateInput.length < 8) return;

  const ss = sheet.getParent();

  // 날짜 시트 찾기
  const targetSheet = ss.getSheets().find(s => s.getName().startsWith(dateInput));
  if (!targetSheet) {
    sheet.getRange('A6').setValue('❌ "' + dateInput + '" 시트를 찾을 수 없습니다.');
    return;
  }

  // 데이터 읽기
  const lastRow = targetSheet.getLastRow();
  const lastCol = Math.max(targetSheet.getLastColumn(), 24);
  const allData = targetSheet.getRange(1, 1, lastRow, lastCol).getValues();

  // 열 너비 설정 - A4 가로 100% 기준 (총 ~1060px 안에 맞춤)
  sheet.setColumnWidth(1, 950);  // A: 제품명
  sheet.setColumnWidth(2, 150);  // B: 수량
  sheet.setColumnWidth(3, 200);  // C: 이미지
  sheet.setColumnWidth(4, 1);    // D~H: 미사용
  sheet.setColumnWidth(5, 1);
  sheet.setColumnWidth(6, 1);
  sheet.setColumnWidth(7, 1);
  sheet.setColumnWidth(8, 1);

  // 기존 데이터 영역 클리어 (6행 이후)
  const maxRow = sheet.getMaxRows();
  if (maxRow >= 6) {
    sheet.getRange(6, 1, maxRow - 5, 8).clearContent().clearFormat();
  }

  let currentRow = 6;

  // 1. 전체 수량 요약
  currentRow = writeTotalSummary(sheet, currentRow, allData, targetSheet.getName());

  currentRow += 1;

  // 2. 업체별 수량
  currentRow = writeCompanySummary(sheet, currentRow, allData, dateInput);

  // 데이터 행 높이 자동 맞춤 (폰트 크기에 맞게)
  const lastDataRow = currentRow - 1;
  if (lastDataRow >= 6) {
    sheet.setRowHeightsForced(6, lastDataRow - 5, 90);
  }
  sheet.getParent().toast('완료: ' + lastDataRow + '행까지');

  sheet.setHiddenGridlines(true);
}

// ========== 1. 전체 수량 요약 ==========

function writeTotalSummary(sheet, startRow, allData, sheetName) {
  const headerIdx = PCONFIG.FINAL_ROW - 1; // 0-based

  // 모든 항목을 flat list로 수집 (카테고리 헤더 + 제품)
  const items = []; // { type: 'catHeader'|'item', name, qty }

  PCONFIG.CATEGORIES.forEach(cat => {
    const catItems = [];
    for (let r = headerIdx + 1; r < allData.length; r++) {
      const name = allData[r][cat.nameCol - 1];
      const qty  = allData[r][cat.qtyCol - 1];
      if (!name || String(name).trim() === '') break;
      const nameStr = String(name).trim();
      if (nameStr.includes('최종 작업')) {
        const subCatName = nameStr.replace('최종 작업', '').trim();
        if (subCatName !== cat.name) {
          catItems.push({ type: 'catHeader', name: subCatName });
        }
        continue;
      }
      const qtyNum = Number(qty);
      if (qtyNum <= 0) continue;
      catItems.push({ type: 'item', name: shortenName(nameStr), qty: qtyNum });
    }
    if (catItems.length > 0) {
      items.push({ type: 'catHeader', name: cat.name });
      catItems.forEach(it => items.push(it));
    }
  });

  const rows = [];
  const formats = [];

  // 섹션 헤더
  rows.push(['[ 전체 작업 수량 ] - ' + sheetName, '']);
  formats.push({ sectionHeader: true });

  items.forEach(item => {
    if (item.type === 'catHeader') {
      rows.push([item.name, '']);
      formats.push({ isCat: true });
    } else {
      rows.push(['  ' + item.name, item.qty]);
      formats.push({ isItem: true });
    }
  });

  // 한 번에 쓰기
  if (rows.length > 0) {
    sheet.getRange(startRow, 1, rows.length, 2).setValues(rows);
    formats.forEach((f, i) => {
      const r = startRow + i;
      if (f.sectionHeader) {
        sheet.getRange(r, 1, 1, 2).setBackground('#1F4E79').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(50);
      } else if (f.isCat) {
        sheet.getRange(r, 1, 1, 2).setBackground('#BDD7EE').setFontWeight('bold').setFontSize(45);
      } else if (f.isItem) {
        sheet.getRange(r, 1).setFontSize(50);
        sheet.getRange(r, 2).setFontWeight('bold').setFontSize(50).setBackground('#FFFF99');
      }
    });
  }

  return startRow + rows.length;
}

// ========== 2. 업체별 수량 ==========

function writeCompanySummary(sheet, startRow, allData, dateInput) {
  const rows = [];
  const formats = [];

  // 섹션 헤더
  rows.push(['[ 업체별 수량 ]', '']);
  formats.push({ isSectionHeader: true });

  // 업체 파싱
  const companies = [];
  let i = 0;
  const endRow = Math.min(PCONFIG.COMPANY_END_ROW, allData.length);

  // 주차 헤더 감지 (예: "1주", "2주", "3주", "4주", "5주")
  function isWeekHeader(val) {
    return val && /^\d+주$/.test(String(val).trim());
  }

  // A열이 숫자(업체 번호)인지 확인
  function isCompanyRow(aVal) {
    if (!aVal) return false;
    const n = Number(aVal);
    return Number.isInteger(n) && n > 0;
  }

  // === 섹션 1: 일반 업체 (A열 번호 + B열 업체명, 2~200행) ===
  const section1End = Math.min(200, endRow);
  while (i < section1End) {
    const row = allData[i];
    if (!row) { i++; continue; }

    const aVal = row[0];
    const bVal = row[1];
    const cVal = row[2];
    const dVal = row[3];

    // 주차 헤더 행("1주", "2주" 등) 스킵
    if (isWeekHeader(aVal) || isWeekHeader(bVal)) { i++; continue; }

    // A열이 숫자이고 B열에 업체명이 있는 경우 → 업체 헤더 행
    if (isCompanyRow(aVal) && bVal && String(bVal).trim() !== '' && !isDateVal(bVal)) {
      const company = { name: String(bVal).trim(), products: [] };

      if (cVal && !isDateVal(cVal) && String(cVal).trim() !== '') {
        const qty = Number(dVal);
        if (qty > 0) company.products.push({ name: String(cVal).trim(), qty: qty });
      }

      i++;
      while (i < section1End) {
        const nr = allData[i];
        if (!nr) { i++; continue; }
        const na = nr[0];
        const nb = nr[1];
        const nc = nr[2];
        const nd = nr[3];

        if (isCompanyRow(na) && nb && String(nb).trim() !== '' && !isDateVal(nb)) break;
        if (isWeekHeader(na) || isWeekHeader(nb)) { i++; continue; }

        if (nc && !isDateVal(nc) && String(nc).trim() !== '') {
          const qty = Number(nd);
          if (qty > 0) company.products.push({ name: String(nc).trim(), qty: qty });
        }
        i++;
      }

      if (company.products.length > 0) companies.push(company);
      continue;
    }
    i++;
  }

  // === 섹션 2: 일반주문건 (202행~, 세로 블록 형식) ===
  // 헤더행: A="", B="내용", C=업체명, D="수량"
  // 데이터행: A=필드명("배송시간","수령인","주소","문구번호","문구내용"), B=값, C=제품명, D=수량
  i = 201; // 202행 (0-based)
  while (i < endRow) {
    const row = allData[i];
    if (!row) { i++; continue; }

    const bVal = String(row[1]).trim();
    const cVal = row[2];
    const dVal = String(row[3]).trim();

    // 업체 블록 헤더: B="내용", C=업체명, D="수량"
    if (bVal === '내용' && cVal && String(cVal).trim() !== '' && dVal === '수량') {
      const company = {
        name: String(cVal).trim(),
        time: '',
        orderer: '',
        recipient: '',
        address: '',
        stickerNo: '',
        stickerText: '',
        products: [],
        isOrder: true,
      };

      i++;
      while (i < endRow) {
        const nr = allData[i];
        if (!nr) { i++; break; }
        const na = String(nr[0]).trim();
        const nb = String(nr[1]).trim();
        const nc = nr[2];
        const nd = nr[3];

        // 다음 블록 시작이면 중단
        if (nb === '내용' && nc && String(nd).trim() === '수량') break;

        // 필드 파싱
        if (na === '배송시간') company.time = nb;
        if (na === '주문자')   company.orderer = nb;
        if (na === '수령인')   company.recipient = nb;
        if (na === '주소')     company.address = shortenAddress(nb);
        if (na === '문구번호') company.stickerNo = nb;
        if (na === '문구내용') company.stickerText = nb;

        // 제품: C열 제품명(날짜 제외), D열 수량
        if (nc && String(nc).trim() !== '' && !isDateVal(nc)) {
          const qty = Number(nd);
          if (qty > 0) company.products.push({ name: String(nc).trim(), qty: qty });
        }
        i++;
      }

      if (company.products.length > 0) companies.push(company);
      continue;
    }
    i++;
  }

  // 업체별 출력 (4열씩 2열로 나란히)
  // 1열로 순서대로 출력
  const imageJobs = [];

  companies.forEach(company => {
    const blockStartRow = startRow + rows.length;

    // 업체명 헤더
    rows.push([company.name, '']);
    formats.push({ isHeader: true, isOrder: !!company.isOrder });

    // 일반주문건 추가 정보
    if (company.isOrder) {
      const info1 = [company.time, company.recipient, company.address].filter(v => v).join('  |  ');
      if (info1) { rows.push(['  ' + info1, '']); formats.push({ isInfo: true }); }
      const info2 = [company.stickerNo ? '문구 ' + company.stickerNo : '', company.stickerText].filter(v => v).join(' ');
      if (info2) { rows.push(['  ' + info2, '']); formats.push({ isInfo: true }); }
      // 이미지 예약
      if (company.orderer) {
        imageJobs.push({ row: blockStartRow, col: 3, orderer: company.orderer, height: Math.min(5, 1 + company.products.length) });
      }
    }

    // 제품
    company.products.forEach(p => {
      rows.push(['  ' + p.name, p.qty]);
      formats.push({ isItem: true });
    });
  });

  // 한 번에 쓰기
  if (rows.length > 0) {
    sheet.getRange(startRow, 1, rows.length, 2).setValues(rows);
    formats.forEach((f, i) => {
      const r = startRow + i;
      if (f.isSectionHeader) {
        sheet.getRange(r, 1, 1, 2).setBackground('#1F4E79').setFontColor('#FFFFFF').setFontWeight('bold').setFontSize(50);
      } else if (f.isHeader) {
        const bg = f.isOrder ? '#FCE5CD' : '#D9EAD3';
        sheet.getRange(r, 1, 1, 2).setBackground(bg).setFontWeight('bold').setFontSize(50);
      } else if (f.isInfo) {
        sheet.getRange(r, 1, 1, 2).setBackground('#EAF4FB').setFontSize(45).setFontColor('#444444');
      } else if (f.isItem) {
        sheet.getRange(r, 1).setFontSize(50);
        sheet.getRange(r, 2).setFontWeight('bold').setFontSize(50).setBackground('#FFFF99');
      }
    });
  }

  // 이미지 삽입 (비활성화 - 이미지 매칭 문제 해결 전까지)
  Logger.log('imageJobs 수: ' + imageJobs.length);
  imageJobs.forEach(j => Logger.log('job: row=' + j.row + ' col=' + j.col + ' orderer=' + j.orderer));
  if (dateInput && imageJobs.length > 0) {
    try {
      const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
      imageJobs.forEach(job => {
        const url = findImageUrl(folder, dateInput, job.orderer);
        Logger.log('이미지 url: ' + url + ' for ' + job.orderer);
        if (url) {
          if (job.height > 1) {
            sheet.getRange(job.row, job.col, job.height, 1).merge();
          }
          sheet.getRange(job.row, job.col).setFormula('=IMAGE("' + url + '",1)');
          // 이미지 블록 행 높이 고정 (5행 균등 분배, 총 200px)
          for (let h = 0; h < job.height; h++) {
            sheet.setRowHeight(job.row + h, 90);
          }
        }
      });
    } catch (e) {
      Logger.log('이미지 삽입 오류: ' + e.message);
    }
  }

  return startRow + rows.length;
}

// ========== 이미지 삽입 ==========

const IMAGE_FOLDER_ID = '1IEV1DXV30UGeNbC4vnTaR6zNzkzLEVGT';

function findImageUrl(folder, dateInput, orderer) {
  try {
    const prefix = dateInput + '-' + orderer;
    // 확장자 포함/미포함 모두 시도
    const candidates = [prefix + '.png', prefix + '.jpg', prefix + '.jpeg', prefix];
    for (const name of candidates) {
      const files = folder.getFilesByName(name);
      if (files.hasNext()) {
        const file = files.next();
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return 'https://drive.google.com/uc?export=view&id=' + file.getId();
      }
    }
    // 접두사로 검색 (파일명이 prefix로 시작하는 경우)
    const allFiles = folder.getFiles();
    while (allFiles.hasNext()) {
      const file = allFiles.next();
      const name = file.getName();
      if (name.startsWith(prefix)) {
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        return 'https://drive.google.com/uc?export=view&id=' + file.getId();
      }
    }
  } catch (e) {
    Logger.log('이미지 검색 오류: ' + e.message);
  }
  return null;
}

// ========== 유틸 ==========

// 카테고리 헤더에 해당하는 단어를 제품명에서 제거
const REMOVE_KEYWORDS = ['샌드위치', '유부초밥', '김밥', '베이글', '컵밥'];

function shortenName(name) {
  let result = name;
  for (const keyword of REMOVE_KEYWORDS) {
    result = result.replace(keyword, '');
  }
  return result.trim();
}

// 주소에서 시/도 + 구/시/군만 추출 (예: "서울특별시 마포구 신촌로66..." → "서울특별시 마포구")
function shortenAddress(addr) {
  if (!addr) return '';
  const parts = String(addr).trim().split(/\s+/);
  // 첫 번째: 시/도, 두 번째: 구/시/군
  if (parts.length >= 2) return parts[0] + ' ' + parts[1];
  return parts[0] || '';
}

function isDateVal(val) {
  if (val instanceof Date) return true;
  const s = String(val);
  return /^\d{4}[\.\-]\s*\d+/.test(s) || /GMT/.test(s);
}

// ========== 수동 갱신 (편집기에서 직접 실행) ==========
function manualRefresh() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(PCONFIG.OUTPUT_SHEET);
  if (!sheet) { Logger.log('출력전용 시트 없음'); return; }
  refreshOutputSheet(sheet);
  Logger.log('갱신 완료');
}

// ========== 디버그: 이미지 검색 확인 ==========
function debug이미지() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const outputSheet = ss.getSheetByName(PCONFIG.OUTPUT_SHEET);
  const dateInput = String(outputSheet.getRange(PCONFIG.DATE_CELL).getValue()).trim();
  Logger.log('dateInput: ' + dateInput);

  // 날짜 시트에서 주문자 파싱 확인
  const targetSheet = ss.getSheets().find(s => s.getName().startsWith(dateInput));
  if (targetSheet) {
    const lastRow = targetSheet.getLastRow();
    const allData = targetSheet.getRange(1, 1, lastRow, 4).getValues();
    let i = 201;
    while (i < allData.length) {
      const row = allData[i];
      const bVal = String(row[1]).trim();
      const cVal = row[2];
      const dVal = String(row[3]).trim();
      if (bVal === '내용' && cVal && dVal === '수량') {
        Logger.log('블록: ' + String(cVal).trim());
        // 이 블록에서 주문자 찾기
        let j = i + 1;
        while (j < allData.length) {
          const nr = allData[j];
          const na = String(nr[0]).trim();
          const nb = String(nr[1]).trim();
          if (nb === '내용' && nr[2] && String(nr[3]).trim() === '수량') break;
          if (na === '주문자') Logger.log('  주문자: "' + nb + '"');
          j++;
        }
        i = j;
        continue;
      }
      i++;
    }
  }

  try {
    const folder = DriveApp.getFolderById(IMAGE_FOLDER_ID);
    Logger.log('폴더: ' + folder.getName());
    // 접두사 검색 테스트
    const prefix = dateInput + '-';
    const allFiles = folder.getFiles();
    let count = 0;
    while (allFiles.hasNext() && count < 5) {
      const f = allFiles.next();
      if (f.getName().startsWith(prefix)) {
        Logger.log('매칭 파일: ' + f.getName());
        count++;
      }
    }
    if (count === 0) Logger.log(prefix + '로 시작하는 파일 없음');
  } catch (e) {
    Logger.log('오류: ' + e.message);
  }
}

// ========== 디버그: 202행 이후 실제 값 확인 ==========
function debug일반주문() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const outputSheet = ss.getSheetByName(PCONFIG.OUTPUT_SHEET);
  const dateInput = String(outputSheet.getRange(PCONFIG.DATE_CELL).getValue()).trim();
  const targetSheet = ss.getSheets().find(s => s.getName().startsWith(dateInput));
  if (!targetSheet) { Logger.log('시트 없음: ' + dateInput); return; }

  const lastRow = targetSheet.getLastRow();
  const startR = 206;
  const data = targetSheet.getRange(startR, 1, Math.min(15, lastRow - startR + 1), 4).getValues();

  data.forEach((row, idx) => {
    Logger.log(`행${startR + idx}: A="${row[0]}" B="${row[1]}" C="${row[2]}" D="${row[3]}"`);
  });
}
