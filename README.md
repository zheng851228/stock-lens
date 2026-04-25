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

零成本版資料來源順序：

1. `ALPHA_VANTAGE_API_KEY` 有設定時，優先使用 Alpha Vantage `GLOBAL_QUOTE` 與 `OVERVIEW`。
2. 台股 `.TW` 代碼固定優先使用 `TWSE MIS` 即時資訊。
3. 美股或其他代碼，若有 `FINNHUB_API_KEY`，優先使用 Finnhub 免費方案。
4. 若上述來源不可用，改用 Yahoo Finance quote endpoint。
5. Yahoo 不可用時，改用 Stooq 報價。
6. 若報價有了但基本面缺資料，且有 `FMP_API_KEY`，會用 FMP 免費方案補基本面。
7. 外部 API 都不可用時，回到示範資料，網頁仍可操作。

免費 API key 設定範例：

```bash
FINNHUB_API_KEY=你的_key node server.js
```

```bash
FMP_API_KEY=你的_key node server.js
```

```bash
ALPHA_VANTAGE_API_KEY=你的_key node server.js
```

三個一起設也可以：

```bash
FINNHUB_API_KEY=你的_finnhub_key FMP_API_KEY=你的_fmp_key ALPHA_VANTAGE_API_KEY=你的_alpha_key node server.js
```

目前「大戶買賣」與「類股資金流」仍是依報價、成交量與產業分類估算，不是真實法人或主力分點資料。零成本版主打的是先把可信的價格與可取得的基本面接好，再對缺資料欄位明確顯示 `N/A`。
