// 774chat ver6.2 - .live_chat.json対応 + 切り抜きTXT用に開始/終了時間出力付き

let chatData = [];
let baseTimestampSec = null;
let chatChart = null;
window.highlightLinksData = [];

document.getElementById("fileInput").addEventListener("change", async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
  document.getElementById("videoTitleInput").value = nameWithoutExt;

  const text = await file.text();

  if (text.includes("replayChatItemAction")) {
    const lines = text.split(/\r?\n/);
    const converted = [];
    for (const line of lines) {
      try {
        const obj = JSON.parse(line);
        const actions = obj.replayChatItemAction?.actions || [];
        for (const act of actions) {
          const chat = act.addChatItemAction?.item?.liveChatTextMessageRenderer;
          if (chat) {
            const msg = chat.message?.runs?.map(r => r.text).join("") || "";
            const ts = parseInt(chat.timestampUsec || "0") / 1000000;
            if (msg && ts) {
              converted.push({ sec: ts, text: msg });
            }
          }
        }
      } catch {}
    }
    if (converted.length) {
      chatData = converted;
      baseTimestampSec = chatData[0].sec;
      document.getElementById("statusMsg").innerText = `✅ 変換済みチャット ${chatData.length}件 読み込み完了！`;
    } else {
      chatData = [];
      document.getElementById("statusMsg").innerText = "⚠️ 変換失敗または空データ";
    }
  } else {
    try {
      const raw = JSON.parse(text);
      const data = raw
        .map((item) => {
          const sec = item.timestamp ?? item.time ?? item.sec;
          const text = item.message ?? item.text;
          return { sec: parseFloat(sec), text };
        })
        .filter((d) => d.sec && d.text);
      chatData = data;
      baseTimestampSec = chatData[0].sec;
      document.getElementById("statusMsg").innerText = `✅ チャット ${chatData.length}件 読み込み完了！`;
    } catch {
      chatData = [];
      document.getElementById("statusMsg").innerText = "⚠️ 読み込み失敗（形式不正か空データ）";
    }
  }
});

function analyze() {
  if (!chatData.length) return alert(".jsonファイルを読み込んでください");

  const videoUrl = document.getElementById("videoUrlInput").value.trim();
  const videoDurationInput = document.getElementById("videoDurationInput").value.trim();
  const keywords = document.getElementById("keywordsInput").value.trim().split(" ").filter(k => k);
  const offsetInput = parseInt(document.getElementById("offsetInput").value || "-20");
  const videoDuration = parseTime(videoDurationInput) || 99999;
  const binStats = {}, wordFreq = {}, wordFirstTime = {}, scores = {};

  const emotionWords = {
    "喜": ["草", "笑", "ｗ", "爆笑"],
    "驚": ["！？", "!?", "えっ", "まじ", "ガチ"],
    "泣": ["泣", "うる", "涙", "泣いた"],
    "尊": ["尊い", "かわいい", "やばい", "最高"]
  };

  const offsetSec = baseTimestampSec;
  let emotionTimes = [], repetitionTimes = [], peakTimes = [], keywordTimes = [];

  for (const entry of chatData) {
    const relSec = Math.floor(entry.sec - offsetSec);
    const bin = Math.floor(relSec / 30) * 30;
    binStats[bin] = (binStats[bin] || 0) + 1;

    const roundedSec = Math.floor(Math.max(relSec + offsetInput, 0) / 30) * 30;

    for (const [emo, list] of Object.entries(emotionWords)) {
      if (list.some(w => entry.text.includes(w))) {
        emotionTimes.push(roundedSec);
        scores[roundedSec] = (scores[roundedSec] || 0) + 1;
      }
    }

    for (const k of keywords) {
      if (entry.text.includes(k)) {
        keywordTimes.push(roundedSec);
        scores[roundedSec] = (scores[roundedSec] || 0) + 1;
      }
    }

    const words = entry.text.split(/[^\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Han}a-zA-Z0-9]+/u);
    for (const w of words.filter(w => w.length > 1)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
      if (!(w in wordFirstTime)) wordFirstTime[w] = relSec;
    }

    if (/(\p{L}|\p{N}|\p{P})\1{2,}/u.test(entry.text)) {
      repetitionTimes.push(roundedSec);
      scores[roundedSec] = (scores[roundedSec] || 0) + 2;
    }
  }

  const topBins = Object.entries(binStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([sec]) => parseInt(sec));

  for (const sec of topBins) {
    const rounded = Math.floor(Math.max(sec + offsetInput, 0) / 30) * 30;
    peakTimes.push(rounded);
    scores[rounded] = (scores[rounded] || 0) + 3;
  }

  Object.values(wordFirstTime)
    .slice(0, 20)
    .forEach((sec) => {
      const rounded = Math.floor(Math.max(sec + offsetInput, 0) / 30) * 30;
      scores[rounded] = (scores[rounded] || 0) + 1;
    });

  const finalCandidates = new Set([
    ...emotionTimes,
    ...keywordTimes,
    ...repetitionTimes,
    ...peakTimes,
    ...Object.values(wordFirstTime)
      .slice(0, 20)
      .map((s) => Math.floor(Math.max(s + offsetInput, 0) / 30) * 30),
  ]);

  window.highlightLinksData = [...finalCandidates]
    .filter((sec) => sec <= videoDuration)
    .map((sec) => {
      const isPeak = peakTimes.includes(sec);
      const isEmo = emotionTimes.includes(sec);
      const isKey = keywordTimes.includes(sec);
      const isRep = repetitionTimes.includes(sec);
      const isPop = Object.values(wordFirstTime)
        .slice(0, 20)
        .some((s) => Math.floor(Math.max(s + offsetInput, 0) / 30) * 30 === sec);

      const icons = [isPeak ? "📈" : "", isEmo ? "🧠" : "", isKey ? "🔍" : "", isRep ? "📣" : "", isPop ? "📚" : ""].join("");
      const score = scores[sec] || 0;
      const fire = score >= 6 ? "🔥" : "";
      const label = `${Math.floor(sec / 60)}分${sec % 60}秒`;
      const url = videoUrl.includes("&t=") ? videoUrl.split("&t=")[0] : videoUrl;

      return {
        sec,
        label,
        score,
        icons: fire + icons,
        url: `${url}&t=${sec}s`,
        memo: "",
        start: Math.max(sec - 300, 0),　//切り抜き前後5分設定
        end: sec + 300
      };
    });

  renderHighlightLinks();
  drawGraph(binStats);
  showTopWords(wordFreq);
  showPeakLinks(peakTimes, videoUrl);
  embedVideo(videoUrl);
}

// 切り抜き候補のチェックボックスとメモ欄を表示
function renderHighlightLinks() {
  const col1 = document.getElementById("highlightCol1");
  const col2 = document.getElementById("highlightCol2");
  const half = Math.ceil(window.highlightLinksData.length / 2);

  const createLinkCard = (item) => `
    <div class="link-card">
      <input type="checkbox" id="candidate-${item.sec}" data-sec="${item.sec}" />
      <label for="candidate-${item.sec}">${item.icons} <a href="${item.url}" target="_blank">${item.label}</a></label>
      <input type="text" class="memo-input" placeholder="メモを入力" data-sec="${item.sec}" value="${item.memo}" />
    </div>`;

  col1.innerHTML = window.highlightLinksData
    .slice(0, half)
    .map(createLinkCard)
    .join("");
  col2.innerHTML = window.highlightLinksData
    .slice(half)
    .map(createLinkCard)
    .join("");

  // メモ入力のイベント登録
  document.querySelectorAll(".memo-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const sec = Number(e.target.dataset.sec);
      const target = window.highlightLinksData.find((item) => item.sec === sec);
      if (target) target.memo = e.target.value;
    });
  });
}

function drawGraph(binStats) {
  const canvas = document.getElementById("chatChart");
  const parent = canvas.parentNode;
  const newCanvas = document.createElement("canvas");
  newCanvas.id = "chatChart";
  newCanvas.style.width = canvas.style.width || "100%";
  newCanvas.style.height = canvas.style.height || "400px";
  parent.replaceChild(newCanvas, canvas);

  const labels = Object.keys(binStats).map(Number).sort((a, b) => a - b);
  const data = labels.map((sec) => binStats[sec]);

  if (chatChart) chatChart.destroy();
  const ctx = newCanvas.getContext("2d");

  chatChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels.map((s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`),
      datasets: [
        { label: "コメント数（30秒毎）", data, borderColor: "blue", fill: false, tension: 0.2 },
      ],
    },
    options: { responsive: true, maintainAspectRatio: true, scales: { y: { beginAtZero: true } } },
  });
}

function showTopWords(freq) {
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 20);
  document.getElementById("topWordsList").innerHTML = sorted
    .map(([w, c], i) => `${i + 1}位：${w}（${c}回）`)
    .join("<br>");
}

function showPeakLinks(topSecs, url) {
  const links = topSecs.map(
    (sec) => `<a href="${url}&t=${sec}s" target="_blank">${Math.floor(sec / 60)}分${sec % 60}秒</a>`
  );
  document.getElementById("peakTop10List").innerHTML = links.join(", ");
}

function embedVideo(url) {
  const box = document.getElementById("videoContainerSmall");
  box.innerHTML = "";

  if (url.includes("youtube.com/watch")) {
    const videoId = new URL(url).searchParams.get("v");
    if (videoId) {
      box.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>`;
    }
  }
}

function parseTime(str) {
  const parts = str.split(":");
  if (parts.length === 3) return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
  if (parts.length === 2) return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  return parseInt(parts[0]);
}

function savePickedCandidates(format) {
  if (!window.highlightLinksData || window.highlightLinksData.length === 0) {
    alert("切り抜き候補がありません。解析を実行してください。");
    return;
  }

  const videoTitle = document.getElementById("videoTitleInput").value.trim() || "無題動画";
  const videoUrl = document.getElementById("videoUrlInput").value.trim();
  const picked = window.highlightLinksData.filter((item) => {
    const checkbox = document.getElementById(`candidate-${item.sec}`);
    return checkbox && checkbox.checked;
  });

  if (picked.length === 0) {
    alert("保存する候補を1つ以上選択してください。");
    return;
  }

 if (format === "csv") {
    const header = ["動画タイトル", "タイムスタンプ(秒)", "ラベル", "スコア", "アイコン", "URL", "メモ"];
    const rows = picked.map((item) => [
      `"${videoTitle.replace(/"/g, '""')}"`,
      item.sec,
      `"${item.label}"`,
      item.score,
      `"${item.icons}"`,
      `"${item.url}"`,
      `"${(item.memo || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent = [header.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    downloadFile(csvContent, `${sanitizeFilename(videoTitle)}_切り抜き候補.csv`, "text/csv");
  } else if (format === "txt") {
  	const startOffset = parseInt(document.getElementById("startOffset")?.value || "300");
  	const endOffset = parseInt(document.getElementById("endOffset")?.value || "300");
 
    const jsonData = picked.map(({ sec, label, score, icons, url, memo }) => {
      const start = Math.max(0, sec - startOffset);
      const end = sec + endOffset;
      return {
        timestamp: sec,
        label,
        score,
        icons,
        url,
        memo,
        start: formatYTDLPTime(start),
        end: formatYTDLPTime(end)
      };
    });

    const content = `// 動画タイトル: ${videoTitle}\n` + JSON.stringify(jsonData, null, 2);
    downloadFile(content, `${sanitizeFilename(videoTitle)}_切り抜き候補.txt`, "text/plain");
  }
}

function formatYTDLPTime(sec) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${h > 0 ? h + ":" : ""}${h > 0 ? String(m).padStart(2, "0") : m}:${String(s).padStart(2, "0")}`;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}

function sanitizeFilename(name) {
  return name.replace(/[\\/:"*?<>|]+/g, "_");
}