/*
 愛地球計畫 - 設定檔
 老師只需要修改這個檔案，不用動其他程式碼。
*/

const EARTH_CONFIG = {
  // 部署 Google Apps Script 後，把網址貼在這裡（雙引號中間）。
  // 範例："https://script.google.com/macros/s/AKfycb.../exec"
  // 如果留空字串 ""，系統會改用「本機瀏覽器」暫存資料（只有這台電腦看得到，僅供測試）。
  APPS_SCRIPT_URL: "https://script.google.com/macros/s/AKfycbw84By7QhfV_nrm2dH_fqoUO4xNz0ymxq2xoT6KQ9zeCyBloooPWSbAhXccwhNR1ZSX/exec",

  // 這個欄位只在「尚未設定 APPS_SCRIPT_URL」的離線測試模式下才會用到。
  // 一旦上面設定了 APPS_SCRIPT_URL，真正驗證密碼的地方是 Google Apps Script 後端（Code.gs 的 TEACHER_SECRET），
  // 不是這裡。因為這個檔案會被公開發布在網站原始碼中，請勿把正式使用的密碼填在這裡。
  TEACHER_PASSWORD: "offline-demo-only"
};
