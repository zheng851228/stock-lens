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
  institutionStatus: document.querySelector("#institutionStatus"),
  buyMeter: document.querySelector("#buyMeter"),
  sellMeter: document.querySelector("#sellMeter"),
  volumeMeter: document.querySelector("#volumeMeter"),
  metricTable: document.querySelector("#metricTable")
};

const API_BASE = window.location.protocol === "file:" ? "http://127.0.0.1:4173" : "";

function currencySymbol(currency) {
  return currency === "TWD" ? "NT$" : "$";
}

function formatMoney(stock, value) {
  return `${currencySymbol(stock.currency)}${value.toLocaleString("zh-TW", {
    minimumFractionDigits: value >= 100 ? 0 : 2,
    maximumFractionDigits: value >= 100 ? 0 : 2
  })}`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function getValueScore(stock) {
  const growthScore = clamp(stock.revenueGrowth * 1.25, 0, 45);
  const marginScore = clamp(stock.grossMargin * 0.35, 0, 25);
  const valuationPenalty = clamp((stock.forwardPe - 18) * 1.25, 0, 28);
  const flowScore = clamp((stock.institutionalBuy - stock.institutionalSell) * 0.35, -12, 12);
  return Math.round(clamp(54 + growthScore + marginScore + flowScore - valuationPenalty, 0, 100));
}

function getLabels(stock, score) {
  const netBuy = stock.institutionalBuy - stock.institutionalSell;
  const momentum = stock.changePct + (stock.volumePower - 50) / 12;
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
  const valuationText = stock.forwardPe > 35 ? "本益比已反映較高期待" : "估值仍在可討論區間";
  const moneyText = netBuy > 15 ? "大戶買盤明顯大於賣壓" : netBuy < -8 ? "大戶偏向調節" : "籌碼呈現中性整理";
  const positionText = pricePosition > 75 ? "目前接近日內高檔，短線追價要留意震盪" : pricePosition < 35 ? "價格靠近日內低位，適合觀察承接力" : "價格位於日內中段，等待突破或回測更清楚";

  return `${stock.name} 目前估值分數為 ${score}，${valuationText}；近四季營收成長約 ${stock.revenueGrowth.toFixed(1)}%，基本面動能${stock.revenueGrowth > 20 ? "仍然強" : "需要更多確認"}。${moneyText}，資金主要流向 ${flowLeader}。${positionText}。整體來看，${labels.longTerm}，短線則偏向「${labels.shortTerm}」。`;
}

async function fetchStockFromApi(symbol, baseStock) {
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
    ["Forward P/E", stock.forwardPe.toFixed(1)],
    ["本益比", stock.pe.toFixed(1)],
    ["毛利率", stock.grossMargin ? `${stock.grossMargin.toFixed(1)}%` : "ETF"],
    ["負債比", stock.debtRatio ? `${stock.debtRatio.toFixed(0)}%` : "低"]
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
  elements.updatedText.textContent = new Date().toLocaleString("zh-TW", { hour12: false });
  elements.verdictBadge.textContent = labels.verdict;
  elements.verdictBadge.style.background = score >= 78 ? "var(--green)" : score >= 62 ? "var(--yellow)" : "var(--red)";
  elements.priceText.textContent = formatMoney(stock, stock.price);
  elements.changeText.textContent = `${stock.changePct >= 0 ? "+" : ""}${stock.changePct.toFixed(2)}%`;
  elements.changeText.className = stock.changePct >= 0 ? "positive" : "negative";
  elements.rangeFill.style.width = `${rangePct}%`;
  elements.lowText.textContent = formatMoney(stock, stock.dayLow);
  elements.highText.textContent = formatMoney(stock, stock.dayHigh);
  elements.valueScore.textContent = score;
  elements.valueHint.textContent = score >= 78 ? "價格相對有吸引力" : score >= 60 ? "估值尚可" : "需要等待更好價格";
  elements.revenueGrowth.textContent = `${stock.revenueGrowth.toFixed(1)}%`;
  elements.revenueHint.textContent = stock.revenueGrowth > 20 ? "營收動能強" : "成長需追蹤";
  elements.smartMoney.textContent = netBuy > 12 ? "偏買超" : netBuy < -8 ? "偏賣超" : "中性";
  elements.smartMoneyHint.textContent = `買 ${stock.institutionalBuy}% / 賣 ${stock.institutionalSell}%`;
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
    ? `已串接 ${stock.source}；大戶買賣與類股資金流為成交量、漲跌與產業熱度估算。`
    : `財經 API 暫時無法連線，已切換示範資料。${stock.warnings?.[0] ? `原因：${stock.warnings[0]}` : ""}`;

  renderFlow(stock.flow);
  renderMetrics(stock);

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
