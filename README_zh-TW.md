<p align="center">
  <img src="fuck-logo.png" alt="FHIR Universal Conversion Kit Logo" width="200" height="200">
</p>

# FHIR 通用轉換工具（Project F.U.C.K）

FHIR 通用轉換工具（F.U.C.K.）是一個超讚的工具 ~~（比工__院寫出來的那套垃圾強多了）~~ ，他可以將各種醫療資料轉換成 FHIR 格式，並支援上傳到 FHIR Server。

For English version, please refer to [README.md](README.md).

## 開發進度
- :white_check_mark: 核心轉換引擎
- :white_check_mark: 多重設定檔支援
- :white_check_mark: 資料前處理器
- :white_check_mark: FHIR 資料上傳器
- :white_check_mark: 詳細錯誤處理
- :arrow_right: FHIR Profile 驗證器（即將推出）

## 系統需求
- Node.js 20.18.0 或更新版本

## 安裝
1. 複製此儲存庫：
   ```bash
   git clone https://github.com/Lorex/FHIR-Universal-Conversion-Kit.git
   ```

2. 安裝相依套件：
   ```bash
   cd FHIR-Universal-Conversion-Kit
   npm install
   ```

## 使用方式

### 作為函式庫使用

您可以直接在 Node.js 應用程式中使用 F.U.C.K.：

```javascript
const { Convert } = require('path/to/fuck');

const config = '設定檔名稱';
const data = [/* 原始資料陣列 */];

async function convertData() {
  const convert = new Convert(config);
  const result = await convert.convert(data);
  console.log(result);
}

convertData();
```

### 作為 API 使用

要將 F.U.C.K. 部署為 API：

1. 啟動伺服器：
   ```bash
   npm start
   ```

2. 向 API 端點發送 POST 請求：
   ```
   POST http://your-server-url/api/convert
   ```

   使用以下 JSON 內容：
   ```json
   {
     "config": "設定檔名稱",
     "data": [/* 原始資料陣列 */]
   }
   ```

### 執行範例轉換
要使用範例腳本執行轉換：

```bash
node example/example_convert.js
```

## 設定檔
設定檔位於 `config` 資料夾中。每個設定檔定義：
- 資料來源格式
- 轉換規則
- 前處理和後處理 Hooks

要建立新設定，請在 `config` 資料夾中新增 `.js` 檔案。

## 轉換流程
轉換流程遵循以下工作流程：
1. 載入設定檔
2. 前處理資料（如果有定義）
3. 轉換個別欄位
4. 後處理資料（如果有定義）
5. 回傳或上傳生成的 FHIR Bundle

## 設定檔結構

以下是設定檔的範例：

```javascript
const uuid = require('uuid');

const organizationId = uuid.v4();

module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'upload', // 'upload' 或 'return'
}

module.exports.globalResource = {
    // 在此定義全域 FHIR Resource 模板
    // 你可以自定義 FHIR Resource Template，沒有定義的話，會使用 FHIR 預設的 Resource 模板
}

module.exports.fields = [
    // 在此定義欄位對應
    {
      source: '原始資料欄位名稱',
      target: '轉換後的 FHIR 欄位名稱，以 FHIR Path 表示',
      beforeConvert: (data) => {
        // 在轉換前對資料欄位進行處理
        return data;
      }
    }
]

module.exports.beforeProcess = (data) => {
    // 前處理邏輯
    return data;
}

module.exports.afterProcess = (bundle) => {
    // 後處理邏輯
    return bundle;
}
```

## 錯誤處理
本工具提供詳細的錯誤訊息，包括：
- 伺服器回應狀態
- 回應標頭
- 回應內容

如果轉換失敗，會回傳錯誤訊息，並提供錯誤碼，方便除錯。

## 貢獻
如果你有什麼新的想法，歡迎提交 Issue 或 Pull Request。
*不要抱怨為什麼沒人做，先承認你就是那個沒有人。*

## 授權條款

對於臺灣地區（中華民國境內）使用者：
本著作係採用創用 CC 姓名標示-非商業性-相同方式分享 3.0 臺灣 授權條款授權。

您可自由：
- 分享 — 以任何媒介或格式��製及散布本素材
- 修改 — 重混、轉換本素材、及依本素材建立新素材

惟需遵照下列條件：
- 姓名標示 — 您必須給予適當表彰、提供指向本授權條款的連結，以及指出（本作品的原始版本）是否已被變更。您可以任何合理方式為前述表彰，但不得以任何形式暗示授權人為您或您的使用方式背書。
- 非商業性 — 您不得將本素材進行商業目的之使用。
- 相同方式分享 — 若您重混、轉換本素材或依本素材建立新素材，您必須依本素材的授權條款來散布您的貢獻物。

詳細資訊請參考 [LICENSE](LICENSE) 文件。

© 2023 Lorex and Sitatech Information Services Co., Ltd. 版權所有。
