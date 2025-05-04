<p align="center">
  <img src="fuck-logo.png" alt="FHIR Universal Conversion Kit Logo" width="200" height="271">
</p>

# FHIR 通用轉換工具（Project F.U.C.K）

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com) [![npm version](https://badge.fury.io/js/@fhir-uck%2Ffhir-converter-core.svg)](https://badge.fury.io/js/@fhir-uck%2Ffhir-converter-core) [![HitCount](https://hits.dwyl.com/Lorex/FHIR-Universal-Conversion-Kit.svg?style=flat-square)](http://hits.dwyl.com/Lorex/FHIR-Universal-Conversion-Kit)

[![NPM](https://nodei.co/npm/@fhir-uck%2Ffhir-converter-core.png)](https://nodei.co/npm/@fhir-uck%2Ffhir-converter-core/)

FHIR 通用轉換工具（F.U.C.K.）是一個超讚的工具 ，他可以將各種醫療資料轉換成 FHIR 格式，並支援上傳到 FHIR Server。

## 聲明
本專案為民間基於業界需求自行開發之開源工具，與財團法人工業技術研究院（ITRI，下稱工研院）毫無關係，亦未獲工研院任何贊助或參與開發。

除工研院以外，歡迎各學術單位、開發者、醫療院所以及國北護連先生多加利用本工具，惟散佈、改作、引用本專案時，依授權條款應表彰原作者姓名（Lorex 個人或 Sitatech 公司皆可），並不得用於商業用途。各單位運用社群成果時，應尊重網路社群治理慣例並遵守授權條款。

本專案嚴格禁止工研院為任何形式之利用，拿了次世代 PMO 這麼多預算，加油點好嗎？

院所如在使用本工具時遇到任何問題，或是有 FHIR 導入、轉換 相關需求，歡迎與我們聯絡：

📧 Mail: ceo[at]sita.tech

## 簡介

### F.U.C.K. 是什麼？

F.U.C.K. 是一個用於將各種醫療資料轉換成 FHIR 格式，並支援上傳到 FHIR Server 的工具。傳統的醫療資料在不同系統間介接時，需要針對每種資料格式寫一個轉換程式，造成開發人員的負擔。而 F.U.C.K. 提供了一個 Low-Code 甚至是 No-Code 的解決方案，只需要寫一個設定檔就可以將各種資料轉換成 FHIR 格式。後續就可以使用 FHIR 格式來進行跨院或是跨系統資料交換。

For English version, please refer to [README.md](README.md).

### 為什麼叫做 F.U.C.K.？

F.U.C.K. 是 FHIR Universal Conversion Kit 的縮寫，所以中間的點記得不要省略。XD

### F.U.C.K. 有什麼特色？

- 支援多種 FHIR 版本：R4、R4B、R5，後續會持續增加，商用版可自訂 FHIR 版本。
- 資料驗證：轉換後的 FHIR 資源會進行自動驗證，確保資源符合 FHIR 規範。
- 支援前處理和後處理：您可以在轉換前後進行資料處理，例如：資料清理、正規化、加解密等。
- 自動上傳 FHIR Server：轉換後的 FHIR 資源可以自動上傳到 FHIR Server，例如：HAPI、Firely 等。
- 不用寫程式：F.U.C.K. 提供了一個友善的 GUI 介面，讓你不需要寫程式就可以建立設定檔。
- 拯救工程師的肝：寫醫資系統已經夠累了，別再讓這種鳥事來增加你的肝指數。

## 開發進度
- :white_check_mark: 核心轉換引擎
- :white_check_mark: 多重設定檔支援
- :white_check_mark: 資料前處理器
- :white_check_mark: FHIR 資料上傳器
- :white_check_mark: 詳細錯誤處理
- :white_check_mark: FHIR 資源驗證器
- :white_check_mark: GUI 介面
- :arrow_right: 多資料來源支援
- :arrow_right: TW Core IG 內建支援

## 準備與安裝
### 系統需求
- Node.js 20.18.0 或更新版本

### 安裝
使用 npm 安裝 F.U.C.K.：

```bash
npm install @fhir-uck/fhir-converter-core
```

## 如何使用 F.U.C.K.？

### 作為函式庫使用

您可以直接在 Node.js 應用程式中使用 F.U.C.K.，可傳入設定檔名稱（字串）或設定物件：

```javascript
const { Convert } = require('@fhir-uck/fhir-converter-core');

// 方法一：傳入設定檔名稱（字串）
const configName = '設定檔名稱';
const convert1 = new Convert(configName);

// 方法二：傳入設定物件
const configObject = require('./config/設定檔名稱');
const convert2 = new Convert(configObject);

const data = [/* 原始資料陣列 */];

async function convertData() {
  // 可選用 convert1 或 convert2
  const result = await convert1.convert(data);
  // 若 config 有啟用驗證，result 會包含 validationResults
  // 否則只會有 bundle 欄位
  console.log(result);
}

convertData();
```

### 作為 API 使用

要將 F.U.C.K. 部署為 API，您需要創建一個伺服器應用程式。以下是使用 Express 的基本範例：

1. 安裝 Express：
   ```bash
   npm install express
   ```

2. 創建一個伺服器檔案（例如 `server.js`）：
   ```javascript
   const express = require('express');
   const { Convert, Validator } = require('@fhir-uck/fhir-converter-core');

   const app = express();
   app.use(express.json());

   app.post('/api/convert', async (req, res) => {
     const { config, data, validate } = req.body;
     
     try {
       const convert = new Convert(config);
       const result = await convert.convert(data);
       
       if (validate) {
         const validator = new Validator();
         const validationResult = await validator.validate(result);
         res.json({ result, validationResult });
       } else {
         res.json({ result });
       }
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
   });

   const PORT = process.env.PORT || 3000;
   app.listen(PORT, () => console.log(`伺服器已於 Port ${PORT} 啟動`));
   ```

3. 啟動伺服器：
   ```bash
   node server.js
   ```

4. 向 API 端點發送 POST 請求：
   ```
   POST http://localhost:3000/api/convert
   ```

   使用以下 JSON 內容：
   ```json
   {
     "config": "設定檔名稱",
     "data": [/* 原始資料陣列 */],
     "validate": true  // 設為 true 如果你想驗證轉換後的資料
   }
   ```

### 執行範例轉換
要使用範例腳本執行轉換，創建一個新檔案（例如 `example_convert.js`）並輸入以下內容：

```javascript
const { Convert, Validator } = require('@fhir-uck/fhir-converter-core');

const config = 'example_config'; // 替換為您的設定檔名稱
const data = [/* 您的範例資料 */];

async function exampleConvert() {
  const convert = new Convert(config);
  const result = await convert.convert(data);
  
  const validator = new Validator();
  const validationResult = await validator.validate(result);
  
  console.log('轉換結果:', result);
  console.log('驗證結果:', validationResult);
}

exampleConvert();
```

然後執行腳本：

```bash
node example_convert.js
```

## 設定檔
設定檔位於 `config` 資料夾中。每個設定檔定義：
- 資料來源格式
- 轉換規則
- 前處理和後處理 Hooks
- 驗證規則

你可以直接建立 `.js` 檔案來新增設定檔，或是使用 GUI 產生器來建立設定檔。

### 轉換流程
轉換流程遵循以下工作流程：
1. 載入設定檔
2. 前處理資料（如果有定義）
3. 轉換個別欄位
4. 後處理資料（如果有定義）
5. 驗證生成的 FHIR Bundle（如果啟用）
6. 回傳或上傳生成的 FHIR Bundle

### 使用設定檔產生器

F.U.C.K. 提供了一個友善的 GUI 介面來建立和編輯設定檔。使用方法如下：

1. 在網頁瀏覽器中開啟 `config_builder/index.html` 檔案。
2. 使用介面進行設定，包括欄位對應、前處理器和後處理器等內容。
3. 點擊「下載設定檔」按鈕來儲存您的設定檔。
4. 將下載的設定檔放置在您的 F.U.C.K. 安裝目錄的 `config` 資料夾中。

### 設定檔結構

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

## FHIR 資源驗證器

F.U.C.K. 包含一個內建的 FHIR 資源驗證器，可用於驗證轉換後的 FHIR 資源是否符合 FHIR 規範。驗證器會檢查：

- 資源結構的正確性
- 必填欄位
- 資料類型一致性
- 值集合規範

驗證器有兩種運作模式：

### 1. 在設定檔中設定自動驗證

您可以在設定檔中啟用自動驗證功能。這樣每次轉換完成後都會自動進行驗證：

```javascript
module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'upload',
    validate: true  // 啟用自動驗證
}
```

當 `validate` 設為 `true` 時，轉換過程會自動包含驗證步驟。如果驗證失敗，轉換結果中會包含驗證錯誤訊息。若未啟用驗證，轉換結果只會有 bundle 欄位，不會出現 validationResults。

### 2. 獨立呼叫使用

您也可以獨立使用驗證器，這允許您在需要時手動進行驗證：

```javascript
const { Validator } = require('path/to/src');

const validator = new Validator();
const validationResult = await validator.validate(fhirBundle);

if (validationResult.valid) {
  console.log('FHIR 資源有效');
} else {
  console.log('驗證錯誤:', validationResult.errors);
}
```

> 注意：獨立呼叫驗證時，回傳的結果只包含驗證資訊（如 valid, errors），與轉換主流程回傳的 bundle 結構不同。主流程只有啟用驗證時才會有 validationResults 欄位，否則只會有 bundle。

## 錯誤處理
F.U.C.K. 提供詳細的錯誤訊息，包括：
- 伺服器回應狀態
- 回應內容
- 驗證錯誤內容

如果轉換失敗，會回傳錯誤訊息，並提供錯誤碼，方便除錯。

## 貢獻
如果你有什麼新的想法，歡迎提交 Issue 或 Pull Request。
*不要抱怨為什麼沒人做，先承認你就是那個沒有人。*

## 授權條款

對於臺灣地區（中華民國境內）使用者：
本著作係採用創用 CC 姓名標示-非商業性-相同方式分享 3.0 臺灣 授權條款授權。

您可自由：
- 分享 — 以任何媒介或格式重製及散布本素材
- 改編 — 重混、轉換本素材、及依本素材建立新素材

惟需遵照下列條件：
- 姓名標示 — 您必須給予適當表彰、提供指向本授權條款的連結，以及指出（本作品的原始版本）是否已被變更。您可以任何合理方式為前述表彰，但不得以任何方式暗示授權人為您或您的使用方式背書。
- 非商業性 — 您不得將本素材進行商業目的之使用。
- 相同方式分享 — 若您重混、轉換本素材或依本素材建立新素材，您必須依本素材的授權條款來散布您的貢獻物。

例外情況:
- 基於特定原因，本專案「絕對禁止」以下單位為任意形式之利用，包含但不限於：散佈、改作、引用等。且不適用於前揭創用 CC 授權條款之授權。
  - 財團法人工業技術研究院 (ITRI)
    - 原因：違反授權條款（違規日期 2025/03/12；網址 https://medstandard.mohw.gov.tw/fhir/tool；違反第 4 條第 (d) 項「標示原始著作人」之規定）
    - 生效日：2025/03/12
    
    *我們認為拿了次世代 PMO 將近 4 億預算，應該有點建樹造福業界，而不是自己沒實力還只會幹一些誤人子弟、與民爭利的事情，打著衛福部的旗號四處收割他人辛勤成果。*

詳細資訊請參考 [LICENSE](LICENSE) 文件。

© 2023 Lorex and Sitatech Information Services Co., Ltd. 版權所有。
