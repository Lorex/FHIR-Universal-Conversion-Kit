<p align="center">
  <img src="fuck-logo.png" alt="FHIR Universal Conversion Kit Logo" width="200" height="271">
</p>

# FHIR 通用轉換工具（Project F.U.C.K）

FHIR 通用轉換工具（F.U.C.K.）是一個超讚的工具 ~~（至少比某些法人拿大把經費寫出來的垃圾還好用）~~ ，他可以將各種醫療資料轉換成 FHIR 格式，並支援上傳到 FHIR Server。

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
- :arrow_right: 多資料來源支援
- :arrow_right: TW Core IG 內建支援

## 準備與安裝
### 系統需求
- Node.js 20.18.0 或更新版本

### 安裝
1. 複製此儲存庫：
   ```bash
   git clone https://github.com/Lorex/FHIR-Universal-Conversion-Kit.git
   ```

2. 安裝相依套件：
   ```bash
   cd FHIR-Universal-Conversion-Kit
   npm install
   ```

## 如何使用 F.U.C.K.？

### 作為函式庫使用

您可以直接在 Node.js 應用程式中使用 F.U.C.K.：

```javascript
const { Convert, Validator } = require('path/to/fuck');

const config = '設定檔名稱';
const data = [/* 原始資料陣列 */];

async function convertAndValidateData() {
  const convert = new Convert(config);
  const result = await convert.convert(data);
  
  const validator = new Validator();
  const validationResult = await validator.validate(result);
  
  console.log(result);
  console.log(validationResult);
}

convertAndValidateData();
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
     "data": [/* 原始資料陣列 */],
     "validate": true  // 設為 true 如果你想驗證轉換後的資料
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

當 `validate` 設為 `true` 時，轉換過程會自動包含驗證步驟。如果驗證失敗，轉換結果中會包含驗證錯誤訊息。

### 2. 獨立呼叫使用

您也可以獨立使用驗證器，這允許您在需要時手動進行驗證：

```javascript
const { Validator } = require('path/to/fuck');

const validator = new Validator();
const validationResult = await validator.validate(fhirBundle);

if (validationResult.valid) {
  console.log('FHIR 資源有效');
} else {
  console.log('驗證錯誤:', validationResult.errors);
}
```

使用這種方式讓您可以在轉換過程外的任何時候進行驗證以提升靈活性。

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

詳細資訊請參考 [LICENSE](LICENSE) 文件。

© 2023 Lorex and Sitatech Information Services Co., Ltd. 版權所有。
