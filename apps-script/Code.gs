/*
  愛地球計畫 - Google Apps Script 後端
  =====================================
  這個檔案要貼到 Google 試算表的「擴充功能 > Apps Script」編輯器裡，
  部署成「網頁應用程式」，才能讓全班的測驗紀錄自動存進同一份 Google 試算表，
  老師也才能在「老師專區」看到全班紀錄、匯出 Excel。

  設定步驟：
  1. 開一份新的 Google 試算表，命名為「愛地球計畫紀錄」。
  2. 選單「擴充功能」>「Apps Script」，把這個檔案的內容整個貼進去（取代原本內容）。
  3. 把下面 TEACHER_SECRET 改成跟 js/config.js 裡的 TEACHER_PASSWORD 一模一樣的密碼。
  4. 點選「部署」>「新增部署作業」，類型選「網頁應用程式」：
     - 執行身分：我（你的帳號）
     - 具有存取權的使用者：任何人
  5. 部署後會得到一組網址（.../exec），把它貼到 js/config.js 的 APPS_SCRIPT_URL。
  6. 第一次執行時 Google 會要求授權，請依畫面指示允許即可。
*/

const SHEET_NAME = "Records";
// 請直接在 Google Apps Script 線上編輯器裡把這裡改成你自己的私密密碼，
// 不要把真正使用的密碼存進這個本機檔案／版本控制（這份檔案僅作為程式碼備份參考）。
const TEACHER_SECRET = "CHANGE_ME_IN_APPS_SCRIPT_EDITOR_ONLY";

const COLUMNS = [
  "timestamp",
  "className",
  "name",
  "seatNo",
  "testType",
  "testTypeLabel",
  "score",
  "correct",
  "total"
];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(COLUMNS);
  }
  // 把時間欄位固定成純文字格式，避免 Google 試算表自動把它轉成日期物件
  sheet.getRange("A:A").setNumberFormat("@");
  return sheet;
}

// 把前端傳來的毫秒數時間戳記，轉成台灣時間的易讀字串再存進試算表
function formatTimestamp_(value) {
  const num = Number(value);
  const date = !isNaN(num) && num > 0 ? new Date(num) : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return Utilities.formatDate(date, "Asia/Taipei", "yyyy/MM/dd HH:mm:ss");
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.action !== "submit") {
      return jsonOutput_({ ok: false, message: "未知的操作" });
    }

    const sheet = getSheet_();
    const row = COLUMNS.map((key) => {
      if (key === "timestamp") return formatTimestamp_(data.timestamp);
      return data[key] !== undefined ? data[key] : "";
    });
    sheet.appendRow(row);

    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, message: String(err) });
  }
}

function sheetToRecords_() {
  const sheet = getSheet_();
  const values = sheet.getDataRange().getValues();
  const header = values.shift() || COLUMNS;
  return values.map((row) => {
    const record = {};
    header.forEach((key, i) => {
      record[key] = row[i];
    });
    return record;
  });
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === "list") {
    const className = e.parameter.className || "";
    const name = e.parameter.name || "";
    const seatNo = e.parameter.seatNo || "";

    const records = sheetToRecords_().filter((r) => {
      return (
        (!className || String(r.className) === className) &&
        (!name || String(r.name) === name) &&
        (!seatNo || String(r.seatNo) === String(seatNo))
      );
    });
    return jsonOutput_({ ok: true, records: records });
  }

  if (action === "all") {
    const secret = e.parameter.secret || "";
    if (secret !== TEACHER_SECRET) {
      return jsonOutput_({ ok: false, message: "密碼錯誤" });
    }
    return jsonOutput_({ ok: true, records: sheetToRecords_() });
  }

  return jsonOutput_({ ok: false, message: "未知的操作" });
}
