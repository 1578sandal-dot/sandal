// ========================================
// 샌달 웹앱(Firestore) -> 조식 수량표 동기화
// ========================================

const WEB_QUANTITY_SPREADSHEET_ID = '1SF2QeTLns5fArqEiNjRaw1sBaRH8UDEXJZr0TX48f-s'; // [TEST사본]6월조식수량
const WEB_HISTORY_SHEET_NAME = '웹앱변경히스토리';
const WEB_EXCLUDE_SHEETS = ['카테고리', '고객관리', WEB_HISTORY_SHEET_NAME];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('샌달 웹앱 연동')
    .addItem('웹앱 수량표 전송', 'syncWebDietPlansToQuantity')
    .addItem('웹앱 수정사항 반영', 'syncWebDietPlansToQuantity')
    .addSeparator()
    .addItem('Firestore 인증 확인', 'checkWebFirestoreConnection')
    .addToUi();
}

function getWebQuantitySpreadsheet_() {
  return SpreadsheetApp.openById(WEB_QUANTITY_SPREADSHEET_ID);
}

function getWebYearMonth_() {
  const ss = getWebQuantitySpreadsheet_();
  const sheet = ss.getSheets().find((s) => /^\d{8}/.test(s.getName()));
  if (!sheet) throw new Error('날짜별 시트를 찾을 수 없습니다. 예: 20260601월요일');
  const yyyymm = sheet.getName().substring(0, 6);
  return `${yyyymm.substring(0, 4)}-${yyyymm.substring(4, 6)}`;
}

function dateStrToDateKey_WEB_(dateStr) {
  return String(dateStr).replace(/-/g, '');
}

function dateKeyToSheetName_WEB_(dateKey) {
  const y = Number(dateKey.substring(0, 4));
  const m = Number(dateKey.substring(4, 6)) - 1;
  const d = Number(dateKey.substring(6, 8));
  const dayNames = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const date = new Date(y, m, d);
  return `${dateKey}${dayNames[date.getDay()]}`;
}

function getFirebaseServiceAccount_WEB_() {
  const raw = PropertiesService.getScriptProperties().getProperty('FIREBASE_SERVICE_ACCOUNT_JSON');
  if (!raw) {
    throw new Error(
      'Script Properties에 FIREBASE_SERVICE_ACCOUNT_JSON이 없습니다.\n' +
      'Apps Script 설정 > 스크립트 속성에 서비스 계정 JSON 전체를 넣어주세요.'
    );
  }
  return JSON.parse(raw);
}

function base64Url_WEB_(input) {
  const bytes = typeof input === 'string' ? Utilities.newBlob(input).getBytes() : input;
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, '');
}

function getFirestoreAccessToken_WEB_() {
  const serviceAccount = getFirebaseServiceAccount_WEB_();
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const claim = {
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/datastore',
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };
  const unsignedJwt = `${base64Url_WEB_(JSON.stringify(header))}.${base64Url_WEB_(JSON.stringify(claim))}`;
  const signature = Utilities.computeRsaSha256Signature(unsignedJwt, serviceAccount.private_key);
  const jwt = `${unsignedJwt}.${base64Url_WEB_(signature)}`;

  const response = UrlFetchApp.fetch(serviceAccount.token_uri || 'https://oauth2.googleapis.com/token', {
    method: 'post',
    payload: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    },
    muteHttpExceptions: true,
  });

  const body = JSON.parse(response.getContentText());
  if (!body.access_token) {
    throw new Error(`Firestore 인증 실패: ${response.getContentText()}`);
  }
  return {
    token: body.access_token,
    projectId: serviceAccount.project_id,
  };
}

function firestoreGet_WEB_(path) {
  const auth = getFirestoreAccessToken_WEB_();
  const url = `https://firestore.googleapis.com/v1/projects/${auth.projectId}/databases/(default)/documents/${path}`;
  const response = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: { Authorization: `Bearer ${auth.token}` },
    muteHttpExceptions: true,
  });

  if (response.getResponseCode() === 404) return null;
  if (response.getResponseCode() >= 300) {
    throw new Error(`Firestore 읽기 실패 (${path}): ${response.getContentText()}`);
  }
  return JSON.parse(response.getContentText());
}

function unwrapFirestoreValue_WEB_(value) {
  if (!value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('booleanValue' in value) return Boolean(value.booleanValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('nullValue' in value) return null;
  if ('arrayValue' in value) {
    return (value.arrayValue.values || []).map(unwrapFirestoreValue_WEB_);
  }
  if ('mapValue' in value) {
    const result = {};
    const fields = value.mapValue.fields || {};
    Object.keys(fields).forEach((key) => {
      result[key] = unwrapFirestoreValue_WEB_(fields[key]);
    });
    return result;
  }
  return null;
}

function unwrapFirestoreDocument_WEB_(doc) {
  const result = {};
  const fields = doc && doc.fields ? doc.fields : {};
  Object.keys(fields).forEach((key) => {
    result[key] = unwrapFirestoreValue_WEB_(fields[key]);
  });
  return result;
}

function loadWebCompanies_WEB_() {
  const data = firestoreGet_WEB_('companies');
  const docs = data && data.documents ? data.documents : [];
  return docs
    .map((doc) => {
      const uid = doc.name.split('/').pop();
      return { uid, ...unwrapFirestoreDocument_WEB_(doc) };
    })
    .filter((company) => company.role !== 'admin')
    .sort((a, b) => String(a.name || '').localeCompare(String(b.name || ''), 'ko'));
}

function loadWebDietPlan_WEB_(uid, yearMonth) {
  const doc = firestoreGet_WEB_(`dietPlans/${uid}/months/${yearMonth}`);
  return doc ? unwrapFirestoreDocument_WEB_(doc) : null;
}

function addProductEntry_WEB_(entries, companyName, product, qty) {
  const cleanProduct = String(product || '').trim();
  const quantity = Number(qty || 0);
  if (!cleanProduct || !quantity) return;

  cleanProduct.split('+').forEach((part) => {
    const trimmed = part.trim();
    if (trimmed) entries.push({ company: companyName, product: trimmed, qty: quantity });
  });
}

function buildQuantityEntriesFromWeb_WEB_(yearMonth) {
  const companies = loadWebCompanies_WEB_();
  const allData = {};

  companies.forEach((company) => {
    const plan = loadWebDietPlan_WEB_(company.uid, yearMonth);
    if (!plan || !plan.submittedAt || !plan.dates) return;

    Object.keys(plan.dates).forEach((dateStr) => {
      if (!dateStr.startsWith(yearMonth)) return;
      const dateData = plan.dates[dateStr] || {};
      const items = dateData.items || [];
      const dateKey = dateStrToDateKey_WEB_(dateStr);

      items.forEach((item) => {
        const qty = Number(item.quantity || 0);
        if (!qty) return;
        if (!allData[dateKey]) allData[dateKey] = [];
        addProductEntry_WEB_(allData[dateKey], company.name, item.menuName, qty);
        addProductEntry_WEB_(allData[dateKey], company.name, item.side, qty);
      });
    });
  });

  return allData;
}

function clearQuantitySheet_WEB_(sheet) {
  const maxRows = 198;
  const range = sheet.getRange(2, 1, maxRows, 4);
  range.clearContent();
  range.setBackground(null);
  range.setFontWeight('normal');
  range.setBorder(false, false, false, false, false, false);
}

function applyCompanyFormatting_WEB_(sheet, entries) {
  if (entries.length === 0) return;

  const bgColors = [];
  const fontWeights = [];
  let currentCompany = null;
  let colorIndex = 0;
  const colors = ['#ffffff', '#dce8f8'];

  entries.forEach((entry, index) => {
    const isNewCompany = entry.company !== currentCompany;
    if (isNewCompany) {
      if (currentCompany !== null) colorIndex = 1 - colorIndex;
      currentCompany = entry.company;
    }

    const bg = colors[colorIndex];
    bgColors.push([bg, bg, bg, bg]);
    fontWeights.push([
      isNewCompany ? 'bold' : 'normal',
      isNewCompany ? 'bold' : 'normal',
      isNewCompany ? 'bold' : 'normal',
      isNewCompany ? 'bold' : 'normal',
    ]);

    if (isNewCompany && index > 0) {
      sheet.getRange(index + 2, 1, 1, 4)
        .setBorder(true, false, false, false, false, false, '#555555', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
    }
  });

  sheet.getRange(2, 1, entries.length, 4)
    .setBackgrounds(bgColors)
    .setFontWeights(fontWeights)
    .setHorizontalAlignment('center');
}

function writeWebEntriesToSheet_WEB_(sheet, entries) {
  const maxRows = 198;
  clearQuantitySheet_WEB_(sheet);
  if (entries.length === 0) return;

  const clipped = entries.slice(0, maxRows);
  let companyNumber = 0;
  let previousCompany = null;
  const rows = clipped.map((entry) => {
    const isFirst = entry.company !== previousCompany;
    if (isFirst) {
      companyNumber += 1;
      previousCompany = entry.company;
    }
    return [isFirst ? companyNumber : '', entry.company, entry.product, entry.qty];
  });

  sheet.getRange(2, 1, rows.length, 4).setValues(rows);
  applyCompanyFormatting_WEB_(sheet, clipped);
}

function getWebHistorySheet_WEB_(ss) {
  let sheet = ss.getSheetByName(WEB_HISTORY_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(WEB_HISTORY_SHEET_NAME);
    sheet.getRange(1, 1, 1, 5).setValues([['타임스탬프', '월', '날짜 수', '입력 행 수', '메모']]);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function syncWebDietPlansToQuantity() {
  try {
    const ss = getWebQuantitySpreadsheet_();
    const yearMonth = getWebYearMonth_();
    const allData = buildQuantityEntriesFromWeb_WEB_(yearMonth);
    const sheetMap = {};

    ss.getSheets()
      .filter((sheet) => !WEB_EXCLUDE_SHEETS.includes(sheet.getName()))
      .forEach((sheet) => {
        sheetMap[sheet.getName()] = sheet;
      });

    let successCount = 0;
    let rowCount = 0;
    const failSheets = [];

    Object.keys(allData).sort().forEach((dateKey) => {
      const sheetName = dateKeyToSheetName_WEB_(dateKey);
      const sheet = sheetMap[sheetName];
      if (!sheet) {
        failSheets.push(sheetName);
        return;
      }

      const entries = allData[dateKey];
      writeWebEntriesToSheet_WEB_(sheet, entries);
      successCount += 1;
      rowCount += entries.length;
    });

    const history = getWebHistorySheet_WEB_(ss);
    history.appendRow([
      Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
      yearMonth,
      successCount,
      rowCount,
      failSheets.length ? `누락 시트: ${failSheets.join(', ')}` : '정상',
    ]);

    let message = `${yearMonth} 웹앱 제출 데이터를 수량표에 반영했습니다.\n\n날짜: ${successCount}개\n행: ${rowCount}개`;
    if (failSheets.length) {
      message += `\n\n찾지 못한 시트:\n${failSheets.slice(0, 10).join('\n')}`;
    }
    SpreadsheetApp.getUi().alert(message);
  } catch (error) {
    SpreadsheetApp.getUi().alert(`오류 발생:\n${error.message}`);
    console.error(error);
  }
}

function checkWebFirestoreConnection() {
  try {
    const yearMonth = getWebYearMonth_();
    const companies = loadWebCompanies_WEB_();
    const submittedCount = companies.filter((company) => {
      const plan = loadWebDietPlan_WEB_(company.uid, yearMonth);
      return plan && plan.submittedAt;
    }).length;
    SpreadsheetApp.getUi().alert(
      `Firestore 연결 성공\n\n월: ${yearMonth}\n고객사: ${companies.length}개\n제출 완료: ${submittedCount}개`
    );
  } catch (error) {
    SpreadsheetApp.getUi().alert(`Firestore 연결 실패:\n${error.message}`);
    console.error(error);
  }
}
