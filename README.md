# Stock Lens

AI 股票資金流分析網頁原型。

## 啟動

```bash
node server.js
```

如果你的電腦有 npm，也可以使用：

```bash
npm start
```

打開：

```text
http://127.0.0.1:4173
```

## 財經 API

後端 API：

```text
GET /api/stock/NVDA
GET /api/stock/2330.TW
```

資料來源順序：

1. `ALPHA_VANTAGE_API_KEY` 有設定時，優先使用 Alpha Vantage `GLOBAL_QUOTE` 與 `OVERVIEW`。
2. 台股 `.TW` 代碼會優先使用 TWSE MIS 即時資訊。
3. 若上述來源不可用，改用 Yahoo Finance quote endpoint。
4. Yahoo 不可用時，改用 Stooq 報價。
5. 外部 API 都不可用時，回到示範資料，網頁仍可操作。

設定 Alpha Vantage key：

```bash
ALPHA_VANTAGE_API_KEY=你的_key node server.js
```

目前「大戶買賣」與「類股資金流」是依報價、成交量與產業分類估算；正式版若要更精準，可以再串台股三大法人、券商分點、ETF 資金流、或付費即時逐筆資料。
