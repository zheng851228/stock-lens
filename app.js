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

const quickSymbols = ["NVDA", "AAPL", "TSM", "2330.TW", "0050.TW"];

const taiwan50Constituents = [
  { symbol: "1216.TW", name: "統一" },
  { symbol: "1301.TW", name: "台塑" },
  { symbol: "1303.TW", name: "南亞" },
  { symbol: "2002.TW", name: "中鋼" },
  { symbol: "2059.TW", name: "川湖" },
  { symbol: "2207.TW", name: "和泰車" },
  { symbol: "2301.TW", name: "光寶科" },
  { symbol: "2303.TW", name: "聯電" },
  { symbol: "2308.TW", name: "台達電" },
  { symbol: "2317.TW", name: "鴻海" },
  { symbol: "2327.TW", name: "國巨*" },
  { symbol: "2330.TW", name: "台積電" },
  { symbol: "2344.TW", name: "華邦電" },
  { symbol: "2345.TW", name: "智邦" },
  { symbol: "2357.TW", name: "華碩" },
  { symbol: "2360.TW", name: "致茂" },
  { symbol: "2368.TW", name: "金像電" },
  { symbol: "2382.TW", name: "廣達" },
  { symbol: "2383.TW", name: "台光電" },
  { symbol: "2395.TW", name: "研華" },
  { symbol: "2408.TW", name: "南亞科" },
  { symbol: "2412.TW", name: "中華電" },
  { symbol: "2449.TW", name: "京元電子" },
  { symbol: "2454.TW", name: "聯發科" },
  { symbol: "2603.TW", name: "長榮" },
  { symbol: "2880.TW", name: "華南金" },
  { symbol: "2881.TW", name: "富邦金" },
  { symbol: "2882.TW", name: "國泰金" },
  { symbol: "2883.TW", name: "凱基金" },
  { symbol: "2884.TW", name: "玉山金" },
  { symbol: "2885.TW", name: "元大金" },
  { symbol: "2886.TW", name: "兆豐金" },
  { symbol: "2887.TW", name: "台新新光金" },
  { symbol: "2890.TW", name: "永豐金" },
  { symbol: "2891.TW", name: "中信金" },
  { symbol: "2892.TW", name: "第一金" },
  { symbol: "3008.TW", name: "大立光" },
  { symbol: "3017.TW", name: "奇鋐" },
  { symbol: "3037.TW", name: "欣興" },
  { symbol: "3045.TW", name: "台灣大" },
  { symbol: "3231.TW", name: "緯創" },
  { symbol: "3653.TW", name: "健策" },
  { symbol: "3661.TW", name: "世芯-KY" },
  { symbol: "3711.TW", name: "日月光投控" },
  { symbol: "4904.TW", name: "遠傳" },
  { symbol: "5880.TW", name: "合庫金" },
  { symbol: "6505.TW", name: "台塑化" },
  { symbol: "6669.TW", name: "緯穎" },
  { symbol: "6919.TW", name: "康霈*" },
  { symbol: "7769.TW", name: "鴻勁" }
];

const usTop10Constituents = [
  { symbol: "NVDA", name: "NVIDIA" },
  { symbol: "GOOG", name: "Alphabet" },
  { symbol: "AAPL", name: "Apple" },
  { symbol: "MSFT", name: "Microsoft" },
  { symbol: "AMZN", name: "Amazon" },
  { symbol: "AVGO", name: "Broadcom" },
  { symbol: "META", name: "Meta" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "WMT", name: "Walmart" },
  { symbol: "BRK-B", name: "Berkshire Hathaway" }
];

const symbolSuggestions = [
  ...new Set([
    ...quickSymbols,
    ...Object.keys(sampleStocks),
    ...taiwan50Constituents.map((item) => item.symbol),
    ...usTop10Constituents.map((item) => item.symbol)
  ])
].map((symbol) => ({
  symbol,
  name:
    taiwan50Constituents.find((item) => item.symbol === symbol)?.name ||
    usTop10Constituents.find((item) => item.symbol === symbol)?.name ||
    sampleStocks[symbol]?.name ||
    ""
}));

const taiwan50QuoteState = new Map(
  taiwan50Constituents.map(({ symbol }) => [
    symbol,
    {
      loading: true,
      price: null,
      changePct: null,
      currency: "TWD",
      live: false
    }
  ])
);

const usTop10QuoteState = new Map(
  usTop10Constituents.map(({ symbol }) => [
    symbol,
    {
      loading: true,
      price: null,
      changePct: null,
      currency: "USD",
      live: false
    }
  ])
);

let activeChartRange = "3M";
let activeSymbol = "";
let renderRequestId = 0;
const candleCache = new Map();
const chartState = {
  chart: null,
  host: null,
  candlestickSeries: null,
  volumeSeries: null,
  ma5Series: null,
  ma20Series: null,
  ma60Series: null,
  latestBar: null,
  latestStock: null,
  resizeObserver: null
};

const elements = {
  form: document.querySelector("#stockForm"),
  input: document.querySelector("#symbolInput"),
  themeToggle: document.querySelector("#themeToggle"),
  currentDateText: document.querySelector("#currentDateText"),
  suggestions: document.querySelector("#symbolSuggestions"),
  taiwan50Count: document.querySelector("#taiwan50Count"),
  taiwan50List: document.querySelector("#taiwan50List"),
  usTop10Count: document.querySelector("#usTop10Count"),
  usTop10List: document.querySelector("#usTop10List"),
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
  metricTable: document.querySelector("#metricTable"),
  chartToolbar: document.querySelector("#chartToolbar"),
  chartStatus: document.querySelector("#chartStatus"),
  chartLegend: document.querySelector("#chartLegend"),
  chartSurface: document.querySelector("#chartSurface")
};

const isLocalRuntime = ["localhost", "127.0.0.1"].includes(window.location.hostname);
const isFilePreview = window.location.protocol === "file:";
const API_BASE = isFilePreview ? "http://127.0.0.1:4173" : isLocalRuntime ? "" : null;
const THEME_STORAGE_KEY = "stock-lens-theme";

function getCssVar(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function getThemePalette() {
  return {
    text: getCssVar("--text"),
    textSoft: getCssVar("--text-soft"),
    line: getCssVar("--line"),
    panelStrong: getCssVar("--panel-strong"),
    green: getCssVar("--green"),
    red: getCssVar("--red"),
    yellow: getCssVar("--yellow"),
    blue: getCssVar("--blue"),
    violet: "#b58cff"
  };
}

function syncThemeToggleLabel() {
  const theme = document.body.dataset.theme === "light" ? "light" : "dark";
  elements.themeToggle.textContent = theme === "dark" ? "深色" : "淺色";
  elements.themeToggle.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
}

function applyChartTheme() {
  if (!chartState.chart) return;
  const palette = getThemePalette();
  chartState.chart.applyOptions({
    layout: {
      background: { color: palette.panelStrong },
      textColor: palette.textSoft,
      fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif'
    },
    grid: {
      vertLines: { color: palette.line },
      horzLines: { color: palette.line }
    },
    crosshair: {
      vertLine: { color: palette.line, width: 1, labelBackgroundColor: palette.panelStrong },
      horzLine: { color: palette.line, width: 1, labelBackgroundColor: palette.panelStrong }
    }
  });
  chartState.candlestickSeries?.applyOptions({
    upColor: palette.red,
    downColor: palette.green,
    wickUpColor: palette.red,
    wickDownColor: palette.green
  });
  chartState.volumeSeries?.applyOptions({
    color: palette.blue
  });
  chartState.ma5Series?.applyOptions({ color: palette.yellow });
  chartState.ma20Series?.applyOptions({ color: palette.blue });
  chartState.ma60Series?.applyOptions({ color: palette.violet });
}

function applyTheme(theme) {
  const nextTheme = theme === "light" ? "light" : "dark";
  document.body.dataset.theme = nextTheme;
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  syncThemeToggleLabel();
  applyChartTheme();
}

function initializeTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(storedTheme || document.body.dataset.theme || "dark");
}

function currencySymbol(currency) {
  return currency === "TWD" ? "NT$" : "$";
}

function formatMoney(stock, value) {
  if (!hasNumber(value)) return "N/A";
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

function formatPercent(value, digits = 2) {
  if (!hasNumber(value)) return "N/A";
  return `${value.toFixed(digits)}%`;
}

function formatMonthlyRevenue(value) {
  if (!hasNumber(value)) return "N/A";
  return `NT$${value.toLocaleString("zh-TW")}千元`;
}

function formatMarketCap(stock, value) {
  if (!hasNumber(value)) return "N/A";
  const isTwd = stock.currency === "TWD";
  const currency = isTwd ? "TWD" : "USD";
  const divisor = isTwd ? (value >= 1000000000000 ? 1000000000000 : 100000000) : 1000000000;
  const suffix = isTwd ? (value >= 1000000000000 ? "兆" : "億") : "B";
  const scaled = value / divisor;
  return `${currencySymbol(stock.currency)}${scaled.toLocaleString("zh-TW", {
    minimumFractionDigits: scaled >= 100 ? 0 : 1,
    maximumFractionDigits: scaled >= 100 ? 0 : 1
  })}${suffix}`;
}

function formatCompactPrice(currency, value) {
  if (!hasNumber(value)) return "載入中";
  return `${currency === "TWD" ? "NT$" : "$"}${value.toLocaleString("zh-TW", {
    minimumFractionDigits: value >= 100 ? 0 : 2,
    maximumFractionDigits: value >= 100 ? 0 : 2
  })}`;
}

function formatDateLabel(value) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

function renderCurrentDate() {
  const now = new Date();
  elements.currentDateText.textContent = `${now.getMonth() + 1}月${now.getDate()}日`;
}

function toBusinessDay(value) {
  const [year, month, day] = String(value).split("-").map(Number);
  return { year, month, day };
}

function computeMovingAverageSeries(candles, period) {
  const result = [];
  let sum = 0;
  for (let index = 0; index < candles.length; index += 1) {
    sum += candles[index].close;
    if (index >= period) {
      sum -= candles[index - period].close;
    }
    if (index >= period - 1) {
      result.push({
        time: toBusinessDay(candles[index].date),
        value: Number((sum / period).toFixed(2))
      });
    }
  }
  return result;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hasNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function numberWithFallback(value, fallback) {
  return hasNumber(value) ? value : fallback;
}

function normalizeStockForUi(stock, baseStock, symbol) {
  const price = numberWithFallback(stock.price, baseStock.price || 0);
  const previousClose = numberWithFallback(stock.previousClose, numberWithFallback(stock.open, price));
  const changePct = numberWithFallback(
    stock.changePct,
    previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0
  );
  const dayLow = numberWithFallback(stock.dayLow, Math.min(price, previousClose || price));
  const dayHigh = numberWithFallback(stock.dayHigh, Math.max(price, previousClose || price));

  return {
    ...baseStock,
    ...stock,
    symbol,
    name: stock.name || baseStock.name || symbol,
    sector: stock.sector || baseStock.sector || "未分類",
    currency: stock.currency || baseStock.currency || (symbol.endsWith(".TW") ? "TWD" : "USD"),
    price,
    previousClose,
    changePct,
    dayLow,
    dayHigh,
    institutionalBuy: numberWithFallback(stock.institutionalBuy, baseStock.institutionalBuy || 50),
    institutionalSell: numberWithFallback(stock.institutionalSell, baseStock.institutionalSell || 50),
    volumePower: numberWithFallback(stock.volumePower, baseStock.volumePower || 50),
    flow: Array.isArray(stock.flow) && stock.flow.length ? stock.flow : baseStock.flow || []
  };
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
  const flowScore = clamp(((stock.institutionalBuy || 50) - (stock.institutionalSell || 50)) * 0.35, -12, 12);
  return Math.round(clamp(54 + growthScore + marginScore + flowScore - valuationPenalty, 0, 100));
}

function getGradeLabel(score, stock) {
  if (score === null) return "資料不足｜暫不評級";
  if (score >= 85) return "S級｜強勢優質";
  if (score >= 72) return "A級｜值得追蹤";
  if (score >= 58) return "B級｜中性觀察";
  if (score >= 45) return "C級｜偏保守";
  return "D級｜風險偏高";
}

function getLabels(stock, score) {
  const netBuy = (stock.institutionalBuy || 50) - (stock.institutionalSell || 50);
  const momentum = (stock.changePct || 0) + ((stock.volumePower || 50) - 50) / 12;
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

function buildComment(stock, score, labels, gradeLabel) {
  const netBuy = (stock.institutionalBuy || 50) - (stock.institutionalSell || 50);
  const dayRange = stock.dayHigh - stock.dayLow;
  const pricePosition = dayRange > 0 ? ((stock.price - stock.dayLow) / dayRange) * 100 : 50;
  const flowLeader = (stock.flow || []).slice().sort((a, b) => b[1] - a[1])[0]?.[0] || "主要類股";
  if (score === null) {
    const moneyText = netBuy > 15 ? "目前買盤動能偏強" : netBuy < -8 ? "目前賣壓偏重" : "目前多空拉鋸";
    const dataText = stock.fundamentalsLive ? "基本面欄位仍不完整" : "目前只有報價資料，沒有同步取得可信的營收與估值欄位";
    return `${stock.name} 目前可確認的是價格與區間表現，${moneyText}，資金熱度偏向 ${flowLeader}。但 ${dataText}，所以「便宜或昂貴」和長期持有判斷先不要下太滿，短線僅能當作盤面觀察。`;
  }
  const valuationText = stock.forwardPe > 35 ? "本益比已反映較高期待" : "估值仍在可討論區間";
  const moneyText = netBuy > 15 ? "大戶買盤明顯大於賣壓" : netBuy < -8 ? "大戶偏向調節" : "籌碼呈現中性整理";
  const positionText = pricePosition > 75 ? "目前接近日內高檔，短線追價要留意震盪" : pricePosition < 35 ? "價格靠近日內低位，適合觀察承接力" : "價格位於日內中段，等待突破或回測更清楚";
  const grade = gradeLabel.split("｜")[0];

  return `${stock.name} 目前估值評級為 ${grade}，估值分數為 ${score}，${valuationText}；近四季營收成長約 ${stock.revenueGrowth.toFixed(1)}%，基本面動能${stock.revenueGrowth > 20 ? "仍然強" : "需要更多確認"}。${moneyText}，資金主要流向 ${flowLeader}。${positionText}。整體來看，${labels.longTerm}，短線則偏向「${labels.shortTerm}」。`;
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

async function fetchCandlesFromApi(symbol, baseStock, range) {
  const cacheKey = `${symbol}:${range}`;
  if (candleCache.has(cacheKey)) return candleCache.get(cacheKey);

  if (API_BASE === null) {
    const demo = {
      symbol,
      range,
      source: "公開展示模式",
      live: false,
      candles: buildDemoCandles(baseStock.price || 100, range)
    };
    candleCache.set(cacheKey, demo);
    return demo;
  }

  try {
    const response = await fetch(`${API_BASE}/api/candles/${encodeURIComponent(symbol)}?range=${encodeURIComponent(range)}`, {
      cache: "no-store"
    });
    if (!response.ok) throw new Error("candles unavailable");
    const payload = await response.json();
    candleCache.set(cacheKey, payload);
    return payload;
  } catch {
    const demo = {
      symbol,
      range,
      source: "前端示範 K 線",
      live: false,
      candles: buildDemoCandles(baseStock.price || 100, range)
    };
    candleCache.set(cacheKey, demo);
    return demo;
  }
}

function buildDemoCandles(anchorPrice, range) {
  const count = range === "6M" ? 132 : range === "1M" ? 22 : 66;
  let lastClose = anchorPrice;
  return Array.from({ length: count }, (_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (count - index - 1));
    const open = Number((lastClose + Math.sin(index / 4) * 1.1).toFixed(2));
    const close = Number((open + Math.cos(index / 3.3) * 1.6).toFixed(2));
    const high = Number((Math.max(open, close) + 0.9 + (index % 4) * 0.2).toFixed(2));
    const low = Number((Math.min(open, close) - 0.8 - (index % 3) * 0.18).toFixed(2));
    lastClose = close;
    return {
      date: date.toISOString().slice(0, 10),
      open,
      high,
      low,
      close
    };
  });
}

function getMiniCandles(symbol, currency, fallbackPrice, fallbackChangePct) {
  const cached = candleCache.get(`${symbol}:1M`) || candleCache.get(`${symbol}:3M`) || candleCache.get(`${symbol}:6M`);
  if (cached?.candles?.length) {
    return cached.candles.slice(-12);
  }

  return buildDemoCandles(fallbackPrice || (currency === "TWD" ? 100 : 200), "1M").slice(-12).map((item, index, array) => {
    if (index !== array.length - 1 || !hasNumber(fallbackChangePct)) return item;
    const prev = array[index - 1]?.close ?? item.open;
    const close = Number((prev * (1 + fallbackChangePct / 100)).toFixed(2));
    return {
      ...item,
      open: Number(prev.toFixed(2)),
      close,
      high: Number((Math.max(prev, close) + 0.8).toFixed(2)),
      low: Number((Math.min(prev, close) - 0.8).toFixed(2))
    };
  });
}

function renderMiniCandleSvg(symbol, currency, price, changePct) {
  const candles = getMiniCandles(symbol, currency, price, changePct);
  if (!candles.length) return "";

  const width = 92;
  const height = 32;
  const padding = 2;
  const highs = candles.map((item) => item.high);
  const lows = candles.map((item) => item.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const range = Math.max(max - min, 1);
  const step = (width - padding * 2) / candles.length;
  const bodyWidth = Math.max(step * 0.5, 2);
  const y = (value) => padding + ((max - value) / range) * (height - padding * 2);

  const shapes = candles
    .map((item, index) => {
      const centerX = padding + step * index + step / 2;
      const openY = y(item.open);
      const closeY = y(item.close);
      const highY = y(item.high);
      const lowY = y(item.low);
      const top = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(openY - closeY), 1);
      const klass = item.close >= item.open ? "up" : "down";
      return `
        <line class="wick ${klass}" x1="${centerX}" y1="${highY}" x2="${centerX}" y2="${lowY}"></line>
        <rect class="body ${klass}" x="${centerX - bodyWidth / 2}" y="${top}" width="${bodyWidth}" height="${bodyHeight}" rx="0.8"></rect>
      `;
    })
    .join("");

  return `
    <svg class="mini-candles" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">
      ${shapes}
    </svg>
  `;
}

function renderFlow(flow) {
  elements.flowList.innerHTML = (flow || [])
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
    ["股價淨值比", hasNumber(stock.pbRatio) ? stock.pbRatio.toFixed(2) : "N/A"],
    ["殖利率", formatPercent(stock.dividendYield, 2)],
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
    ["正式名稱", stock.legalName || stock.name || "N/A", stock.symbol || "未標示"],
    ["商品類型", stock.assetType || "N/A", stock.exchange || "未標示"],
    ["交易所", stock.exchange || "N/A", stock.source || "未標示"],
    ["幣別", stock.currency || "N/A", stock.quoteDate ? `報價 ${formatQuoteTimestamp(stock)}` : "即時或延遲報價"],
    ["開盤", hasNumber(stock.open) ? formatMoney(stock, stock.open) : "N/A", hasNumber(stock.previousClose) ? `昨收 ${formatMoney(stock, stock.previousClose)}` : "昨收 N/A"],
    ["成交量", formatPlainNumber(stock.volume), hasNumber(stock.averageVolume) ? `均量 ${formatPlainNumber(stock.averageVolume)}` : "均量 N/A"],
    ["市值", formatMarketCap(stock, stock.marketCap), stock.currency === "TWD" ? "台股以億元換算" : "美股以十億換算"],
    ["52 週區間", hasNumber(stock.week52Low) && hasNumber(stock.week52High) ? `${formatMoney(stock, stock.week52Low)} - ${formatMoney(stock, stock.week52High)}` : "N/A", "長週期價格區間"],
    ["財報季度", stock.fiscalQuarter || "N/A", stock.fundamentalsSource || "N/A"],
    ["最新月營收", formatMonthlyRevenue(stock.monthlyRevenue), stock.monthlyRevenueSource || "目前無月營收資料"],
    ["月增", formatPercent(stock.monthlyRevenueMoM, 2), stock.monthlyRevenuePeriod || "資料月份 N/A"],
    ["年增", formatPercent(stock.monthlyRevenueYoY, 2), stock.monthlyRevenuePeriod ? `${stock.monthlyRevenuePeriod} 公開資料` : "資料月份 N/A"],
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

function renderCandlesFallback(stock, payload) {
  const candles = Array.isArray(payload?.candles) ? payload.candles : [];
  if (!candles.length) {
    elements.chartStatus.textContent = "目前沒有可用的歷史日線";
    elements.chartLegend.textContent = "OHLC --";
    elements.chartSurface.innerHTML = '<div class="chart-empty">目前沒有 K 線資料</div>';
    return;
  }

  const priceHigh = Math.max(...candles.map((item) => item.high));
  const priceLow = Math.min(...candles.map((item) => item.low));
  const priceRange = Math.max(priceHigh - priceLow, 1);
  const width = 900;
  const height = 306;
  const padding = { top: 12, right: 44, bottom: 28, left: 12 };
  const drawableWidth = width - padding.left - padding.right;
  const drawableHeight = height - padding.top - padding.bottom;
  const candleStep = drawableWidth / candles.length;
  const candleBodyWidth = Math.max(Math.min(candleStep * 0.56, 10), 3);
  const latest = candles[candles.length - 1];

  const yForPrice = (price) => padding.top + ((priceHigh - price) / priceRange) * drawableHeight;
  const xForIndex = (index) => padding.left + candleStep * index + candleStep / 2;

  const gridLines = Array.from({ length: 4 }, (_, index) => {
    const ratio = index / 3;
    const price = priceHigh - priceRange * ratio;
    const y = padding.top + drawableHeight * ratio;
    return `
      <line class="chart-grid" x1="${padding.left}" y1="${y}" x2="${width - padding.right}" y2="${y}"></line>
      <text class="chart-axis" x="${width - padding.right + 6}" y="${y + 4}">${price.toFixed(price >= 100 ? 0 : 2)}</text>
    `;
  }).join("");

  const xLabels = [0, Math.floor(candles.length / 2), candles.length - 1]
    .map((index) => `
      <text class="chart-axis" x="${xForIndex(index)}" y="${height - 6}" text-anchor="middle">${formatDateLabel(candles[index].date)}</text>
    `)
    .join("");

  const candleShapes = candles
    .map((item, index) => {
      const x = xForIndex(index);
      const openY = yForPrice(item.open);
      const closeY = yForPrice(item.close);
      const highY = yForPrice(item.high);
      const lowY = yForPrice(item.low);
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(openY - closeY), 1.5);
      const klass = item.close >= item.open ? "candle-up" : "candle-down";
      return `
        <line class="${klass}" x1="${x}" y1="${highY}" x2="${x}" y2="${lowY}" stroke-width="1.4"></line>
        <rect class="${klass}" x="${x - candleBodyWidth / 2}" y="${bodyTop}" width="${candleBodyWidth}" height="${bodyHeight}" rx="1"></rect>
      `;
    })
    .join("");

  elements.chartStatus.textContent = `${payload.source}${payload.live ? "" : "（示範）"} | ${candles.length} 根日 K`;
  elements.chartLegend.textContent = `O ${formatMoney(stock, latest.open)}  H ${formatMoney(stock, latest.high)}  L ${formatMoney(stock, latest.low)}  C ${formatMoney(stock, latest.close)}`;
  elements.chartSurface.innerHTML = `
    <svg class="chart-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" role="img" aria-label="${stock.name} ${activeChartRange} K 線圖">
      ${gridLines}
      ${candleShapes}
      ${xLabels}
    </svg>
  `;
}

function updateChartLegend(stock, bar, overrideDate) {
  if (!stock || !bar) {
    elements.chartLegend.textContent = "OHLC --";
    return;
  }
  const dateText = overrideDate || (bar.date ? bar.date.replaceAll("-", "/") : "");
  elements.chartLegend.textContent = `${dateText}  O ${formatMoney(stock, bar.open)}  H ${formatMoney(stock, bar.high)}  L ${formatMoney(stock, bar.low)}  C ${formatMoney(stock, bar.close)}`;
}

function ensureMainChart() {
  if (chartState.chart && chartState.host?.isConnected) {
    return Boolean(chartState.chart);
  }
  if (chartState.chart && !chartState.host?.isConnected) {
    chartState.chart = null;
    chartState.host = null;
    chartState.candlestickSeries = null;
    chartState.volumeSeries = null;
    chartState.ma5Series = null;
    chartState.ma20Series = null;
    chartState.ma60Series = null;
  }
  if (!window.LightweightCharts) {
    return false;
  }

  elements.chartSurface.innerHTML = '<div class="chart-host"></div>';
  chartState.host = elements.chartSurface.querySelector(".chart-host");
  const palette = getThemePalette();

  const chart = window.LightweightCharts.createChart(chartState.host, {
    width: Math.max(chartState.host.clientWidth, 320),
    height: 320,
    layout: {
      background: { color: palette.panelStrong },
      textColor: palette.textSoft,
      fontFamily: '"Noto Sans TC", "PingFang TC", "Microsoft JhengHei", sans-serif'
    },
    grid: {
      vertLines: { color: palette.line },
      horzLines: { color: palette.line }
    },
    rightPriceScale: {
      borderVisible: false,
      scaleMargins: { top: 0.08, bottom: 0.28 }
    },
    timeScale: {
      borderVisible: false,
      timeVisible: true,
      secondsVisible: false
    },
    crosshair: {
      vertLine: { color: palette.line, width: 1, labelBackgroundColor: palette.panelStrong },
      horzLine: { color: palette.line, width: 1, labelBackgroundColor: palette.panelStrong }
    },
    handleScroll: { mouseWheel: false, pressedMouseMove: false, horzTouchDrag: false, vertTouchDrag: false },
    handleScale: { axisPressedMouseMove: false, mouseWheel: false, pinch: false }
  });

  chartState.chart = chart;
  chartState.candlestickSeries = chart.addCandlestickSeries({
    upColor: palette.red,
    downColor: palette.green,
    borderVisible: false,
    wickUpColor: palette.red,
    wickDownColor: palette.green,
    priceLineVisible: false
  });
  chartState.volumeSeries = chart.addHistogramSeries({
    priceScaleId: "",
    priceLineVisible: false,
    lastValueVisible: false
  });
  chart.priceScale("").applyOptions({
    scaleMargins: { top: 0.78, bottom: 0 }
  });
  chartState.ma5Series = chart.addLineSeries({ color: palette.yellow, lineWidth: 1.4, priceLineVisible: false, lastValueVisible: false });
  chartState.ma20Series = chart.addLineSeries({ color: palette.blue, lineWidth: 1.4, priceLineVisible: false, lastValueVisible: false });
  chartState.ma60Series = chart.addLineSeries({ color: palette.violet, lineWidth: 1.4, priceLineVisible: false, lastValueVisible: false });

  chart.subscribeCrosshairMove((param) => {
    const hovered = param?.seriesData?.get(chartState.candlestickSeries);
    if (hovered) {
      updateChartLegend(chartState.latestStock, hovered, param?.time?.year ? `${param.time.year}/${param.time.month}/${param.time.day}` : "");
      return;
    }
    updateChartLegend(chartState.latestStock, chartState.latestBar);
  });

  chartState.resizeObserver = new ResizeObserver((entries) => {
    const entry = entries[0];
    if (entry && chartState.chart) {
      chartState.chart.applyOptions({ width: Math.max(entry.contentRect.width, 320) });
      chartState.chart.timeScale().fitContent();
    }
  });
  chartState.resizeObserver.observe(chartState.host);

  return true;
}

function renderCandles(stock, payload) {
  const candles = Array.isArray(payload?.candles) ? payload.candles : [];
  if (!candles.length) {
    elements.chartStatus.textContent = "目前沒有可用的歷史日線";
    elements.chartLegend.textContent = "OHLC --";
    elements.chartSurface.innerHTML = '<div class="chart-empty">目前沒有 K 線資料</div>';
    return;
  }

  if (!ensureMainChart()) {
    renderCandlesFallback(stock, payload);
    return;
  }

  const candleData = candles.map((item) => ({
    time: toBusinessDay(item.date),
    open: item.open,
    high: item.high,
    low: item.low,
    close: item.close
  }));
  const volumeData = candles.map((item) => ({
    time: toBusinessDay(item.date),
    value: item.volume ?? 0,
    color: item.close >= item.open ? "rgba(255,77,87,0.72)" : "rgba(51,209,122,0.72)"
  }));

  chartState.candlestickSeries.setData(candleData);
  chartState.volumeSeries.setData(volumeData);
  chartState.ma5Series.setData(computeMovingAverageSeries(candles, 5));
  chartState.ma20Series.setData(computeMovingAverageSeries(candles, 20));
  chartState.ma60Series.setData(computeMovingAverageSeries(candles, 60));
  chartState.chart.timeScale().fitContent();
  chartState.latestBar = candles[candles.length - 1];
  chartState.latestStock = stock;

  const latest = candles[candles.length - 1];
  const latestDate = latest?.date ? latest.date.replaceAll("-", "/") : "";
  const volumeText = hasNumber(latest?.volume) ? ` | 量 ${formatPlainNumber(latest.volume)}` : "";
  elements.chartStatus.textContent = `${payload.source}${payload.live ? "" : "（示範）"} | ${candles.length} 根日 K | ${latestDate}${volumeText}`;
  updateChartLegend(stock, latest);
}

function renderSuggestions() {
  elements.suggestions.innerHTML = symbolSuggestions
    .map(({ symbol, name }) => `<option value="${symbol}">${name ? `${symbol} ${name}` : symbol}</option>`)
    .join("");
}

function renderStockLibrary(items, stateMap, countElement, container) {
  countElement.textContent = `${items.length} 檔`;
  container.innerHTML = items
    .map(
      ({ symbol, name }) => {
        const quote = stateMap.get(symbol) || {};
        const changeClass = hasNumber(quote.changePct) ? (quote.changePct >= 0 ? "positive" : "negative") : "muted";
        const changeText = hasNumber(quote.changePct)
          ? `${quote.changePct >= 0 ? "+" : ""}${quote.changePct.toFixed(2)}%`
          : quote.loading
            ? "更新中"
            : "N/A";

        return `
        <button type="button" data-symbol="${symbol}" aria-label="${symbol} ${name}">
          <div class="stock-main">
            <div class="stock-copy">
              <strong>${symbol.replace(".TW", "")}</strong>
              <span>${name}</span>
            </div>
            <div class="stock-spark">
              ${renderMiniCandleSvg(symbol, quote.currency || "TWD", quote.price, quote.changePct)}
            </div>
            <div class="stock-price">
              <b>${formatCompactPrice(quote.currency || "TWD", quote.price)}</b>
              <small class="${changeClass}">${changeText}</small>
            </div>
          </div>
        </button>
      `;
      }
    )
    .join("");
}

function updateActiveSymbolButtons(symbol) {
  document.querySelectorAll("[data-symbol]").forEach((button) => {
    button.classList.toggle("active", button.dataset.symbol === symbol);
  });
}

async function hydrateTaiwan50Quotes() {
  if (API_BASE === null) {
    taiwan50Constituents.forEach(({ symbol, name }) => {
      const base = sampleStocks[symbol] || {};
      taiwan50QuoteState.set(symbol, {
        loading: false,
        price: base.price ?? null,
        changePct: base.changePct ?? null,
        currency: "TWD",
        live: false,
        name: base.name || name
      });
    });
    renderStockLibrary(taiwan50Constituents, taiwan50QuoteState, elements.taiwan50Count, elements.taiwan50List);
    updateActiveSymbolButtons(activeSymbol);
    return;
  }

  try {
    const query = encodeURIComponent(taiwan50Constituents.map(({ symbol }) => symbol).join(","));
    const response = await fetch(`${API_BASE}/api/watchlist?symbols=${query}`, { cache: "no-store" });
    if (!response.ok) throw new Error("watchlist unavailable");
    const payload = await response.json();

    for (const item of payload.stocks || []) {
      const previous = taiwan50QuoteState.get(item.symbol) || {};
      taiwan50QuoteState.set(item.symbol, {
        ...previous,
        loading: false,
        price: item.price ?? null,
        changePct: item.changePct ?? null,
        currency: item.currency || "TWD",
        live: Boolean(item.live)
      });
    }
  } catch {
    taiwan50Constituents.forEach(({ symbol, name }) => {
      const base = sampleStocks[symbol] || {};
      taiwan50QuoteState.set(symbol, {
        loading: false,
        price: base.price ?? null,
        changePct: base.changePct ?? null,
        currency: "TWD",
        live: false,
        name: base.name || name
      });
    });
  }

  await prefetchMiniCandles(taiwan50Constituents, taiwan50QuoteState, 10);
  renderStockLibrary(taiwan50Constituents, taiwan50QuoteState, elements.taiwan50Count, elements.taiwan50List);
  updateActiveSymbolButtons(activeSymbol);
}

async function hydrateUsTop10Quotes() {
  if (API_BASE === null) {
    usTop10Constituents.forEach(({ symbol, name }) => {
      const base = sampleStocks[symbol] || {};
      usTop10QuoteState.set(symbol, {
        loading: false,
        price: base.price ?? null,
        changePct: base.changePct ?? null,
        currency: "USD",
        live: false,
        name: base.name || name
      });
    });
    renderStockLibrary(usTop10Constituents, usTop10QuoteState, elements.usTop10Count, elements.usTop10List);
    updateActiveSymbolButtons(activeSymbol);
    return;
  }

  try {
    const query = encodeURIComponent(usTop10Constituents.map(({ symbol }) => symbol).join(","));
    const response = await fetch(`${API_BASE}/api/watchlist?symbols=${query}`, { cache: "no-store" });
    if (!response.ok) throw new Error("watchlist unavailable");
    const payload = await response.json();

    for (const item of payload.stocks || []) {
      const previous = usTop10QuoteState.get(item.symbol) || {};
      usTop10QuoteState.set(item.symbol, {
        ...previous,
        loading: false,
        price: item.price ?? null,
        changePct: item.changePct ?? null,
        currency: item.currency || "USD",
        live: Boolean(item.live)
      });
    }
  } catch {
    usTop10Constituents.forEach(({ symbol, name }) => {
      const base = sampleStocks[symbol] || {};
      usTop10QuoteState.set(symbol, {
        loading: false,
        price: base.price ?? null,
        changePct: base.changePct ?? null,
        currency: "USD",
        live: false,
        name: base.name || name
      });
    });
  }

  await prefetchMiniCandles(usTop10Constituents, usTop10QuoteState);
  renderStockLibrary(usTop10Constituents, usTop10QuoteState, elements.usTop10Count, elements.usTop10List);
  updateActiveSymbolButtons(activeSymbol);
}

async function prefetchMiniCandles(items, stateMap, count = items.length) {
  const subset = items.slice(0, count);
  await Promise.all(
    subset.map(async ({ symbol }) => {
      const quote = stateMap.get(symbol) || {};
      const base = sampleStocks[symbol] || {
        price: quote.price || (quote.currency === "TWD" ? 100 : 200)
      };
      try {
        await fetchCandlesFromApi(symbol, { ...base, price: quote.price || base.price }, "1M");
      } catch {
        // keep quote-only card if historical fetch fails
      }
    })
  );
}

async function renderStock(symbol) {
  const normalized = symbol.trim().toUpperCase();
  const requestId = (renderRequestId += 1);
  activeSymbol = normalized;
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
  elements.chartStatus.textContent = "整理歷史日線中";
  elements.chartLegend.textContent = "OHLC --";
  elements.chartSurface.innerHTML = '<div class="chart-empty">載入 K 線資料中</div>';
  updateActiveSymbolButtons(normalized);
  const [rawStock, candlePayload] = await Promise.all([
    fetchStockFromApi(normalized, baseStock),
    fetchCandlesFromApi(normalized, baseStock, activeChartRange)
  ]);
  if (requestId !== renderRequestId) return;
  const stock = normalizeStockForUi(rawStock, baseStock, normalized);
  const score = getValueScore(stock);
  const gradeLabel = getGradeLabel(score, stock);
  const labels = getLabels(stock, score);
  const dayRange = stock.dayHigh - stock.dayLow;
  const rangePct = dayRange > 0 ? clamp(((stock.price - stock.dayLow) / dayRange) * 100, 4, 100) : 50;
  const netBuy = (stock.institutionalBuy || 50) - (stock.institutionalSell || 50);

  elements.companyName.textContent = stock.name;
  elements.tickerText.textContent = normalized;
  elements.sectorText.textContent = stock.sector;
  elements.updatedText.textContent = formatQuoteTimestamp(stock);
  elements.verdictBadge.textContent = labels.verdict;
  elements.verdictBadge.style.background = score === null ? "var(--cyan)" : score >= 78 ? "var(--green)" : score >= 62 ? "var(--yellow)" : "var(--red)";
  elements.priceText.textContent = formatMoney(stock, stock.price);
  elements.changeText.textContent = hasNumber(stock.changePct) ? `${stock.changePct >= 0 ? "+" : ""}${stock.changePct.toFixed(2)}%` : "N/A";
  elements.changeText.className = hasNumber(stock.changePct) && stock.changePct >= 0 ? "positive" : "negative";
  elements.rangeFill.style.width = `${rangePct}%`;
  elements.lowText.textContent = formatMoney(stock, stock.dayLow);
  elements.highText.textContent = formatMoney(stock, stock.dayHigh);
  elements.valueScore.textContent = score === null ? "N/A" : score;
  elements.valueHint.textContent = gradeLabel;
  elements.revenueGrowth.textContent = hasNumber(stock.revenueGrowth) ? `${stock.revenueGrowth.toFixed(1)}%` : "N/A";
  elements.revenueHint.textContent = hasNumber(stock.revenueGrowth) ? (stock.revenueGrowth > 20 ? "營收動能強" : "成長需追蹤") : "目前無即時營收資料";
  elements.smartMoney.textContent = netBuy > 12 ? "偏買超" : netBuy < -8 ? "偏賣超" : "中性";
  elements.smartMoneyHint.textContent = `買 ${stock.institutionalBuy || 50}% / 賣 ${stock.institutionalSell || 50}%（估算）`;
  elements.aiComment.textContent = buildComment(stock, score, labels, gradeLabel);
  elements.longTerm.textContent = labels.longTerm;
  elements.shortTerm.textContent = labels.shortTerm;
  elements.cheapness.textContent = labels.cheapness;
  elements.riskLabel.textContent = labels.risk;
  elements.institutionStatus.textContent = netBuy > 12 ? "大戶偏多" : netBuy < -8 ? "大戶調節" : "多空拉鋸";
  elements.buyMeter.value = stock.institutionalBuy || 50;
  elements.sellMeter.value = stock.institutionalSell || 50;
  elements.volumeMeter.value = stock.volumePower || 50;
  elements.dataStatus.textContent = stock.live
    ? `已串接 ${stock.source}${stock.quoteDate ? `（報價時間 ${formatQuoteTimestamp(stock)}）` : ""}；${stock.fundamentalsLive ? `基本面來自 ${stock.fundamentalsSource}。` : "目前沒有同步取得可信基本面，營收與估值欄位不做硬推估。"}${stock.monthlyRevenueSource ? ` 月營收來自 ${stock.monthlyRevenueSource}。` : ""}`
    : stock.source === "公開展示模式"
      ? "目前是可分享的公開展示頁，價格與分析使用示範資料；本機版會串接即時財經 API。"
      : `財經 API 暫時無法連線，已切換示範資料。${stock.warnings?.[0] ? `原因：${stock.warnings[0]}` : ""}`;

  renderFlow(stock.flow);
  renderMetrics(stock);
  renderProfile(stock);
  renderCandles(stock, candlePayload);
  renderStockLibrary(taiwan50Constituents, taiwan50QuoteState, elements.taiwan50Count, elements.taiwan50List);
  renderStockLibrary(usTop10Constituents, usTop10QuoteState, elements.usTop10Count, elements.usTop10List);
  updateActiveSymbolButtons(normalized);
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-symbol]");
  if (!button) return;
  elements.input.value = button.dataset.symbol;
  renderStock(button.dataset.symbol);
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  renderStock(elements.input.value);
});

elements.themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "light" ? "dark" : "light";
  applyTheme(nextTheme);
});

elements.chartToolbar.querySelectorAll("[data-range]").forEach((button) => {
  button.addEventListener("click", () => {
    activeChartRange = button.dataset.range;
    elements.chartToolbar.querySelectorAll("[data-range]").forEach((item) => {
      item.classList.toggle("active", item.dataset.range === activeChartRange);
    });
    if (activeSymbol) {
      renderStock(activeSymbol);
    }
  });
});

initializeTheme();
renderCurrentDate();
renderSuggestions();
renderStockLibrary(taiwan50Constituents, taiwan50QuoteState, elements.taiwan50Count, elements.taiwan50List);
renderStockLibrary(usTop10Constituents, usTop10QuoteState, elements.usTop10Count, elements.usTop10List);
hydrateTaiwan50Quotes();
hydrateUsTop10Quotes();
renderStock(elements.input.value);
