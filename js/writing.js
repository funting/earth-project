/* 愛地球計畫 - 引導式寫作邏輯 */

const WRITING_STEPS = [
  {
    key: "intro",
    title: "第一段：為什麼要愛地球？",
    guide: "想一想，我們為什麼要做「愛地球計畫」？地球對我們來說是什麼？",
    starters: [
      "地球是我們唯一的家，所以我們要好好保護它。",
      "我覺得愛護地球很重要，因為地球生病了大家都會受影響。",
      "如果沒有地球，我們就沒有地方可以住。"
    ],
    words: ["地球", "唯一", "我們的家", "重要", "保護", "愛護"]
  },
  {
    key: "problem",
    title: "第二段：地球現在遇到了什麼問題？",
    guide: "想一想，地球現在生病了嗎？發生了什麼事情？（例如：垃圾、汙染、動物受傷…）",
    starters: [
      "現在地球有很多垃圾，因為大家用完東西就隨手丟掉。",
      "空氣被汙染了，因為工廠和汽車排放了很多髒空氣。",
      "很多動物因為垃圾和汙染而生病，甚至失去了家。"
    ],
    words: ["垃圾", "汙染", "浪費", "動物", "生病", "砍樹", "海洋"]
  },
  {
    key: "action",
    title: "第三段：我可以做哪些愛地球的行動？",
    guide: "想一想，你自己每天可以做哪些愛地球的小行動？",
    starters: [
      "我可以隨手關燈、關電風扇，節省電力。",
      "我可以自備環保袋、環保餐具，減少垃圾。",
      "我可以做好資源回收分類，讓垃圾變成新的東西。"
    ],
    words: ["回收", "節電", "節水", "環保袋", "種樹", "垃圾分類", "隨手關燈"]
  },
  {
    key: "conclusion",
    title: "第四段：寫一句話呼籲大家一起愛地球",
    guide: "想一想，怎麼鼓勵大家跟你一起愛護地球？",
    starters: [
      "只要大家一起努力，地球就會變得更美麗、更健康。",
      "讓我們一起愛護地球，把乾淨的世界留給以後的人。",
      "愛地球不難，只要從小小的行動開始就可以了！"
    ],
    words: ["一起", "努力", "美麗", "健康", "未來", "從現在開始"]
  }
];

const WRITING_DRAFT_KEY = "earthWritingDraft";
let currentStepIndex = 0;
let stepTexts = WRITING_STEPS.map(() => "");
let essayTitle = "我的愛地球小短文";

function loadDraft() {
  try {
    const raw = localStorage.getItem(WRITING_DRAFT_KEY);
    if (!raw) return;
    const draft = JSON.parse(raw);
    if (Array.isArray(draft.stepTexts) && draft.stepTexts.length === WRITING_STEPS.length) {
      stepTexts = draft.stepTexts;
    }
    if (draft.title) essayTitle = draft.title;
  } catch (e) {
    // 忽略壞掉的暫存資料
  }
}

function saveDraft() {
  localStorage.setItem(
    WRITING_DRAFT_KEY,
    JSON.stringify({ stepTexts, title: essayTitle })
  );
}

function loadStudentInfoIntoForm() {
  try {
    const raw = localStorage.getItem("earthStudentInfo");
    if (!raw) return;
    const info = JSON.parse(raw);
    document.getElementById("w-class").value = info.className || "";
    document.getElementById("w-name").value = info.name || "";
    document.getElementById("w-seat").value = info.seatNo || "";
  } catch (e) {}
}

function initWriting() {
  loadDraft();
  loadStudentInfoIntoForm();
  document.getElementById("essay-title").value = essayTitle;
  document.getElementById("essay-title").addEventListener("input", (e) => {
    essayTitle = e.target.value;
    saveDraft();
  });
  renderStep(0);
}

function renderStepDots() {
  const wrap = document.getElementById("step-dots");
  wrap.innerHTML = WRITING_STEPS.map((s, i) => {
    let cls = "step-dot";
    if (i === currentStepIndex) cls += " active";
    else if (stepTexts[i].trim()) cls += " done";
    return `<div class="${cls}" title="${s.title}"></div>`;
  }).join("");
}

function renderStep(idx) {
  currentStepIndex = idx;
  const step = WRITING_STEPS[idx];

  document.getElementById("step-editor").style.display = "block";
  document.getElementById("step-preview").style.display = "none";

  document.getElementById("step-heading").textContent = `${idx + 1} / ${WRITING_STEPS.length}　${step.title}`;
  document.getElementById("step-guide").textContent = step.guide;

  document.getElementById("starter-chips").innerHTML = step.starters
    .map((s, i) => `<button type="button" class="chip starter" onclick="useStarter(${i})">💡 ${s}</button>`)
    .join("");

  document.getElementById("word-chips").innerHTML = step.words
    .map((w) => `<button type="button" class="chip" onclick="insertWord('${w.replace(/'/g, "\\'")}')">＋ ${w}</button>`)
    .join("");

  const textarea = document.getElementById("step-textarea");
  textarea.value = stepTexts[idx] || "";
  textarea.placeholder = "在這裡寫下你的句子，也可以點選上面的詞語小卡幫忙喔！";

  document.getElementById("prev-step-btn").disabled = idx === 0;
  document.getElementById("next-step-btn").textContent =
    idx === WRITING_STEPS.length - 1 ? "完成，看看我的短文 →" : "下一段 →";

  renderStepDots();
  document.getElementById("writing-card").scrollIntoView({ behavior: "smooth" });
}

function useStarter(starterIdx) {
  const step = WRITING_STEPS[currentStepIndex];
  const textarea = document.getElementById("step-textarea");
  const starter = step.starters[starterIdx];

  if (!textarea.value.trim()) {
    textarea.value = starter;
  } else {
    textarea.value = textarea.value.replace(/\s+$/, "") + " " + starter;
  }
  textarea.focus();
}

function insertWord(word) {
  const textarea = document.getElementById("step-textarea");
  const start = textarea.selectionStart ?? textarea.value.length;
  const end = textarea.selectionEnd ?? textarea.value.length;
  textarea.value = textarea.value.slice(0, start) + word + textarea.value.slice(end);
  const cursor = start + word.length;
  textarea.focus();
  textarea.setSelectionRange(cursor, cursor);
}

function goPrevStep() {
  stepTexts[currentStepIndex] = document.getElementById("step-textarea").value;
  saveDraft();
  if (currentStepIndex > 0) renderStep(currentStepIndex - 1);
}

function goNextStep() {
  stepTexts[currentStepIndex] = document.getElementById("step-textarea").value;
  saveDraft();

  if (currentStepIndex < WRITING_STEPS.length - 1) {
    renderStep(currentStepIndex + 1);
  } else {
    showPreview();
  }
}

function editStep(idx) {
  renderStep(idx);
}

function showPreview() {
  document.getElementById("step-editor").style.display = "none";
  document.getElementById("step-preview").style.display = "block";

  const info = {
    className: document.getElementById("w-class").value.trim(),
    name: document.getElementById("w-name").value.trim(),
    seatNo: document.getElementById("w-seat").value.trim()
  };
  document.getElementById("preview-meta").textContent = `班級：${info.className || "＿＿＿"}　座號：${info.seatNo || "＿＿"}　姓名：${info.name || "＿＿＿"}`;
  document.getElementById("preview-title").textContent = essayTitle || "我的愛地球小短文";

  const paragraphs = stepTexts.map((t) => t.trim()).filter((t) => t.length > 0);
  document.getElementById("draft-content").textContent = paragraphs.length
    ? paragraphs.join("\n\n")
    : "（目前還沒有寫任何內容，回上一步繼續完成吧！）";

  document.getElementById("step-preview").scrollIntoView({ behavior: "smooth" });
}

function backToEditing() {
  document.getElementById("step-editor").style.display = "block";
  document.getElementById("step-preview").style.display = "none";
  renderStep(WRITING_STEPS.length - 1);
}

window.addEventListener("DOMContentLoaded", initWriting);
