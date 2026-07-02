/*
 愛地球計畫 - 資料存取層
 若 EARTH_CONFIG.APPS_SCRIPT_URL 有設定，優先透過 Google Apps Script 讀寫 Google 試算表；
 同時一律寫入 localStorage 作為本機備援與離線展示用途。
*/

const LOCAL_KEY = "earthProjectRecords";

/**
 * 把時間戳記（毫秒數、ISO 字串或其他格式）轉成台灣時間的易讀字串。
 */
function formatTimestamp(value) {
  if (value === undefined || value === null || value === "") return "";
  const num = Number(value);
  const date = !isNaN(num) && num > 0 ? new Date(num) : new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-TW", { timeZone: "Asia/Taipei", hour12: false });
}

function isBackendConfigured() {
  return typeof EARTH_CONFIG !== "undefined" && !!EARTH_CONFIG.APPS_SCRIPT_URL;
}

function readLocalRecords() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function writeLocalRecords(records) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(records));
}

function saveRecordLocal(record) {
  const records = readLocalRecords();
  records.push(record);
  writeLocalRecords(records);
}

/**
 * 儲存一筆作答紀錄。永遠寫入本機，若有設定後端則同時送出。
 * @returns {Promise<{ok: boolean, synced: boolean}>}
 */
async function saveRecord(record) {
  saveRecordLocal(record);

  if (!isBackendConfigured()) {
    return { ok: true, synced: false };
  }

  try {
    // 用 text/plain 送出，避免觸發瀏覽器的 CORS 預檢請求（Apps Script 不支援 OPTIONS）。
    await fetch(EARTH_CONFIG.APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(Object.assign({ action: "submit" }, record))
    });
    return { ok: true, synced: true };
  } catch (err) {
    console.warn("雲端同步失敗，已保留在本機：", err);
    return { ok: true, synced: false };
  }
}

/**
 * 查詢某位學生自己的作答紀錄。
 */
async function queryStudentRecords({ className, name, seatNo }) {
  if (isBackendConfigured()) {
    try {
      const url = new URL(EARTH_CONFIG.APPS_SCRIPT_URL);
      url.searchParams.set("action", "list");
      url.searchParams.set("className", className || "");
      url.searchParams.set("name", name || "");
      url.searchParams.set("seatNo", seatNo || "");
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data && data.ok) return data.records;
    } catch (err) {
      console.warn("雲端查詢失敗，改用本機資料：", err);
    }
  }

  return readLocalRecords().filter((r) => {
    return (
      (!className || r.className === className) &&
      (!name || r.name === name) &&
      (!seatNo || String(r.seatNo) === String(seatNo))
    );
  });
}

/**
 * 老師查詢全班所有紀錄。
 */
async function queryAllRecords(password) {
  if (isBackendConfigured()) {
    try {
      const url = new URL(EARTH_CONFIG.APPS_SCRIPT_URL);
      url.searchParams.set("action", "all");
      url.searchParams.set("secret", password || "");
      const res = await fetch(url.toString());
      const data = await res.json();
      if (data && data.ok) return { ok: true, records: data.records, source: "cloud" };
      return { ok: false, message: (data && data.message) || "密碼錯誤或查詢失敗" };
    } catch (err) {
      console.warn("雲端查詢失敗，改用本機資料：", err);
    }
  }

  if (password !== EARTH_CONFIG.TEACHER_PASSWORD) {
    return { ok: false, message: "密碼錯誤" };
  }
  return { ok: true, records: readLocalRecords(), source: "local" };
}

/**
 * 將紀錄陣列匯出成 CSV 檔（可用 Excel 開啟）。
 */
function exportRecordsToCSV(records, filename) {
  const headers = ["時間", "班級", "姓名", "座號", "測驗類別", "得分", "答對題數", "總題數"];
  const rows = records.map((r) => [
    formatTimestamp(r.timestamp),
    r.className,
    r.name,
    r.seatNo,
    r.testTypeLabel,
    r.score,
    r.correct,
    r.total
  ]);

  const csvContent =
    "﻿" + // BOM，讓 Excel 正確顯示中文
    [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename || "愛地球計畫_作答紀錄.csv";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
