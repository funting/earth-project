/* 愛地球計畫 - 測驗邏輯 */

const TEST_LABELS = {
  reading: "閱讀測驗",
  listening: "聽力測驗",
  short: "簡答測驗"
};

let currentTestType = null;
let currentQuestions = [];

function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandomQuestions(type, count) {
  const pool = QUESTION_BANK[type];
  const picked = shuffleArray(pool).slice(0, count);

  // 選擇題另外把選項順序打亂，避免答案位置被背下來
  return picked.map((q) => {
    if (!q.options) return Object.assign({}, q);
    const correctText = q.options[q.answerIndex];
    const shuffledOptions = shuffleArray(q.options);
    return Object.assign({}, q, {
      options: shuffledOptions,
      answerIndex: shuffledOptions.indexOf(correctText)
    });
  });
}

function normalizeText(str) {
  return String(str || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/[，。！？、,.!?]/g, "");
}

function getStudentInfo() {
  return {
    className: document.getElementById("input-class").value.trim(),
    name: document.getElementById("input-name").value.trim(),
    seatNo: document.getElementById("input-seat").value.trim()
  };
}

function saveStudentInfoLocal(info) {
  localStorage.setItem("earthStudentInfo", JSON.stringify(info));
}

function loadStudentInfoLocal() {
  try {
    const raw = localStorage.getItem("earthStudentInfo");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

(function restoreStudentInfo() {
  window.addEventListener("DOMContentLoaded", () => {
    const info = loadStudentInfoLocal();
    if (info) {
      document.getElementById("input-class").value = info.className || "";
      document.getElementById("input-name").value = info.name || "";
      document.getElementById("input-seat").value = info.seatNo || "";
    }
  });
})();

function startTest(type) {
  const info = getStudentInfo();
  const hint = document.getElementById("student-form-hint");

  if (!info.className || !info.name || !info.seatNo) {
    hint.textContent = "⚠️ 請先填寫班級、姓名、座號，才能開始測驗喔！";
    hint.style.color = "var(--red)";
    document.getElementById("student-form-card").scrollIntoView({ behavior: "smooth" });
    return;
  }
  hint.textContent = "";
  saveStudentInfoLocal(info);

  currentTestType = type;
  currentQuestions = pickRandomQuestions(type, 5);

  document.getElementById("section-menu").style.display = "none";
  document.getElementById("section-result").style.display = "none";
  document.getElementById("section-test").style.display = "block";
  document.getElementById("test-title").textContent = TEST_LABELS[type];

  renderQuestions(type, currentQuestions);
  updateProgress();
  document.getElementById("section-test").scrollIntoView({ behavior: "smooth" });
}

function renderQuestions(type, questions) {
  const container = document.getElementById("test-questions");
  container.innerHTML = "";

  questions.forEach((q, idx) => {
    const block = document.createElement("div");
    block.className = "question-block";

    let inner = `<p><span class="tag">第 ${idx + 1} 題</span></p>`;

    if (type === "reading") {
      inner += `<div class="passage-box">${q.passage}</div>`;
      inner += `<p><strong>${q.question}</strong></p>`;
      inner += renderOptions(q, idx);
    } else if (type === "listening") {
      inner += `<button type="button" class="speak-btn" onclick="speakPassage('${q.id}')">🔊 播放語音</button>`;
      inner += `<details><summary>看文字稿（協助用）</summary><div class="passage-box" id="passage-${q.id}">${q.passage}</div></details>`;
      inner += `<p><strong>${q.question}</strong></p>`;
      inner += renderOptions(q, idx);
    } else if (type === "short") {
      inner += `<p><strong>${q.prompt}</strong></p>`;
      inner += `<input type="text" id="answer-${idx}" placeholder="請輸入答案" autocomplete="off" />`;
    }

    block.innerHTML = inner;
    container.appendChild(block);

    if (type === "listening") {
      block.dataset.passage = q.passage;
    }
  });
}

function renderOptions(q, idx) {
  let html = '<div class="option-list">';
  q.options.forEach((opt, optIdx) => {
    html += `
      <label class="option-item" id="opt-${idx}-${optIdx}">
        <input type="radio" name="answer-${idx}" value="${optIdx}" />
        <span>${opt}</span>
      </label>`;
  });
  html += "</div>";
  return html;
}

function speakPassage(questionId) {
  const q = currentQuestions.find((item) => item.id === questionId);
  if (!q) return;

  if (!("speechSynthesis" in window)) {
    alert("這個瀏覽器不支援語音播放，請改用「看文字稿」閱讀內容。");
    return;
  }

  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(q.passage);
  utter.lang = "zh-TW";
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}

function updateProgress() {
  // 簡單依目前所在測驗顯示，交卷後才會更新為 100%
  document.getElementById("progress-fill").style.width = "50%";
}

function submitTest() {
  const type = currentTestType;
  let correct = 0;
  const detailRows = [];

  currentQuestions.forEach((q, idx) => {
    if (type === "short") {
      const val = document.getElementById(`answer-${idx}`).value;
      const normalized = normalizeText(val);
      const isCorrect =
        normalized.length > 0 &&
        q.acceptable.some((k) => normalized.includes(normalizeText(k)));
      if (isCorrect) correct++;
      detailRows.push({
        text: q.prompt,
        userAnswer: val || "（未作答）",
        correctAnswer: q.acceptable.join(" / "),
        isCorrect
      });
    } else {
      const selected = document.querySelector(`input[name="answer-${idx}"]:checked`);
      const selectedIdx = selected ? Number(selected.value) : -1;
      const isCorrect = selectedIdx === q.answerIndex;
      if (isCorrect) correct++;

      // 標示正確 / 錯誤選項
      q.options.forEach((opt, optIdx) => {
        const el = document.getElementById(`opt-${idx}-${optIdx}`);
        if (optIdx === q.answerIndex) el.classList.add("correct");
        else if (optIdx === selectedIdx) el.classList.add("incorrect");
      });

      detailRows.push({
        text: q.question,
        userAnswer: selected ? q.options[selectedIdx] : "（未作答）",
        correctAnswer: q.options[q.answerIndex],
        isCorrect
      });
    }
  });

  const score = correct * 20;
  document.getElementById("progress-fill").style.width = "100%";

  showResult(score, correct, detailRows);
  saveAttempt(type, score, correct, currentQuestions.length);
}

function showResult(score, correct, detailRows) {
  document.getElementById("section-test").style.display = "none";
  document.getElementById("section-result").style.display = "block";
  document.getElementById("result-title").textContent = `${TEST_LABELS[currentTestType]} 結果`;
  document.getElementById("result-score").textContent = `${score} 分`;
  document.getElementById("result-note").textContent = `答對 ${correct} / ${currentQuestions.length} 題`;

  const detailEl = document.getElementById("result-detail");
  detailEl.innerHTML = detailRows
    .map(
      (row, i) => `
      <div class="question-block">
        <p><span class="tag">第 ${i + 1} 題</span> ${row.isCorrect ? "✅" : "❌"}</p>
        <p>${row.text}</p>
        <p>你的答案：${row.userAnswer}</p>
        ${row.isCorrect ? "" : `<p>正確答案：${row.correctAnswer}</p>`}
      </div>`
    )
    .join("");

  document.getElementById("section-result").scrollIntoView({ behavior: "smooth" });
}

async function saveAttempt(type, score, correct, total) {
  const info = getStudentInfo();
  const record = {
    timestamp: Date.now(),
    className: info.className,
    name: info.name,
    seatNo: info.seatNo,
    testType: type,
    testTypeLabel: TEST_LABELS[type],
    score,
    correct,
    total
  };
  await saveRecord(record);
}

function retakeTest() {
  startTest(currentTestType);
}

function backToMenu() {
  document.getElementById("section-test").style.display = "none";
  document.getElementById("section-result").style.display = "none";
  document.getElementById("section-menu").style.display = "block";
  window.speechSynthesis && window.speechSynthesis.cancel();
  document.getElementById("section-menu").scrollIntoView({ behavior: "smooth" });
}
