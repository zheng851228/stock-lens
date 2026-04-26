const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;
const STOCK_CACHE_TTL_MS = 60 * 1000;
const CANDLE_CACHE_TTL_MS = 10 * 60 * 1000;
const TWSE_MONTHLY_REVENUE_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const stockCache = new Map();
const candleCache = new Map();
const twseMonthlyRevenueCache = new Map();

const sampleStocks = {
  NVDA: {
    name: "NVIDIA Corporation",
    sector: "半導體",
    assetType: "股票",
    exchange: "NASDAQ",
    currency: "USD",
    price: 128.74,
    open: null,
    previousClose: null,
    volume: null,
    averageVolume: null,
    changePct: 2.18,
    dayLow: 124.1,
    dayHigh: 130.22,
    revenueGrowth: 78.3,
    grossMargin: 73.6,
    pe: 44.8,
    forwardPe: 31.5,
    pbRatio: 20.4,
    dividendYield: 0.03,
    fiscalQuarter: "2026/Q1",
    marketCap: 3140000000000,
    week52Low: 75.61,
    week52High: 153.13,
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
    assetType: "股票",
    exchange: "NASDAQ",
    currency: "USD",
    price: 196.58,
    open: null,
    previousClose: null,
    volume: null,
    averageVolume: null,
    changePct: -0.42,
    dayLow: 194.22,
    dayHigh: 199.7,
    revenueGrowth: 4.1,
    grossMargin: 46.9,
    pe: 29.3,
    forwardPe: 25.1,
    pbRatio: 41.7,
    dividendYield: 0.46,
    fiscalQuarter: "2026/Q1",
    marketCap: 4010000000000,
    week52Low: 164.08,
    week52High: 260.1,
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
    assetType: "ADR",
    exchange: "NYSE",
    currency: "USD",
    price: 176.32,
    open: null,
    previousClose: null,
    volume: null,
    averageVolume: null,
    changePct: 1.04,
    dayLow: 172.8,
    dayHigh: 178.1,
    revenueGrowth: 32.7,
    grossMargin: 58.4,
    pe: 26.6,
    forwardPe: 20.8,
    pbRatio: 7.3,
    dividendYield: 1.32,
    fiscalQuarter: "2026/Q1",
    marketCap: 915000000000,
    week52Low: 117.8,
    week52High: 226.4,
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
    assetType: "股票",
    exchange: "TWSE",
    currency: "TWD",
    price: 984,
    open: null,
    previousClose: null,
    volume: null,
    averageVolume: null,
    changePct: 1.23,
    dayLow: 968,
    dayHigh: 992,
    revenueGrowth: 34.2,
    grossMargin: 58.4,
    pe: 27.1,
    forwardPe: 21.2,
    pbRatio: 6.5,
    dividendYield: 1.41,
    fiscalQuarter: "2026/Q1",
    marketCap: 56600000000000,
    week52Low: 588,
    week52High: 1100,
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
    assetType: "ETF",
    exchange: "TWSE",
    currency: "TWD",
    price: 184.85,
    open: null,
    previousClose: null,
    volume: null,
    averageVolume: null,
    changePct: 0.38,
    dayLow: 183.9,
    dayHigh: 185.4,
    revenueGrowth: 13.5,
    grossMargin: 0,
    pe: 22.4,
    forwardPe: 18.6,
    pbRatio: 2.1,
    dividendYield: 2.76,
    fiscalQuarter: "2026/Q1",
    marketCap: 356000000000,
    week52Low: 145.2,
    week52High: 192.6,
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
    assetType: "股票",
    exchange: "NASDAQ",
    currency: "USD",
    price: 247.21,
    open: null,
    previousClose: null,
    volume: null,
    averageVolume: null,
    changePct: -1.36,
    dayLow: 244.5,
    dayHigh: 253.4,
    revenueGrowth: 9.8,
    grossMargin: 18.2,
    pe: 61.7,
    forwardPe: 48.9,
    pbRatio: 11.8,
    dividendYield: 0,
    fiscalQuarter: "2026/Q1",
    marketCap: 792000000000,
    week52Low: 138.8,
    week52High: 299.3,
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

const sectorFlows = {
  半導體: [
    ["AI 伺服器", 86],
    ["半導體", 82],
    ["雲端軟體", 63],
    ["金融", 44],
    ["消費零售", 31]
  ],
  晶圓代工: [
    ["AI 伺服器", 86],
    ["半導體", 83],
    ["電子權值", 74],
    ["金融", 47],
    ["航運", 36]
  ],
  "台股 ETF": [
    ["電子權值", 74],
    ["台股 ETF", 68],
    ["金融", 51],
    ["高股息", 43],
    ["傳產", 38]
  ],
  大型科技: [
    ["AI 伺服器", 78],
    ["大型科技", 66],
    ["雲端軟體", 61],
    ["金融", 43],
    ["公用事業", 31]
  ]
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "access-control-allow-origin": "*",
    "cache-control": "no-store"
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, status, text) {
  response.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  response.end(text);
}

function sanitizeSymbol(symbol) {
  return symbol.trim().toUpperCase().replace(/[^A-Z0-9.=-]/g, "");
}

function getCached(cache, key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.time > entry.ttl) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

function setCached(cache, key, value, ttl) {
  cache.set(key, { value, ttl, time: Date.now() });
  return value;
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function numberOrFallback(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function sanitizeNumericField(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function getBaseStock(symbol) {
  return sampleStocks[symbol] || {
    ...sampleStocks.NVDA,
    name: symbol,
    sector: symbol.endsWith(".TW") ? "台股" : "大型科技",
    assetType: symbol.endsWith(".TW") ? "台股商品" : "股票",
    exchange: symbol.endsWith(".TW") ? "TWSE/TPEx" : "US Market",
    currency: symbol.endsWith(".TW") ? "TWD" : "USD",
    flow: sectorFlows[symbol.endsWith(".TW") ? "台股 ETF" : "大型科技"]
  };
}

function enrichMoneyFlow(stock, quote) {
  const volume = numberOrFallback(quote.regularMarketVolume, 0);
  const average = numberOrFallback(quote.averageDailyVolume3Month, volume || 1);
  const relativeVolume = average > 0 ? clamp((volume / average) * 50, 20, 100) : 50;
  const priceBias = clamp(50 + stock.changePct * 7, 15, 85);
  const institutionalBuy = Math.round(clamp((priceBias * 0.65) + (relativeVolume * 0.35), 18, 88));
  const institutionalSell = 100 - institutionalBuy;

  return {
    institutionalBuy,
    institutionalSell,
    volumePower: Math.round(relativeVolume)
  };
}

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "accept": "application/json",
        "user-agent": "StockLens/0.1"
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 7000);
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "accept": "text/plain,text/csv,text/html,*/*",
        "user-agent": "StockLens/0.1"
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } finally {
    clearTimeout(timeout);
  }
}

function getMonthAnchor(offsetMonths) {
  const date = new Date();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() - offsetMonths);
  return date;
}

function buildTwseDate(date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}${month}01`;
}

function normalizeTwsePrice(value) {
  const cleaned = String(value || "").replace(/,/g, "").trim();
  if (!cleaned || cleaned === "--" || cleaned === "----") return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function parseTwseDate(value) {
  const [rocYear, month, day] = String(value || "").split("/");
  const year = Number(rocYear) + 1911;
  if (!year || !month || !day) return null;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseTwseNumber(value) {
  const cleaned = String(value || "").replace(/,/g, "").replace(/X/g, "").trim();
  if (!cleaned || cleaned === "--" || cleaned === "----" || cleaned === "N/A") return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function formatRocYearMonth(value) {
  const match = String(value || "").trim().match(/^(\d{2,3})(\d{2})$/);
  if (!match) return null;
  const year = Number(match[1]) + 1911;
  const month = Number(match[2]);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) {
    return null;
  }
  return `${year}-${String(month).padStart(2, "0")}`;
}

function buildDemoCandles(symbol, base, length) {
  const seed = Array.from(symbol).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  let lastClose = base.price || 100;
  return Array.from({ length }, (_, index) => {
    const date = new Date();
    date.setUTCDate(date.getUTCDate() - (length - index - 1));
    const drift = Math.sin((index + seed) / 3.5) * 1.4;
    const open = Number((lastClose + Math.cos((index + seed) / 2.7) * 0.9).toFixed(2));
    const close = Number((open + drift).toFixed(2));
    const high = Number((Math.max(open, close) + 0.8 + ((index + seed) % 4) * 0.2).toFixed(2));
    const low = Number((Math.min(open, close) - 0.8 - ((index + seed) % 3) * 0.18).toFixed(2));
    lastClose = close;
    return {
      date: date.toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
      volume: Math.round(800000 + (Math.abs(drift) * 250000 + ((index + seed) % 7) * 110000))
    };
  });
}

async function fetchTwseCandles(symbol, rangeMonths) {
  const code = symbol.replace(".TW", "");
  const requests = Array.from({ length: rangeMonths + 1 }, (_, index) => {
    const date = buildTwseDate(getMonthAnchor(index));
    return fetchJson(`https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=${date}&stockNo=${encodeURIComponent(code)}`);
  });

  const responses = await Promise.all(requests);
  const rows = responses.flatMap((json) => (Array.isArray(json?.data) ? json.data : []));
  const candles = rows
    .map((row) => ({
      date: parseTwseDate(row[0]),
      volume: normalizeTwsePrice(row[1]),
      open: normalizeTwsePrice(row[3]),
      high: normalizeTwsePrice(row[4]),
      low: normalizeTwsePrice(row[5]),
      close: normalizeTwsePrice(row[6])
    }))
    .filter((item) => item.date && item.open && item.high && item.low && item.close)
    .sort((a, b) => a.date.localeCompare(b.date));

  if (!candles.length) {
    throw new Error("TWSE candles unavailable");
  }

  return candles;
}

async function fetchTwseBwibbu(symbol, monthOffset = 0) {
  const code = symbol.replace(".TW", "");
  const date = buildTwseDate(getMonthAnchor(monthOffset));
  const json = await fetchJson(`https://www.twse.com.tw/exchangeReport/BWIBBU?response=json&date=${date}&stockNo=${encodeURIComponent(code)}`);
  const rows = Array.isArray(json?.data) ? json.data : [];
  if (!rows.length) {
    throw new Error("TWSE BWIBBU unavailable");
  }
  const latest = rows[rows.length - 1];
  return {
    dividendYield: parseTwseNumber(latest?.[1]),
    pe: parseTwseNumber(latest?.[3]),
    pbRatio: parseTwseNumber(latest?.[4]),
    fiscalQuarter: latest?.[5] ? String(latest[5]) : null,
    fundamentalsSource: "TWSE BWIBBU",
    fundamentalsLive: true
  };
}

async function maybeEnrichWithTwseValuation(symbol, stock, warnings) {
  if (!symbol.endsWith(".TW")) return stock;
  if (stock.fundamentalsLive && stock.pe && stock.pbRatio && stock.dividendYield !== null) return stock;

  for (const monthOffset of [0, 1, 2]) {
    try {
      const valuation = await fetchTwseBwibbu(symbol, monthOffset);
      return {
        ...stock,
        pe: valuation.pe ?? stock.pe,
        forwardPe: valuation.pe ?? stock.forwardPe,
        pbRatio: valuation.pbRatio ?? stock.pbRatio,
        dividendYield: valuation.dividendYield ?? stock.dividendYield,
        fiscalQuarter: valuation.fiscalQuarter || stock.fiscalQuarter,
        fundamentalsSource: stock.fundamentalsSource || valuation.fundamentalsSource,
        fundamentalsLive: Boolean(stock.fundamentalsLive || valuation.fundamentalsLive)
      };
    } catch (error) {
      warnings.push(error.message);
    }
  }

  return stock;
}

async function fetchTwseMonthlyRevenueDataset(kind) {
  const cacheKey = `twse-monthly-revenue:${kind}`;
  const cached = getCached(twseMonthlyRevenueCache, cacheKey);
  if (cached) return cached;

  const path = kind === "public" ? "t187ap05_P" : "t187ap05_L";
  const rows = await fetchJson(`https://openapi.twse.com.tw/v1/opendata/${path}`);
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error(`TWSE monthly revenue dataset unavailable: ${kind}`);
  }

  return setCached(twseMonthlyRevenueCache, cacheKey, rows, TWSE_MONTHLY_REVENUE_CACHE_TTL_MS);
}

function parseTwseMonthlyRevenueRow(row) {
  if (!row || typeof row !== "object") return null;
  return {
    monthlyRevenue: parseTwseNumber(row["營業收入-當月營收"]),
    monthlyRevenueMoM: parseTwseNumber(row["營業收入-上月比較增減(%)"]),
    monthlyRevenueYoY: parseTwseNumber(row["營業收入-去年同月增減(%)"]),
    monthlyRevenuePeriod: formatRocYearMonth(row["資料年月"]) || String(row["資料年月"] || "").trim() || null
  };
}

async function fetchTwseMonthlyRevenue(symbol) {
  const code = symbol.replace(".TW", "");

  for (const datasetKind of ["listed", "public"]) {
    const rows = await fetchTwseMonthlyRevenueDataset(datasetKind);
    const row = rows.find((item) => String(item?.["公司代號"] || "").trim() === code);
    if (!row) continue;

    const parsed = parseTwseMonthlyRevenueRow(row);
    if (!parsed) continue;

    return {
      ...parsed,
      monthlyRevenueSource: datasetKind === "listed" ? "TWSE monthly revenue (listed)" : "TWSE monthly revenue (public)"
    };
  }

  throw new Error("TWSE monthly revenue unavailable");
}

async function maybeEnrichWithTwseMonthlyRevenue(symbol, stock, warnings) {
  if (!symbol.endsWith(".TW")) return stock;

  try {
    const monthlyRevenue = await fetchTwseMonthlyRevenue(symbol);
    return {
      ...stock,
      monthlyRevenue: monthlyRevenue.monthlyRevenue ?? stock.monthlyRevenue ?? null,
      monthlyRevenueMoM: monthlyRevenue.monthlyRevenueMoM ?? stock.monthlyRevenueMoM ?? null,
      monthlyRevenueYoY: monthlyRevenue.monthlyRevenueYoY ?? stock.monthlyRevenueYoY ?? null,
      monthlyRevenuePeriod: monthlyRevenue.monthlyRevenuePeriod || stock.monthlyRevenuePeriod || null,
      monthlyRevenueSource: monthlyRevenue.monthlyRevenueSource || stock.monthlyRevenueSource || null
    };
  } catch (error) {
    warnings.push(error.message);
    return {
      ...stock,
      monthlyRevenue: stock.monthlyRevenue ?? null,
      monthlyRevenueMoM: stock.monthlyRevenueMoM ?? null,
      monthlyRevenueYoY: stock.monthlyRevenueYoY ?? null,
      monthlyRevenuePeriod: stock.monthlyRevenuePeriod ?? null,
      monthlyRevenueSource: stock.monthlyRevenueSource ?? null
    };
  }
}

async function fetchStooqCandles(symbol) {
  const stooqSymbol = symbol.includes(".TW")
    ? `${symbol.replace(".TW", "")}.tw`
    : `${symbol.toLowerCase()}.us`;
  const csv = await fetchText(`https://stooq.com/q/d/l/?s=${encodeURIComponent(stooqSymbol)}&i=d`);
  const rows = csv.trim().split("\n").slice(1);
  const candles = rows
    .map((line) => {
      const [date, open, high, low, close, volume] = line.split(",");
      return {
        date,
        volume: sanitizeNumericField(volume),
        open: sanitizeNumericField(open),
        high: sanitizeNumericField(high),
        low: sanitizeNumericField(low),
        close: sanitizeNumericField(close)
      };
    })
    .filter((item) => item.date && item.open && item.high && item.low && item.close);

  if (!candles.length) {
    throw new Error("Stooq candles unavailable");
  }

  return candles;
}

async function getCandleData(symbol, rangeLabel) {
  const base = getBaseStock(symbol);
  const rangeMonths = rangeLabel === "6M" ? 6 : rangeLabel === "1M" ? 1 : 3;
  const targetLength = rangeMonths === 1 ? 22 : rangeMonths === 6 ? 132 : 66;

  if (symbol.endsWith(".TW")) {
    try {
      const candles = await fetchTwseCandles(symbol, rangeMonths);
      return {
        symbol,
        range: rangeLabel,
        source: "TWSE historical daily",
        live: true,
        candles: candles.slice(-targetLength)
      };
    } catch {}
  }

  try {
    const candles = await fetchStooqCandles(symbol);
    return {
      symbol,
      range: rangeLabel,
      source: "Stooq historical daily",
      live: true,
      candles: candles.slice(-targetLength)
    };
  } catch {}

  return {
    symbol,
    range: rangeLabel,
    source: "Demo candles",
    live: false,
    candles: buildDemoCandles(symbol, base, targetLength)
  };
}

async function getCachedCandleData(symbol, rangeLabel) {
  const key = `${symbol}:${rangeLabel}`;
  const cached = getCached(candleCache, key);
  if (cached) return cached;
  const candles = await getCandleData(symbol, rangeLabel);
  return setCached(candleCache, key, candles, CANDLE_CACHE_TTL_MS);
}

async function fetchYahooQuote(symbol) {
  const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
  const quoteJson = await fetchJson(quoteUrl);
  const quote = quoteJson?.quoteResponse?.result?.[0];
  if (!quote || !Number.isFinite(Number(quote.regularMarketPrice))) {
    throw new Error("Yahoo quote unavailable");
  }

  let summary = {};
  try {
    const modules = "assetProfile,financialData,defaultKeyStatistics,summaryDetail";
    const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}`;
    const summaryJson = await fetchJson(summaryUrl);
    summary = summaryJson?.quoteSummary?.result?.[0] || {};
  } catch {
    summary = {};
  }

  return { quote, summary };
}

async function fetchFinnhubStock(symbol, base) {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) throw new Error("Finnhub API key not configured");

  const [quote, profile, basicFinancials] = await Promise.all([
    fetchJson(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`),
    fetchJson(`https://finnhub.io/api/v1/stock/profile2?symbol=${encodeURIComponent(symbol)}&token=${encodeURIComponent(apiKey)}`),
    fetchJson(`https://finnhub.io/api/v1/stock/metric?symbol=${encodeURIComponent(symbol)}&metric=all&token=${encodeURIComponent(apiKey)}`)
  ]);

  const price = sanitizeNumericField(quote.c);
  if (!price || price <= 0) {
    throw new Error("Finnhub quote unavailable");
  }

  const metrics = basicFinancials.metric || {};
  const marketQuote = {
    regularMarketVolume: sanitizeNumericField(quote.v) || 0,
    averageDailyVolume3Month: sanitizeNumericField(metrics["3MonthAverageTradingVolume"]) || sanitizeNumericField(quote.v) || 1
  };
  const changePct = sanitizeNumericField(quote.dp) ?? base.changePct;
  const moneyFlow = enrichMoneyFlow({ ...base, changePct }, marketQuote);
  const sector = profile.finnhubIndustry || base.sector;

  return {
    ...base,
    ...moneyFlow,
    symbol,
    name: profile.name || base.name,
    sector,
    assetType: "股票",
    exchange: profile.exchange || base.exchange,
    currency: profile.currency || base.currency,
    price,
    open: sanitizeNumericField(quote.o),
    previousClose: sanitizeNumericField(quote.pc),
    volume: sanitizeNumericField(quote.v),
    averageVolume: sanitizeNumericField(metrics["3MonthAverageTradingVolume"]),
    changePct,
    dayLow: sanitizeNumericField(quote.l) ?? base.dayLow,
    dayHigh: sanitizeNumericField(quote.h) ?? base.dayHigh,
    revenueGrowth: sanitizeNumericField(metrics.revenueGrowthTTMYoy),
    grossMargin: sanitizeNumericField(metrics.grossMarginTTM),
    pe: sanitizeNumericField(metrics.peTTM),
    forwardPe: sanitizeNumericField(metrics.peBasicExclExtraTTM) ?? sanitizeNumericField(metrics.currentEvFreeCashFlowTTM),
    pbRatio: sanitizeNumericField(metrics.pbQuarterly),
    dividendYield: sanitizeNumericField(metrics.dividendYieldIndicatedAnnual),
    fiscalQuarter: metrics.yearQuarter || null,
    marketCap: sanitizeNumericField(profile.marketCapitalization),
    week52Low: sanitizeNumericField(metrics["52WeekLow"]),
    week52High: sanitizeNumericField(metrics["52WeekHigh"]),
    debtRatio: sanitizeNumericField(metrics.totalDebtToEquityQuarterly),
    flow: sectorFlows[sector] || base.flow,
    fetchedAt: new Date().toISOString(),
    live: true,
    source: "Finnhub API",
    fundamentalsSource: Object.keys(metrics).length ? "Finnhub Basic Financials" : null,
    fundamentalsLive: Object.keys(metrics).length > 0,
    warnings: []
  };
}

async function fetchFmpFundamentals(symbol) {
  const apiKey = process.env.FMP_API_KEY;
  if (!apiKey) throw new Error("FMP API key not configured");

  const metricsUrl = `https://financialmodelingprep.com/stable/key-metrics-ttm?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
  const profileUrl = `https://financialmodelingprep.com/stable/profile?symbol=${encodeURIComponent(symbol)}&apikey=${encodeURIComponent(apiKey)}`;
  const growthUrl = `https://financialmodelingprep.com/stable/financial-growth?symbol=${encodeURIComponent(symbol)}&limit=1&apikey=${encodeURIComponent(apiKey)}`;

  const [metricsList, profileList, growthList] = await Promise.all([
    fetchJson(metricsUrl),
    fetchJson(profileUrl),
    fetchJson(growthUrl)
  ]);

  const metrics = Array.isArray(metricsList) ? metricsList[0] : null;
  const profile = Array.isArray(profileList) ? profileList[0] : null;
  const growth = Array.isArray(growthList) ? growthList[0] : null;

  if (!metrics && !profile && !growth) {
    throw new Error("FMP fundamentals unavailable");
  }

  return {
    name: profile?.companyName || null,
    sector: profile?.sector || null,
    assetType: profile?.isEtf ? "ETF" : null,
    exchange: profile?.exchangeShortName || profile?.exchange || null,
    currency: profile?.currency || null,
    revenueGrowth: sanitizeNumericField(growth?.revenueGrowth),
    grossMargin: sanitizeNumericField(metrics?.grossProfitMarginTTM),
    pe: sanitizeNumericField(metrics?.peRatioTTM),
    forwardPe: sanitizeNumericField(metrics?.peRatioTTM),
    pbRatio: sanitizeNumericField(metrics?.pbRatioTTM),
    debtRatio: sanitizeNumericField(metrics?.debtToEquityTTM),
    fundamentalsSource: "FMP key metrics/growth",
    fundamentalsLive: true
  };
}

async function maybeEnrichWithFmp(symbol, stock, warnings) {
  if (stock.fundamentalsLive) return stock;

  try {
    const fmp = await fetchFmpFundamentals(symbol);
    return {
      ...stock,
      name: fmp.name || stock.name,
      sector: fmp.sector || stock.sector,
      assetType: fmp.assetType || stock.assetType,
      exchange: fmp.exchange || stock.exchange,
      currency: fmp.currency || stock.currency,
      revenueGrowth: fmp.revenueGrowth,
      grossMargin: fmp.grossMargin,
      pe: fmp.pe,
      forwardPe: fmp.forwardPe,
      pbRatio: fmp.pbRatio,
      debtRatio: fmp.debtRatio,
      fundamentalsSource: fmp.fundamentalsSource,
      fundamentalsLive: fmp.fundamentalsLive
    };
  } catch (error) {
    warnings.push(error.message);
    return stock;
  }
}

async function fetchStooqQuote(symbol) {
  const stooqSymbol = symbol.includes(".TW")
    ? `${symbol.replace(".TW", "")}.tw`
    : `${symbol.toLowerCase()}.us`;
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(stooqSymbol)}&f=sd2t2ohlcv&h&e=json`;
  const json = await fetchJson(url);
  const quote = json?.symbols?.[0];
  const close = Number(quote?.close);
  if (!Number.isFinite(close) || close <= 0) throw new Error("Stooq quote unavailable");

  return {
    price: close,
    dayHigh: numberOrFallback(quote.high, close),
    dayLow: numberOrFallback(quote.low, close),
    open: numberOrFallback(quote.open, close),
    source: "Stooq"
  };
}

async function fetchTwseQuote(symbol) {
  if (!symbol.endsWith(".TW")) throw new Error("Not a Taiwan stock symbol");

  const code = symbol.replace(".TW", "");
  const markets = [`tse_${code}.tw`, `otc_${code}.tw`];

  for (const market of markets) {
    const params = new URLSearchParams({
      ex_ch: market,
      json: "1",
      delay: "0",
      _: String(Date.now())
    });
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?${params.toString()}`;

    try {
      const json = await fetchJson(url);
      const quote = json?.msgArray?.[0];
      if (!quote) continue;

      const price = numberOrFallback(quote.z, numberOrFallback(quote.pz, numberOrFallback(quote.y, 0)));
      if (!price) continue;

      const previousClose = numberOrFallback(quote.y, price);
      return {
        price,
        open: sanitizeNumericField(quote.o),
        previousClose,
        volume: sanitizeNumericField(quote.v),
        averageVolume: null,
        dayHigh: numberOrFallback(quote.h, price),
        dayLow: numberOrFallback(quote.l, price),
        changePct: previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0,
        name: quote.n || quote.nf || symbol,
        legalName: quote.nf || quote.n || symbol,
        source: "TWSE MIS API",
        quotedAt: quote.d && quote.t ? `${quote.d} ${quote.t}` : null,
        exchange: quote.ex === "otc" ? "TPEx" : "TWSE",
        assetType: /基金|ETF/.test(quote.nf || quote.n || "") ? "ETF" : "股票",
        sector: /基金|ETF/.test(quote.nf || quote.n || "") ? "台股 ETF" : null
      };
    } catch {
      continue;
    }
  }

  throw new Error("TWSE quote unavailable");
}

async function fetchAlphaVantageStock(symbol, base) {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) throw new Error("Alpha Vantage API key not configured");

  const quoteParams = new URLSearchParams({
    function: "GLOBAL_QUOTE",
    symbol,
    apikey: apiKey
  });
  const overviewParams = new URLSearchParams({
    function: "OVERVIEW",
    symbol,
    apikey: apiKey
  });
  const [quoteJson, overview] = await Promise.all([
    fetchJson(`https://www.alphavantage.co/query?${quoteParams.toString()}`),
    fetchJson(`https://www.alphavantage.co/query?${overviewParams.toString()}`)
  ]);

  if (quoteJson.Note || quoteJson.Information || overview.Note || overview.Information) {
    throw new Error("Alpha Vantage rate limit or entitlement message");
  }

  const quote = quoteJson["Global Quote"] || {};
  const price = Number(quote["05. price"]);
  if (!Number.isFinite(price) || price <= 0) {
    throw new Error("Alpha Vantage quote unavailable");
  }

  const revenueGrowthRaw = Number(overview.QuarterlyRevenueGrowthYOY);
  const grossProfit = Number(overview.GrossProfitTTM);
  const revenue = Number(overview.RevenueTTM);
  const grossMargin = revenue > 0 ? (grossProfit / revenue) * 100 : Number(overview.ProfitMargin) * 100;
  const changePercent = Number(String(quote["10. change percent"] || "").replace("%", ""));
  const volume = numberOrFallback(quote["06. volume"], 0);
  const moneyFlow = enrichMoneyFlow(
    { ...base, changePct: numberOrFallback(changePercent, base.changePct) },
    {
      regularMarketVolume: volume,
      averageDailyVolume3Month: volume || 1
    }
  );
  const sector = overview.Sector && overview.Sector !== "None" ? overview.Sector : base.sector;

  return {
    ...base,
    ...moneyFlow,
    symbol,
    name: overview.Name || base.name,
    sector,
    assetType: overview.AssetType || base.assetType,
    exchange: overview.Exchange || base.exchange,
    currency: overview.Currency || base.currency,
    price,
    open: sanitizeNumericField(quote["02. open"]),
    previousClose: null,
    volume: sanitizeNumericField(quote["06. volume"]),
    averageVolume: null,
    changePct: numberOrFallback(changePercent, base.changePct),
    dayLow: numberOrFallback(quote["04. low"], base.dayLow),
    dayHigh: numberOrFallback(quote["03. high"], base.dayHigh),
    revenueGrowth: sanitizeNumericField(revenueGrowthRaw * 100),
    grossMargin: sanitizeNumericField(grossMargin),
    pe: sanitizeNumericField(overview.PERatio),
    forwardPe: sanitizeNumericField(overview.ForwardPE),
    pbRatio: sanitizeNumericField(overview.PriceToBookRatio),
    dividendYield: sanitizeNumericField(Number(overview.DividendYield) * 100),
    marketCap: sanitizeNumericField(overview.MarketCapitalization),
    week52Low: sanitizeNumericField(overview["52WeekLow"]),
    week52High: sanitizeNumericField(overview["52WeekHigh"]),
    debtRatio: null,
    flow: sectorFlows[sector] || base.flow,
    fetchedAt: new Date().toISOString(),
    live: true,
    source: "Alpha Vantage API",
    fundamentalsSource: "Alpha Vantage OVERVIEW",
    fundamentalsLive: true,
    warnings: []
  };
}

async function getStockData(symbol) {
  const base = getBaseStock(symbol);
  const warnings = [];

  try {
    return await fetchAlphaVantageStock(symbol, base);
  } catch (error) {
    warnings.push(error.message);
  }

  if (symbol.endsWith(".TW")) {
    try {
      const quote = await fetchTwseQuote(symbol);
      const twseStock = await maybeEnrichWithTwseMonthlyRevenue(
        symbol,
        await maybeEnrichWithTwseValuation(
          symbol,
          await maybeEnrichWithFmp(symbol, {
        ...base,
        symbol,
        name: quote.name || base.name,
        legalName: quote.legalName || quote.name || base.name,
        sector: quote.sector || base.sector,
        assetType: quote.assetType || base.assetType,
        exchange: quote.exchange || base.exchange,
        currency: "TWD",
        price: quote.price,
        open: quote.open,
        previousClose: quote.previousClose,
        volume: quote.volume,
        averageVolume: quote.averageVolume,
        dayLow: quote.dayLow,
        dayHigh: quote.dayHigh,
        changePct: quote.changePct,
        revenueGrowth: null,
        grossMargin: null,
        pe: null,
        forwardPe: null,
        pbRatio: null,
        dividendYield: null,
        fiscalQuarter: null,
        marketCap: base.marketCap ?? null,
        week52Low: null,
        week52High: null,
        monthlyRevenue: null,
        monthlyRevenueMoM: null,
        monthlyRevenueYoY: null,
        monthlyRevenuePeriod: null,
        monthlyRevenueSource: null,
        debtRatio: null,
        fetchedAt: new Date().toISOString(),
        live: true,
        source: quote.source,
        quoteDate: quote.quotedAt,
        fundamentalsSource: null,
        fundamentalsLive: false,
        warnings
          }, warnings),
          warnings
        ),
        warnings
      );
      return twseStock;
    } catch (error) {
      warnings.push(error.message);
    }
  }

  try {
    return await fetchFinnhubStock(symbol, base);
  } catch (error) {
    warnings.push(error.message);
  }

  try {
    const { quote, summary } = await fetchYahooQuote(symbol);
    const financialData = summary.financialData || {};
    const keyStats = summary.defaultKeyStatistics || {};
    const profile = summary.assetProfile || {};
    const summaryDetail = summary.summaryDetail || {};
    const moneyFlow = enrichMoneyFlow(
      {
        ...base,
        changePct: numberOrFallback(quote.regularMarketChangePercent, base.changePct)
      },
      quote
    );
    const sector = profile.sector || base.sector;

    return await maybeEnrichWithFmp(symbol, {
      ...base,
      ...moneyFlow,
      symbol,
      name: quote.longName || quote.shortName || base.name,
      sector,
      assetType: quote.quoteType === "ETF" ? "ETF" : "股票",
      exchange: quote.fullExchangeName || quote.exchange || base.exchange,
      currency: quote.currency || base.currency,
      price: numberOrFallback(quote.regularMarketPrice, base.price),
      open: sanitizeNumericField(quote.regularMarketOpen),
      previousClose: sanitizeNumericField(quote.regularMarketPreviousClose ?? quote.regularMarketPrice - quote.regularMarketChange),
      volume: sanitizeNumericField(quote.regularMarketVolume),
      averageVolume: sanitizeNumericField(quote.averageDailyVolume3Month),
      changePct: numberOrFallback(quote.regularMarketChangePercent, base.changePct),
      dayLow: numberOrFallback(quote.regularMarketDayLow, base.dayLow),
      dayHigh: numberOrFallback(quote.regularMarketDayHigh, base.dayHigh),
      revenueGrowth: sanitizeNumericField(financialData.revenueGrowth?.raw * 100),
      grossMargin: sanitizeNumericField(financialData.grossMargins?.raw * 100),
      pe: sanitizeNumericField(quote.trailingPE),
      forwardPe: sanitizeNumericField(quote.forwardPE || keyStats.forwardPE?.raw),
      pbRatio: sanitizeNumericField(quote.regularMarketPrice / keyStats.bookValue?.raw),
      dividendYield: sanitizeNumericField(summaryDetail.dividendYield?.raw * 100),
      fiscalQuarter: keyStats.mostRecentQuarter?.fmt || keyStats.lastFiscalYearEnd?.fmt || null,
      marketCap: sanitizeNumericField(quote.marketCap),
      week52Low: sanitizeNumericField(quote.fiftyTwoWeekLow),
      week52High: sanitizeNumericField(quote.fiftyTwoWeekHigh),
      monthlyRevenue: null,
      monthlyRevenueMoM: null,
      monthlyRevenueYoY: null,
      monthlyRevenuePeriod: null,
      monthlyRevenueSource: null,
      debtRatio: sanitizeNumericField(financialData.debtToEquity?.raw / 100),
      flow: sectorFlows[sector] || base.flow,
      fetchedAt: new Date().toISOString(),
      live: true,
      source: "Yahoo Finance API",
      fundamentalsSource: Object.keys(summary).length ? "Yahoo Finance Summary" : null,
      fundamentalsLive: Object.keys(summary).length > 0,
      warnings
    }, warnings);
  } catch (error) {
    warnings.push(error.message);
  }

  try {
    const quote = await fetchStooqQuote(symbol);
    const changePct = quote.open > 0 ? ((quote.price - quote.open) / quote.open) * 100 : base.changePct;
    return await maybeEnrichWithFmp(symbol, {
      ...base,
      symbol,
      price: quote.price,
      open: quote.open,
      previousClose: quote.open,
      volume: null,
      averageVolume: null,
      dayLow: quote.dayLow,
      dayHigh: quote.dayHigh,
      changePct,
      revenueGrowth: null,
      grossMargin: null,
      pe: null,
      forwardPe: null,
      pbRatio: null,
      dividendYield: null,
      fiscalQuarter: null,
      marketCap: base.marketCap ?? null,
      week52Low: base.week52Low ?? null,
      week52High: base.week52High ?? null,
      monthlyRevenue: null,
      monthlyRevenueMoM: null,
      monthlyRevenueYoY: null,
      monthlyRevenuePeriod: null,
      monthlyRevenueSource: null,
      debtRatio: null,
      fetchedAt: new Date().toISOString(),
      live: true,
      source: quote.source,
      fundamentalsSource: null,
      fundamentalsLive: false,
      warnings
    }, warnings);
  } catch (error) {
    warnings.push(error.message);
  }

  const demoFallback = {
    ...base,
    symbol,
    fetchedAt: new Date().toISOString(),
    live: false,
    source: "Demo fallback",
    fundamentalsSource: "Demo fallback",
    fundamentalsLive: false,
    monthlyRevenue: null,
    monthlyRevenueMoM: null,
    monthlyRevenueYoY: null,
    monthlyRevenuePeriod: null,
    monthlyRevenueSource: null,
    warnings
  };

  return await maybeEnrichWithFmp(symbol, demoFallback, warnings);
}

async function getCachedStockData(symbol) {
  const cached = getCached(stockCache, symbol);
  if (cached) return cached;
  const stock = await getStockData(symbol);
  return setCached(stockCache, symbol, stock, STOCK_CACHE_TTL_MS);
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/health") {
    sendJson(response, 200, { ok: true, time: new Date().toISOString() });
    return;
  }

  if (pathname === "/api/watchlist") {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const symbols = String(url.searchParams.get("symbols") || "")
      .split(",")
      .map((symbol) => sanitizeSymbol(symbol))
      .filter(Boolean)
      .slice(0, 60);

    if (!symbols.length) {
      sendJson(response, 400, { error: "Missing symbols" });
      return;
    }

    const stocks = await mapWithConcurrency(
      symbols,
      6,
      async (symbol) => {
        try {
          const stock = await getCachedStockData(symbol);
          return {
            symbol,
            name: stock.name,
            price: stock.price,
            changePct: stock.changePct,
            currency: stock.currency,
            source: stock.source,
            live: stock.live
          };
        } catch (error) {
          return {
            symbol,
            error: error.message,
            live: false
          };
        }
      }
    );

    sendJson(response, 200, {
      fetchedAt: new Date().toISOString(),
      stocks
    });
    return;
  }

  const candleMatch = pathname.match(/^\/api\/candles\/(.+)$/);
  if (candleMatch) {
    const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    const symbol = sanitizeSymbol(decodeURIComponent(candleMatch[1]));
    const range = ["1M", "3M", "6M"].includes(String(url.searchParams.get("range") || "").toUpperCase())
      ? String(url.searchParams.get("range")).toUpperCase()
      : "3M";

    if (!symbol) {
      sendJson(response, 400, { error: "Missing stock symbol" });
      return;
    }

    try {
      const candles = await getCachedCandleData(symbol, range);
      sendJson(response, 200, candles);
    } catch (error) {
      sendJson(response, 500, { error: error.message });
    }
    return;
  }

  const match = pathname.match(/^\/api\/stock\/(.+)$/);
  if (!match) {
    sendJson(response, 404, { error: "API endpoint not found" });
    return;
  }

  const symbol = sanitizeSymbol(decodeURIComponent(match[1]));
  if (!symbol) {
    sendJson(response, 400, { error: "Missing stock symbol" });
    return;
  }

  try {
    const stock = await getCachedStockData(symbol);
    sendJson(response, 200, stock);
  } catch (error) {
    sendJson(response, 500, { error: error.message });
  }
}

async function serveStatic(request, response, pathname) {
  const requestedPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(ROOT, requestedPath));
  if (!filePath.startsWith(ROOT)) {
    sendText(response, 403, "Forbidden");
    return;
  }

  const ext = path.extname(filePath);
  const contentTypes = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8"
  };

  try {
    const file = await readFile(filePath);
    response.writeHead(200, {
      "content-type": contentTypes[ext] || "application/octet-stream",
      "cache-control": "no-store"
    });
    response.end(file);
  } catch {
    sendText(response, 404, "Not found");
  }
}

const server = http.createServer(async (request, response) => {
  const url = new URL(request.url, `http://${request.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/")) {
    await handleApi(request, response, url.pathname);
    return;
  }

  await serveStatic(request, response, url.pathname);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Stock Lens running at http://127.0.0.1:${PORT}`);
});
