const http = require("node:http");
const { readFile } = require("node:fs/promises");
const path = require("node:path");
const { URL } = require("node:url");

const PORT = Number(process.env.PORT || 4173);
const ROOT = __dirname;

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

async function fetchYahooQuote(symbol) {
  const quoteUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbol)}`;
  const quoteJson = await fetchJson(quoteUrl);
  const quote = quoteJson?.quoteResponse?.result?.[0];
  if (!quote || !Number.isFinite(Number(quote.regularMarketPrice))) {
    throw new Error("Yahoo quote unavailable");
  }

  let summary = {};
  try {
    const modules = "assetProfile,financialData,defaultKeyStatistics";
    const summaryUrl = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(symbol)}?modules=${modules}`;
    const summaryJson = await fetchJson(summaryUrl);
    summary = summaryJson?.quoteSummary?.result?.[0] || {};
  } catch {
    summary = {};
  }

  return { quote, summary };
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
        dayHigh: numberOrFallback(quote.h, price),
        dayLow: numberOrFallback(quote.l, price),
        changePct: previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0,
        name: quote.nf || quote.n || symbol,
        source: "TWSE MIS API",
        quotedAt: quote.d && quote.t ? `${quote.d} ${quote.t}` : null
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
    currency: overview.Currency || base.currency,
    price,
    changePct: numberOrFallback(changePercent, base.changePct),
    dayLow: numberOrFallback(quote["04. low"], base.dayLow),
    dayHigh: numberOrFallback(quote["03. high"], base.dayHigh),
    revenueGrowth: sanitizeNumericField(revenueGrowthRaw * 100),
    grossMargin: sanitizeNumericField(grossMargin),
    pe: sanitizeNumericField(overview.PERatio),
    forwardPe: sanitizeNumericField(overview.ForwardPE),
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
      return {
        ...base,
        symbol,
        name: quote.name || base.name,
        currency: "TWD",
        price: quote.price,
        dayLow: quote.dayLow,
        dayHigh: quote.dayHigh,
        changePct: quote.changePct,
        revenueGrowth: null,
        grossMargin: null,
        pe: null,
        forwardPe: null,
        debtRatio: null,
        fetchedAt: new Date().toISOString(),
        live: true,
        source: quote.source,
        quoteDate: quote.quotedAt,
        fundamentalsSource: null,
        fundamentalsLive: false,
        warnings
      };
    } catch (error) {
      warnings.push(error.message);
    }
  }

  try {
    const { quote, summary } = await fetchYahooQuote(symbol);
    const financialData = summary.financialData || {};
    const keyStats = summary.defaultKeyStatistics || {};
    const profile = summary.assetProfile || {};
    const moneyFlow = enrichMoneyFlow(
      {
        ...base,
        changePct: numberOrFallback(quote.regularMarketChangePercent, base.changePct)
      },
      quote
    );
    const sector = profile.sector || base.sector;

    return {
      ...base,
      ...moneyFlow,
      symbol,
      name: quote.longName || quote.shortName || base.name,
      sector,
      currency: quote.currency || base.currency,
      price: numberOrFallback(quote.regularMarketPrice, base.price),
      changePct: numberOrFallback(quote.regularMarketChangePercent, base.changePct),
      dayLow: numberOrFallback(quote.regularMarketDayLow, base.dayLow),
      dayHigh: numberOrFallback(quote.regularMarketDayHigh, base.dayHigh),
      revenueGrowth: sanitizeNumericField(financialData.revenueGrowth?.raw * 100),
      grossMargin: sanitizeNumericField(financialData.grossMargins?.raw * 100),
      pe: sanitizeNumericField(quote.trailingPE),
      forwardPe: sanitizeNumericField(quote.forwardPE || keyStats.forwardPE?.raw),
      debtRatio: sanitizeNumericField(financialData.debtToEquity?.raw / 100),
      flow: sectorFlows[sector] || base.flow,
      fetchedAt: new Date().toISOString(),
      live: true,
      source: "Yahoo Finance API",
      fundamentalsSource: Object.keys(summary).length ? "Yahoo Finance Summary" : null,
      fundamentalsLive: Object.keys(summary).length > 0,
      warnings
    };
  } catch (error) {
    warnings.push(error.message);
  }

  try {
    const quote = await fetchStooqQuote(symbol);
    const changePct = quote.open > 0 ? ((quote.price - quote.open) / quote.open) * 100 : base.changePct;
    return {
      ...base,
      symbol,
      price: quote.price,
      dayLow: quote.dayLow,
      dayHigh: quote.dayHigh,
      changePct,
      revenueGrowth: null,
      grossMargin: null,
      pe: null,
      forwardPe: null,
      debtRatio: null,
      fetchedAt: new Date().toISOString(),
      live: true,
      source: quote.source,
      fundamentalsSource: null,
      fundamentalsLive: false,
      warnings
    };
  } catch (error) {
    warnings.push(error.message);
  }

  return {
    ...base,
    symbol,
    fetchedAt: new Date().toISOString(),
    live: false,
    source: "Demo fallback",
    fundamentalsSource: "Demo fallback",
    fundamentalsLive: false,
    warnings
  };
}

async function handleApi(request, response, pathname) {
  if (pathname === "/api/health") {
    sendJson(response, 200, { ok: true, time: new Date().toISOString() });
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
    const stock = await getStockData(symbol);
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
