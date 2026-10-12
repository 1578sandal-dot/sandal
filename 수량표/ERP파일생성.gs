/**
 * ============================================================
 *  식단표 → 이카운트 ERP 주문서 업로드 파일 자동 생성 (조식주문)
 *  설치 위치: "조식수량표"(예: 202608조식수량표) 스프레드시트의 Apps Script
 *  버전: v1.0
 * ============================================================
 *  동작: 메뉴 [📤 ERP파일] → 날짜 선택 →
 *        식단표 전 거래처 탭에서 해당 날짜의 (메뉴, 수량)을 읽어
 *        품목명→품목코드, 거래처명→거래처코드 매핑 후
 *        이카운트 "주문서입력" 웹자료올리기 서식 컬럼으로 변환하여
 *        월별 ERP업로드 파일(예: ERP업로드_202608)의 날짜별 시트에 기입.
 *  매핑 실패: 품목명이 매핑표에 없으면 그 행은 올리지 않고
 *        미리보기에서 경고 목록으로 보여준 뒤 진행 여부를 확인.
 * ============================================================
 */

const ERP_CONFIG = {
  // 식단표 파일 ID (월이 바뀌면 이 줄만 교체)
  MEAL_PLAN_FILE_ID: '1BAMkva5Z7JRDaM70-oRugGkBuYaNArSRhJBXAb6OTyg',

  // 식단표에서 파싱하지 않을 탭 (거래처 탭이 아닌 것)
  EXCLUDE_TABS: ['카테고리', '회사명/이메일', '식단표정정보', '더퓨어랩_비건'],

  // 휴무 표시로 간주할 텍스트 (이 값이 메뉴 칸에 있으면 건너뜀)
  SKIP_WORDS: ['휴무일', '공휴일', '휴무', '배송없음'],

  // ERP업로드 파일이 위치할 폴더 (수량표와 동일 폴더)
  DRIVE_ROOT_FOLDER: 'SANDAL',
  DRIVE_SUB_FOLDER: '🔢작업수량리스트🔢',

  // 이카운트 주문서입력 웹자료올리기 서식 헤더 (고정 순서, 변경 금지)
  ERP_HEADERS: ['일자', '순번', '거래처코드', '거래처명', '담당자', '출하창고', '거래유형', '통화', '환율',
    '참조', '결제조건', '유효기간', '납기일자', '검색창내용', '품목코드', '품목명', '규격', '수량', '단가',
    '외화금액', '공급가액', '부가세', '납기일자', '적요'],

  // 고정값
  FIXED_WAREHOUSE: '100',           // 출하창고: 본사창고
  FIXED_TRADE_TYPE: '부가세율 적용', // 거래유형
  FIXED_CURRENCY: '내자',           // 통화
};

// ─────────── 거래처명 → 거래처코드 매핑 (ERP_거래처코드 시트 기준) ───────────
const CUSTOMER_CODE_MAP = {
  '구다이_크레이버': 'CUST001',
  '니프코코리아': 'CUST002',
  '알로하팩토리': 'CUST003',
  '엠브레이스': 'CUST004',
  '달콤소프트': 'CUST005',
  '메리츠증권': 'CUST006',
  '메리츠증권디지털센터': 'CUST007',
  '메리츠강남프리미어센터': 'CUST008',
  '메리츠도곡동': 'CUST009',
  '크로노스튜디오': 'CUST010',
  '에이치에너지': 'CUST011',
  '비손메디칼': 'CUST012',
  '더퓨어랩': 'CUST013',
  '더퓨어랩_비건': 'CUST014',
  '핌아시아': 'CUST015',
  '르봉봉-어스얼라이언스': 'CUST016',
  '르봉봉-어스빌리지': 'CUST017',
  '대상하남': 'CUST018',
  '대상마곡': 'CUST019',
  '대상종로': 'CUST020',
};

// ─────────── 품목명 → 품목코드 매핑 (2026-07-15 이카운트 품목등록 기준, 187건 검증완료) ───────────
// key는 소문자로 정규화하여 조회 (p_ 접두 대소문자 무시)
const ITEM_CODE_MAP = {
  '클럽샌드위치1피스': 'SW001', '햄치즈에그샌드위치1피스': 'SW002',
  '클럽샌드위치2피스': 'SW003', '햄치즈에그샌드위치2피스': 'SW004',
  '참치샌드위치1피스': 'SW007', '크래미샌드위치1피스': 'SW008',
  '버터햄치즈샌드위치1피스': 'SW009', '감자샌드위치1피스': 'SW010',
  '햄치즈샌드위치1피스': 'SW011', '무화과호두크림샌드위치1피스': 'SW012',
  '누텔라바나나샌드위치1피스': 'SW013', '누텔라바나나샌드위치2피스': 'SW014',
  '크래미에그샌드위치1피스': 'SW015', '크래미에그샌드위치2피스': 'SW016',
  '베이컨대파크림샌드위치1피스': 'SW017', '베이컨대파크림샌드위치2피스': 'SW018',
  '마카로니샌드위치1피스': 'SW019', '마카로니샌드위치2피스': 'SW020',
  '블루베리크림샌드위치1피스': 'SW021', '블루베리크림샌드위치2피스': 'SW022',
  '살사후실리샌드위치1피스': 'SW023', '살사후실리샌드위치2피스': 'SW024',
  '콘에그샌드위치1피스': 'SW025', '콘에그샌드위치2피스': 'SW026',
  '단호박샌드위치1피스': 'SW027', '단호박샌드위치2피스': 'SW028',
  '리코타치즈샌드위치1피스': 'SW029', '리코타치즈샌드위치2피스': 'SW030',
  '불고기샌드위치1피스': 'SW031', '불고기샌드위치2피스': 'SW032',
  '당근라페콩불고기샌드위치1피스': 'SW033', '당근라페콩불고기샌드위치2피스': 'SW034',

  '무화과호두크림베이글1피스': 'BG001', '무화과호두크림베이글2피스': 'BG002',
  '베이컨대파크림베이글1피스': 'BG003', '베이컨대파크림베이글2피스': 'BG004',
  '블루베리크림베이글1피스': 'BG005', '블루베리크림베이글2피스': 'BG006',
  '당근라페베이글1피스': 'BG007', '당근라페베이글2피스': 'BG008',
  '바질토마토크림베이글1피스': 'BG009', '바질토마토크림베이글2피스': 'BG010',
  '닭가슴살베이글1피스': 'BG011', '닭가슴살베이글2피스': 'BG012',

  '크래미유부초밥2피스': 'CP003',
  '만두튀김': 'TG001', '돈까스': 'TG002', '닭강정': 'TG003', '떡산적': 'TG004',

  '야채볶음컵밥': 'CB001', '새우볶음컵밥': 'CB002', '김치볶음컵밥': 'CB003',
  '카레볶음컵밥': 'CB004', '낙지볶음컵밥': 'CB005', '소불고기컵밥': 'CB006',

  '일반김밥': 'KB001', '일반김밥반줄': 'KB001H',
  '치즈김밥': 'KB002', '치즈김밥반줄': 'KB002H',
  '참치김밥': 'KB003', '참치김밥반줄': 'KB003H',
  '매운어묵김밥': 'KB004', '매운어묵김밥반줄': 'KB004H',
  '샐러드김밥': 'KB005', '샐러드김밥반줄': 'KB005H',
  '무말랭이김밥': 'KB006', '무말랭이김밥반줄': 'KB006H',
  '너비아니김밥': 'KB007', '너비아니김밥반줄': 'KB007H',
  '계란김밥': 'KB008', '계란김밥반줄': 'KB008H',
  '유부김밥': 'KB009', '유부김밥반줄': 'KB009H',
  '돈까스김밥': 'KB010', '돈까스김밥반줄': 'KB010H',
  '마라김밥': 'KB011', '마라김밥반줄': 'KB011H',
  '오이당근김밥': 'KB012', '오이당근김밥반줄': 'KB012H',
  '양배추당근김밥': 'KB013', '양배추당근김밥반줄': 'KB013H',

  '키토샐러드김밥': 'KT001', '키토샐러드김밥반줄': 'KT001H',
  '키토오이김밥': 'KT002', '키토오이김밥반줄': 'KT002H',
  '키토우엉김밥': 'KT003', '키토우엉김밥반줄': 'KT003H',
  '키토양배추김밥': 'KT004', '키토양배추김밥반줄': 'KT004H',
  '키토돈까스김밥': 'KT005', '키토돈까스김밥반줄': 'KT005H',
  '키토당근너비아니김밥': 'KT006', '키토당근너비아니김밥반줄': 'KT006H',

  '과일2종': 'CP009', '과일3종': 'CP019', '과일4종': 'CP010', '과일5종': 'CP020',
  '과일6종': 'CP021', '과일7종': 'CP022', '과일양추가': 'CP023',
  '수박컵소': 'CF001', '수박컵중': 'CF002', '수박컵특대': 'CF003',

  '리코타치즈샐러드': 'SL001', '두부버섯샐러드': 'SL002', '크래미샐러드': 'SL003',
  '단호박샐러드': 'SL004', '살사후실리샐러드': 'SL005', '고구마샐러드': 'SL006',
  '닭가슴살샐러드': 'SL007', '훈제오리샐러드': 'SL008', '훈제연어샐러드': 'SL009',

  '팩주스': 'CP001', '하루견과': 'CP025', 'abc주스': 'CP026', '요거트': 'CP024',
  '쿠키1개': 'CP006', '쿠키2개': 'CP029', '쿠키3개': 'CP030',
  '마들렌1개': 'CP016', '마들렌2개': 'CP033', '마들렌3개': 'CP034',
  '초코마들렌': 'CP017', '녹차마들렌': 'CP018',
  '스콘1개': 'CP008', '스콘2개': 'CP031', '스콘3개': 'CP032',
  '단백질쉐이크': 'CP035',
  '리본포장추가': 'PK001', '생수': 'PK002', '비닐봉투': 'PK003',
  '종이봉투': 'PK004', '쿠키서비스': 'PK005',

  // 더퓨어랩 전용 (p_) — 대소문자 무시 매칭
  'p_클럽샌드위치1피스': 'PL001', 'p_햄치즈에그샌드위치1피스': 'PL002',
  'p_참치샌드위치1피스': 'PL003', 'p_크래미샌드위치1피스': 'PL004',
  'p_버터햄치즈샌드위치1피스': 'PL005', 'p_감자샌드위치1피스': 'PL006',
  'p_햄치즈샌드위치1피스': 'PL007', 'p_무화과호두크림샌드위치1피스': 'PL008',
  'p_고구마샌드위치1피스': 'PL009', 'p_누텔라바나나샌드위치1피스': 'PL010',
  'p_크래미에그샌드위치1피스': 'PL011', 'p_마카로니샌드위치1피스': 'PL012',
  'p_블루베리크림샌드위치1피스': 'PL013', 'p_살사후실리샌드위치1피스': 'PL014',
  'p_콘에그샌드위치1피스': 'PL015', 'p_단호박샌드위치1피스': 'PL016',
  'p_리코타치즈샌드위치1피스': 'PL017', 'p_불고기샌드위치1피스': 'PL018',
  'p_닭가슴살샌드위치1피스': 'PL019', 'p_바질토마토크림샌드위치1피스': 'PL020',
  'p_당근라페콩불고기샌드위치1피스': 'PL021',
  'p_유부초밥4피스': 'PL022', 'p_크래미유부초밥4피스': 'PL023',
  'p_햄유부초밥4피스': 'PL024', 'p_참치유부초밥4피스': 'PL025',
  'p_날치알유부초밥4피스': 'PL026', 'p_김치유부초밥4피스': 'PL027',
  'p_버섯유부초밥4피스': 'PL028',
  'p_일반김밥': 'PL029', 'p_참치김밥': 'PL030', 'p_매운어묵김밥': 'PL031',
  'p_샐러드김밥': 'PL032', 'p_무말랭이김밥': 'PL033', 'p_너비아니김밥': 'PL034',
  'p_계란김밥': 'PL035', 'p_유부김밥': 'PL036', 'p_돈까스김밥': 'PL037',
  'p_마라김밥': 'PL038', 'p_오이당근김밥': 'PL039', 'p_양배추당근김밥': 'PL040',
};

const ITEM_CODE_MAP_LOWER = (function () {
  const m = {};
  Object.keys(ITEM_CODE_MAP).forEach(function (k) { m[k.toLowerCase()] = ITEM_CODE_MAP[k]; });
  return m;
})();

const ERP_WEEKDAYS_KO = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

// ─────────── 메뉴 등록 ───────────
// 주의: 이 프로젝트에는 이미 onOpen()이 여러 파일(웹앱_수량표동기화.gs 등)에
// 정의되어 있어 새 onOpen을 추가하면 충돌합니다.
// 아래 erpAddMenu_()를 기존 onOpen() 중 하나에 한 줄 추가해 호출하세요:
//   function onOpen() { ...기존 코드...; erpAddMenu_(); }
function erpAddMenu_() {
  SpreadsheetApp.getUi()
    .createMenu('📤 ERP파일')
    .addItem('내일 ERP파일 생성', 'erpGenerateTomorrow')
    .addItem('오늘 ERP파일 생성', 'erpGenerateToday')
    .addItem('날짜 지정 ERP파일 생성…', 'erpGeneratePickDate')
    .addToUi();
}

function erpGenerateToday() { erpRun_(new Date()); }
function erpGenerateTomorrow() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  erpRun_(d);
}
function erpGeneratePickDate() {
  const ui = SpreadsheetApp.getUi();
  const res = ui.prompt('날짜 지정 ERP파일 생성', 'YYYYMMDD 형식으로 입력하세요 (예: 20260801)', ui.ButtonSet.OK_CANCEL);
  if (res.getSelectedButton() !== ui.Button.OK) return;
  const s = res.getResponseText().trim();
  if (!/^\d{8}$/.test(s)) { ui.alert('형식이 올바르지 않습니다. 예: 20260801'); return; }
  const d = new Date(Number(s.slice(0, 4)), Number(s.slice(4, 6)) - 1, Number(s.slice(6, 8)));
  erpRun_(d);
}

// ─────────── 메인 ───────────
function erpRun_(dateObj) {
  const ui = SpreadsheetApp.getUi();
  const ymd = Utilities.formatDate(dateObj, 'Asia/Seoul', 'yyyyMMdd');
  const yyyymm = ymd.slice(0, 6);

  // 1) 식단표에서 해당 날짜 주문 수집 (기존 readMealPlan_ 로직과 동일한 파싱)
  let plan;
  try {
    plan = erpReadMealPlan_(dateObj);
  } catch (e) {
    ui.alert('식단표를 열 수 없습니다.\n' + e.message + '\n(ERP_CONFIG의 MEAL_PLAN_FILE_ID 확인)');
    return;
  }
  const totalItems = plan.reduce(function (s, p) { return s + p.items.length; }, 0);
  if (totalItems === 0) {
    ui.alert(ymd + ' — 식단표에서 해당 날짜의 주문을 찾지 못했습니다.');
    return;
  }

  // 2) 거래처코드 / 품목코드 매핑, 매핑 실패 항목 수집
  const mapped = [];      // ERP 행 배열
  const unmapped = [];    // 경고용 {company, menu, qty}
  let seq = 0;
  plan.forEach(function (p) {
    const custCode = CUSTOMER_CODE_MAP[p.company];
    if (!custCode) {
      p.items.forEach(function (it) { unmapped.push({ company: p.company, menu: it[0], qty: it[1], reason: '거래처코드 없음' }); });
      return;
    }
    p.items.forEach(function (it) {
      const menu = it[0];
      const qty = it[1];
      const itemCode = ITEM_CODE_MAP_LOWER[menu.toLowerCase()];
      if (!itemCode) {
        unmapped.push({ company: p.company, menu: menu, qty: qty, reason: '품목코드 없음' });
        return;
      }
      seq++;
      mapped.push([
        ymd, seq, custCode, p.company, '', ERP_CONFIG.FIXED_WAREHOUSE, ERP_CONFIG.FIXED_TRADE_TYPE,
        ERP_CONFIG.FIXED_CURRENCY, '', '', '', '', '', '', itemCode, menu, '', qty, '', '', '', '', '', ''
      ]);
    });
  });

  if (mapped.length === 0) {
    ui.alert(ymd + ' — 매핑 가능한 품목이 없습니다.\n(' + unmapped.length + '개 항목 전부 매핑 실패)');
    return;
  }

  // 3) 미리보기 + 매핑 실패 경고
  let msg = ymd + ' 기준 ERP 업로드 행 ' + mapped.length + '개를 생성합니다.\n';
  if (unmapped.length > 0) {
    const sample = unmapped.slice(0, 15).map(function (u) {
      return '· [' + u.reason + '] ' + u.company + ' / ' + u.menu + ' (' + u.qty + ')';
    }).join('\n');
    msg += '\n⚠️ 매핑 실패로 제외된 항목 ' + unmapped.length + '개:\n' + sample +
      (unmapped.length > 15 ? '\n... 외 ' + (unmapped.length - 15) + '개' : '') +
      '\n\n이 항목들은 ERP파일에 포함되지 않습니다. 계속할까요?';
  } else {
    msg += '\n매핑 실패 항목 없음. 계속할까요?';
  }
  const ok = ui.alert('ERP파일 생성 확인', msg, ui.ButtonSet.OK_CANCEL);
  if (ok !== ui.Button.OK) return;

  // 4) 월별 ERP업로드 파일 찾기/생성, 날짜별 시트에 기입
  const file = erpGetOrCreateMonthlyFile_(yyyymm);
  erpWriteDaySheet_(file, ymd, mapped);

  ui.alert('완료 ✅\nERP업로드_' + yyyymm + ' / ' + ymd + ' 시트\n' +
    mapped.length + '행 기입' + (unmapped.length > 0 ? ' (매핑 실패 ' + unmapped.length + '개 제외)' : '') +
    '\n\n파일: ' + file.getUrl());
}

// ─────────── 식단표 파싱 (식단표동기화.gs의 readMealPlan_과 동일 로직) ───────────
function erpReadMealPlan_(dateObj) {
  const book = SpreadsheetApp.openById(ERP_CONFIG.MEAL_PLAN_FILE_ID);
  const target = Utilities.formatDate(dateObj, 'Asia/Seoul', 'yyyyMMdd');
  const result = [];

  book.getSheets().forEach(function (sheet) {
    const name = sheet.getName();
    if (ERP_CONFIG.EXCLUDE_TABS.indexOf(name) !== -1) return;

    const values = sheet.getDataRange().getValues();
    if (values.length < 2) return;

    const hits = [];
    for (let r = 0; r < values.length; r++) {
      for (let c = 0; c < values[r].length; c++) {
        const v = values[r][c];
        if (v instanceof Date &&
            Utilities.formatDate(v, 'Asia/Seoul', 'yyyyMMdd') === target) {
          hits.push({ r: r, c: c });
        }
      }
    }
    if (hits.length === 0) return;

    const weekRows = [];
    for (let r = 0; r < values.length; r++) {
      const a = String(values[r][0] || '');
      if (/^\d+주$/.test(a.trim())) weekRows.push(r);
    }

    const items = [];
    hits.forEach(function (h) {
      let blockEnd = values.length;
      for (let i = 0; i < weekRows.length; i++) {
        if (weekRows[i] > h.r) { blockEnd = weekRows[i]; break; }
      }
      for (let r = h.r + 1; r < blockEnd; r++) {
        const menu = values[r][h.c];
        const qty = values[r][h.c + 1];
        if (menu === '' || menu === null || menu === undefined) continue;
        const menuStr = String(menu).trim();
        if (menuStr === '') continue;
        if (ERP_CONFIG.SKIP_WORDS.some(function (w) { return menuStr.indexOf(w) !== -1; })) continue;
        if (qty === '' || qty === null || isNaN(Number(qty)) || Number(qty) <= 0) continue;
        items.push([menuStr, Number(qty)]);
      }
    });

    if (items.length > 0) result.push({ company: name, items: items });
  });

  return result;
}

// ─────────── 월별 ERP업로드 파일 찾기/생성 ───────────
function erpGetOrCreateMonthlyFile_(yyyymm) {
  const rootFolder = DriveApp.getFoldersByName(ERP_CONFIG.DRIVE_ROOT_FOLDER).next();
  const subFolder = rootFolder.getFoldersByName(ERP_CONFIG.DRIVE_SUB_FOLDER).next();

  const fileName = 'ERP업로드_' + yyyymm;
  const existing = subFolder.getFilesByName(fileName);
  if (existing.hasNext()) {
    return SpreadsheetApp.open(existing.next());
  }

  const newFile = SpreadsheetApp.create(fileName);
  DriveApp.getFileById(newFile.getId()).moveTo(subFolder);
  const defaultSheet = newFile.getSheets()[0];
  defaultSheet.setName('템플릿');
  defaultSheet.getRange(1, 1, 1, ERP_CONFIG.ERP_HEADERS.length).setValues([ERP_CONFIG.ERP_HEADERS]);
  defaultSheet.setFrozenRows(1);
  return newFile;
}

// ─────────── 날짜별 시트에 기입 (있으면 기존 데이터 지우고 새로 채움) ───────────
function erpWriteDaySheet_(file, ymd, rows) {
  let sheet = file.getSheetByName(ymd);
  if (!sheet) {
    const template = file.getSheetByName('템플릿');
    sheet = template.copyTo(file);
    sheet.setName(ymd);
    // copyTo로 만든 시트는 파일 내 순서 맨 뒤에 붙음. 이름 뒤 (복사본) 등 접미사 제거는 setName으로 이미 해결됨.
  } else {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) sheet.getRange(2, 1, lastRow - 1, ERP_CONFIG.ERP_HEADERS.length).clearContent();
  }
  sheet.getRange(2, 1, rows.length, ERP_CONFIG.ERP_HEADERS.length).setValues(rows);
}
