const sampleStocks = {
  NVDA: {
    name: "NVIDIA Corporation",
    sector: "半導體",
    currency: "USD",
    price: 128.74,
    changePct: 2.18,
    dayLow: 124.1,
    dayHigh: 130.22,
    revenueGrowth: 78.3,
    grossMargin: 73.6,
    pe: 44.8,
    forwardPe: 31.5,
    debtRatio: 16,
    institutionalBuy: 68,
    institutionalSell: 32,
    volumePower: 76,
    flow: [
      ["AI 伺服器", 88],
      ["半導體", 82],
      ["雲端軟體", 63],
      ["金融", 44],
      ["消費零售", 31]
    ]
  },
  AAPL: {
    name: "Apple Inc.",
    sector: "消費電子",
    currency: "USD",
    price: 196.58,
    changePct: -0.42,
    dayLow: 194.22,
    dayHigh: 199.7,
    revenueGrowth: 4.1,
    grossMargin: 46.9,
    pe: 29.3,
    forwardPe: 25.1,
    debtRatio: 31,
    institutionalBuy: 48,
    institutionalSell: 52,
    volumePower: 42,
    flow: [
      ["大型科技", 57],
      ["消費電子", 48],
      ["AI 伺服器", 72],
      ["醫療", 39],
      ["公用事業", 33]
    ]
  },
  TSM: {
    name: "Taiwan Semiconductor",
    sector: "晶圓代工",
    currency: "USD",
    price: 176.32,
    changePct: 1.04,
    dayLow: 172.8,
    dayHigh: 178.1,
    revenueGrowth: 32.7,
    grossMargin: 58.4,
    pe: 26.6,
    forwardPe: 20.8,
    debtRatio: 11,
    institutionalBuy: 61,
    institutionalSell: 39,
    volumePower: 64,
    flow: [
      ["半導體", 82],
      ["晶圓代工", 79],
      ["AI 伺服器", 86],
      ["傳產", 29],
      ["金融", 46]
    ]
  },
  "2330.TW": {
    name: "台積電",
    sector: "晶圓代工",
    currency: "TWD",
    price: 984,
    changePct: 1.23,
    dayLow: 968,
    dayHigh: 992,
    revenueGrowth: 34.2,
    grossMargin: 58.4,
    pe: 27.1,
    forwardPe: 21.2,
    debtRatio: 11,
    institutionalBuy: 64,
    institutionalSell: 36,
    volumePower: 69,
    flow: [
      ["半導體", 83],
      ["AI 伺服器", 86],
      ["電子權值", 74],
      ["航運", 36],
      ["金融", 47]
    ]
  },
  "0050.TW": {
    name: "元大台灣50",
    sector: "台股 ETF",
    currency: "TWD",
    price: 184.85,
    changePct: 0.38,
    dayLow: 183.9,
    dayHigh: 185.4,
    revenueGrowth: 13.5,
    grossMargin: 0,
    pe: 22.4,
    forwardPe: 18.6,
    debtRatio: 0,
    institutionalBuy: 56,
    institutionalSell: 44,
    volumePower: 58,
    flow: [
      ["台股 ETF", 68],
      ["電子權值", 74],
      ["金融", 51],
      ["半導體", 79],
      ["高股息", 43]
    ]
  },
  TSLA: {
    name: "Tesla Inc.",
    sector: "電動車",
    currency: "USD",
    price: 247.21,
    changePct: -1.36,
    dayLow: 244.5,
    dayHigh: 253.4,
    revenueGrowth: 9.8,
    grossMargin: 18.2,
    pe: 61.7,
    forwardPe: 48.9,
    debtRatio: 9,
    institutionalBuy: 43,
    institutionalSell: 57,
    volumePower: 71,
    flow: [
      ["電動車", 42],
      ["AI 伺服器", 82],
      ["大型科技", 61],
      ["能源", 37],
      ["消費零售", 34]
    ]
  }
};

const elements = {
  form: document.querySelector("#stockForm"),
  input: document.querySelector("#symbolInput"),
  companyName: document.querySelector("#companyName"),
  tickerText: document.querySelector("#tickerText"),
  sectorText: document.querySelector("#sectorText"),
  updatedText: document.querySelector("#updatedText"),
  verdictBadge: document.querySelector("#verdictBadge"),
  dataStatus: document.querySelector("#dataStatus"),
  priceText: document.querySelector("#priceText"),
  changeText: document.querySelector("#changeText"),
  rangeFill: document.querySelector("#rangeFill"),
  lowText: document.querySelector("#lowText"),
  highText: document.querySelector("#highText"),
  valueScore: document.querySelector("#valueScore"),
  valueHint: document.querySelector("#valueHint"),
  revenueGrowth: document.querySelector("#revenueGrowth"),
  revenueHint: document.querySelector("#revenueHint"),
  smartMoney: document.querySelector("#smartMoney"),
  smartMoneyHint: document.querySelector("#smartMoneyHint"),
  aiComment: document.querySelector("#aiComment"),
  longTerm: document.querySelector("#longTerm"),
  shortTerm: document.querySelector("#shortTerm"),
  cheapness: document.querySelector("#cheapness"),
  riskLabel: document.querySelector("#riskLabel"),
  flowList: document.querySelector("#flowList"),
  profileStatus: document.querySelector("#profileStatus"),
  profileGrid: document.querySelector("#profileGrid"),
  institutionStatus: document.querySelector("#institutionStatus"),
  buyMeter: document.querySelector("#buyMeter"),
  sellMeter: document.querySelector("#sellMeter"),
  volumeMeter: document.querySelector("#volumeMeter"),
  metricTable: document.querySelector("#metricTable")
};

const isLocalRuntime = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const isFilePreview = window.location.protocol === "file:";
const API_BASE = isFilePreview ? "http://127.0.0.1:4173" : isLocalRuntime ? "" : null;

function currencySymbol(currency) {
  return currency === "TWD" ? "NT$" : "$";
}

function formatMoney(stock, value) {
  return `${currencySymbol(stock.currency)}${value.toLocaleString("zh-TW", {
    minimumFractionDigits: value >= 100 ? 0 : 2,
    maximumFractionDigits: value >= 100 ? 0 : 2
  })}`;
}

function formatPlainNumber(value) {
  if (!hasNumber(value)) return "N/A";
  return value.toLocaleString("zh-TW", {
    maximumFractionDigits: value >= 1000 ? 0 : 2
  });
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hasNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function formatQuoteTimestamp(stock) {
  if (stock.quoteDate) {
    const raw = String(stock.quoteDate).trim();
    const match = raw.match(/^(\d{4})(\d{2})(\d{2})\s+(\d{2}:\d{2}:\d{2})$/);
    if (match) {
      return `${match[1]}/${match[2]}/${match[3]} ${match[4]}`;
    }
    return raw;
  }

  if (stock.fetchedAt) {
    const date = new Date(stock.fetchedAt);
    if (!Number.isNaN(date.getTime())) {
      return `${date.toLocaleString("zh-TW", { hour12: false })} 抓取`;
    }
  }

  return "更新中";
}

function getValueScore(stock) {
  if (!hasNumber(stock.revenueGrowth) || !hasNumber(stock.grossMargin) || !hasNumber(stock.forwardPe)) {
    return null;
  }
  const growthScore = clamp(stock.revenueGrowth * 1.25, 0, 45);
  const marginScore = clamp(stock.grossMargin * 0.35, 0, 25);
  const valuationPenalty = clamp((stock.forwardPe - 18) * 1.25, 0, 28);
  const flowScore = clamp((stock.institutionalBuy - stock.institutionalSell) * 0.35, -12, 12);
  return Math.round(clamp(54 + growthScore + marginScore + flowScore - valuationPenalty, 0, 100));
}

function getLabels(stock, score) {
  const netBuy = stock.institutionalBuy - stock.institutionalSell;
  const momentum = stock.changePct + (stock.volumePower - 50) / 12;
  if (score === null) {
    return {
      cheapness: "資料不足",
      longTerm: "缺基本面資料",
      shortTerm: momentum > 2 ? "短線偏強" : momentum < -1 ? "短線偏弱" : "區間整理",
      verdict: "僅供觀察",
      risk: "基本面未驗證"
    };
  }
  const cheapness = score >= 78 ? "偏便宜" : score >= 60 ? "合理偏上" : "偏貴";
  const longTerm = score >= 72 && stock.revenueGrowth > 15 ? "可分批長抱" : score >= 55 ? "觀察持有" : "保守看待";
  const shortTerm = momentum > 2 ? "偏多波段" : momentum < -1 ? "震盪偏弱" : "區間整理";
  const verdict = score >= 78 && netBuy > 12 ? "買盤偏強" : score >= 62 ? "合理觀察" : "估值偏緊";
  const risk = stock.forwardPe > 38 ? "高估值風險" : stock.revenueGrowth < 8 ? "成長放緩" : "風險可控";
  return { cheapness, longTerm, shortTerm, verdict, risk };
}

function buildComment(stock, score, labels) {
  const netBuy = stock.institutionalBuy - stock.institutionalSell;
  const pricePosition = ((stock.price - stock.dayLow) / (stock.dayHigh - stock.dayLow)) * 100;
  const flowLeader = stock.flow.slice().sort((a, b) => b[1] - a[1])[0][0];
  if (score === null) {
    const moneyText = netBuy > 15 ? "目前買盤動能偏強" : netBuy < -8 ? "目前賣壓偏重" : "目前多空拉鋸";
    const dataText = stock.fundamentalsLive ? "基本面欄位仍不完整" : "目前只有報價資料，沒有同步取得可信的營收與估值欄位";
    return `${stock.name} 目前可確認的是價格與區間表現，${moneyText}，資金熱度偏向 ${flowLeader}。但 ${dataText}，所以「便宜或昂貴」和長期持有判斷先不要下太滿，短線僅能當作盤面觀察。`;
  }
  const valuationText = stock.forwardPe > 35 ? "本益比已反映較高期待" : "估值仍在可討論區間";
  const moneyText = netBuy > 15 ? "大戶買盤明顯大於賣壓" : netBuy < -8 ? "大戶偏向調節" : "籌碼呈現中性整理";
  const positionText = pricePosition > 75 ? "目前接近日內高檔，短線追價要留意震盪" : pricePosition < 35 ? "價格靠近日內低位，適合觀察承接力" : "價格位於日內中段，等待突破或回測更清楚";

  return `${stock.name} 目前估值分數為 ${score}，${valuationText}；近四季營收成長約 ${stock.revenueGrowth.toFixed(1)}%，基本面動能${stock.revenueGrowth > 20 ? "仍然強" : "需要更多確認"}。${moneyText}，資金主要流向 ${flowLeader}。${positionText}。整體來看，${labels.longTerm}，短線則偏向「${labels.shortTerm}」。`;
}

async function fetchStockFromApi(symbol, baseStock) {
  if (API_BASE === null) {
    return {
      ...baseStock,
      symbol,
      fetchedAt: new Date().toISOString(),
      live: false,
      source: "公開展示模式",
      warnings: ["Public deploy has no local finance API; using demo data."]
    };
  }

  try {
    const url = `${API_BASE}/api/stock/${encodeURIComponent(symbol)}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error("API unavailable");
    return await response.json();
  } catch (error) {
    return {
      ...baseStock,
      symbol,
      fetchedAt: new Date().toISOString(),
      live: false,
      source: "前端示範資料",
      warnings: [error.message]
    };
  }
}

function renderFlow(flow) {
  elements.flowList.innerHTML = flow
    .map(([name, value]) => {
      const mood = value >= 70 ? "hot" : value < 40 ? "cool" : "warn";
      return `
        <div class="flow-item ${mood}">
          <strong>${name}</strong>
          <div class="flow-bar"><span style="width:${value}%"></span></div>
          <span>${value}%</span>
        </div>
      `;
    })
    .join("");
}

function renderMetrics(stock) {
  const metrics = [
    ["Forward P/E", hasNumber(stock.forwardPe) ? stock.forwardPe.toFixed(1) : "N/A"],
    ["本益比", hasNumber(stock.pe) ? stock.pe.toFixed(1) : "N/A"],
    ["毛利率", hasNumber(stock.grossMargin) ? `${stock.grossMargin.toFixed(1)}%` : "N/A"],
    ["負債比", hasNumber(stock.debtRatio) ? `${stock.debtRatio.toFixed(0)}%` : "N/A"]
  ];

  elements.metricTable.innerHTML = metrics
    .map(([label, value]) => `
      <div class="metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function renderProfile(stock) {
  const items = [
    ["商品類型", stock.assetType || "N/A", stock.exchange || "未標示"],
    ["交易所", stock.exchange || "N/A", stock.source || "未標示"],
    ["幣別", stock.currency || "N/A", stock.quoteDate ? `報價 ${formatQuoteTimestamp(stock)}` : "即時或延遲報價"],
    ["開盤", hasNumber(stock.open) ? formatMoney(stock, stock.open) : "N/A", hasNumber(stock.previousClose) ? `昨收 ${formatMoney(stock, stock.previousClose)}` : "昨收 N/A"],
    ["成交量", formatPlainNumber(stock.volume), hasNumber(stock.averageVolume) ? `均量 ${formatPlainNumber(stock.averageVolume)}` : "均量 N/A"],
    ["基本面來源", stock.fundamentalsSource || "N/A", stock.fundamentalsLive ? "可用" : "目前缺資料"]
  ];

  elements.profileStatus.textContent = stock.assetType || "基本資料";
  elements.profileGrid.innerHTML = items
    .map(([label, value, hint]) => `
      <div class="metric">
        <span>${label}</span>
        <strong>${value}</strong>
        <small>${hint}</small>
      </div>
    `)
    .join("");
}

async function renderStock(symbol) {
  const normalized = symbol.trim().toUpperCase();
  const baseStock = sampleStocks[normalized] || {
    ...sampleStocks.NVDA,
    name: normalized,
    sector: "自訂股票",
    flow: [
      ["AI 伺服器", 72],
      ["半導體", 66],
      ["大型科技", 58],
      ["金融", 43],
      ["防禦型", 34]
    ]
  };

  elements.dataStatus.textContent = "正在呼叫本機財經 API，整理即時報價與基本面資料。";
  const stock = await fetchStockFromApi(normalized, baseStock);
  const score = getValueScore(stock);
  const labels = getLabels(stock, score);
  const rangePct = clamp(((stock.price - stock.dayLow) / (stock.dayHigh - stock.dayLow)) * 100, 4, 100);
  const netBuy = stock.institutionalBuy - stock.institutionalSell;

  elements.companyName.textContent = stock.name;
  elements.tickerText.textContent = normalized;
  elements.sectorText.textContent = stock.sector;
  elements.updatedText.textContent = formatQuoteTimestamp(stock);
  elements.verdictBadge.textContent = labels.verdict;
  elements.verdictBadge.style.background = score === null ? "var(--cyan)" : score >= 78 ? "var(--green)" : score >= 62 ? "var(--yellow)" : "var(--red)";
  elements.priceText.textContent = formatMoney(stock, stock.price);
  elements.changeText.textContent = `${stock.changePct >= 0 ? "+" : ""}${stock.changePct.toFixed(2)}%`;
  elements.changeText.className = stock.changePct >= 0 ? "positive" : "negative";
  elements.rangeFill.style.width = `${rangePct}%`;
  elements.lowText.textContent = formatMoney(stock, stock.dayLow);
  elements.highText.textContent = formatMoney(stock, stock.dayHigh);
  elements.valueScore.textContent = score === null ? "N/A" : score;
  elements.valueHint.textContent = score === null ? "缺少可信基本面資料" : score >= 78 ? "價格相對有吸引力" : score >= 60 ? "估值尚可" : "需要等待更好價格";
  elements.revenueGrowth.textContent = hasNumber(stock.revenueGrowth) ? `${stock.revenueGrowth.toFixed(1)}%` : "N/A";
  elements.revenueHint.textContent = hasNumber(stock.revenueGrowth) ? (stock.revenueGrowth > 20 ? "營收動能強" : "成長需追蹤") : "目前無即時營收資料";
  elements.smartMoney.textContent = netBuy > 12 ? "偏買超" : netBuy < -8 ? "偏賣超" : "中性";
  elements.smartMoneyHint.textContent = `買 ${stock.institutionalBuy}% / 賣 ${stock.institutionalSell}%（估算）`;
  elements.aiComment.textContent = buildComment(stock, score, labels);
  elements.longTerm.textContent = labels.longTerm;
  elements.shortTerm.textContent = labels.shortTerm;
  elements.cheapness.textContent = labels.cheapness;
  elements.riskLabel.textContent = labels.risk;
  elements.institutionStatus.textContent = netBuy > 12 ? "大戶偏多" : netBuy < -8 ? "大戶調節" : "多空拉鋸";
  elements.buyMeter.value = stock.institutionalBuy;
  elements.sellMeter.value = stock.institutionalSell;
  elements.volumeMeter.value = stock.volumePower;
  elements.dataStatus.textContent = stock.live
    ? `已串接 ${stock.source}${stock.quoteDate ? `（報價時間 ${formatQuoteTimestamp(stock)}）` : ""}；${stock.fundamentalsLive ? `基本面來自 ${stock.fundamentalsSource}。` : "目前沒有同步取得可信基本面，營收與估值欄位不做硬推估。"}`
    : stock.source === "公開展示模式"
      ? "目前是可分享的公開展示頁，價格與分析使用示範資料；本機版會串接即時財經 API。"
      : `財經 API 暫時無法連線，已切換示範資料。${stock.warnings?.[0] ? `原因：${stock.warnings[0]}` : ""}`;

  renderFlow(stock.flow);
  renderMetrics(stock);
  renderProfile(stock);

  document.querySelectorAll("[data-symbol]").forEach((button) => {
    button.classList.toggle("active", button.dataset.symbol === normalized);
  });
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderStock(elements.input.value);
});

document.querySelectorAll("[data-symbol]").forEach((button) => {
  button.addEventListener("click", () => {
    elements.input.value = button.dataset.symbol;
    renderStock(button.dataset.symbol);
  });
});

renderStock(elements.input.value);
