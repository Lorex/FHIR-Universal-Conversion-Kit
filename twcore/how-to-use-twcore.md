# TWcore 10種FHIR Resources轉換使用手冊

## 支援的FHIR Resources清單
| **FHIR Resource Type** | **對應的F.U.C.K轉換Profile文件名稱** |
|------------------------|-------------------------------------------|
| Condition              | conditionMS.js                            |
| Encounter              | encounterMS.js                            |
| Location               | location.js                               |
| Medication             | medication-TWCore.js                      |
| MedicationRequest      | medicationRequestMS.js                    |
| Observation            | observationMS.js                          |
| Organization           | organizationMS.js                         |
| Patient                | patientMS.js                              |
| Practitioner           | practitionerMS.js                         |
| Procedure              | procedureMS.js                            |

## Excel範例格式使用說明

### 帶有範例資料的Excel文件
檔案位於`twcore`資料夾中的`excel-template-with10-sample-data`資料夾

### 僅有格式的Excel文件
檔案位於`twcore`資料夾中的`excel-template-empty`資料夾

**請注意!** `excel-template-empty` 資料夾中的Excel中，粗體標註的欄位為必填資料，**其餘欄位請留空，轉換程式才能正常運行**

### Excel文件使用教學
您可以先參閱[TWcore IG官網](https://twcore.mohw.gov.tw/ig/profiles-and-extensions.html)找到您要實作的FHIR Resource並查看Differential Table的定義

然後打開[帶有範例資料的Excel文件](#帶有範例資料的excel文件)中對應該FHIR Resource的excel查看我們依照TWcore IG製作的範例資料

最後您可以複製[僅有格式的Excel文件](#僅有格式的excel文件)中對應該FHIR Resource的excel，並根據TWcore IG官網中對該欄位的說明，填入您要產生的資料(空白的excel文件中粗體欄位為必填欄位，也就是範例資料中有填寫的欄位，其餘欄位請留空)

#### 將上述內容以Medication作為實作範例
1. 開啟`excel-template-empty/Medication.xlsx` 或是 `excel-template-with10-sample-data/Medication.xlsx` 注意觀察excel檔案內的標題列
![](https://i.imgur.com/OP9b630.png)

2. 前往[TWcore IG官網的FHIR Profiles及Extensions定義](https://twcore.mohw.gov.tw/ig/profiles-and-extensions.html)，接著找到[Medication](https://twcore.mohw.gov.tw/ig/StructureDefinition-Medication-twcore.html)
![](https://i.imgur.com/PU1NtBg.png)

3. 進入Medication的Differential Table頁籤
![](https://i.imgur.com/gHteOiw.png)

4. 仔細觀察此表格中的資料結構，以及參照後方的說明，在我們提供的範例excel中找到對應的欄位(僅提供必須支援的資料欄位，也就是下圖中有用 `紅色S` 標住起來的資料)
![](https://i.imgur.com/tE8maLK.png)

5. 您閱讀完TWcore IG官網提供的說明文件後應該對於資料對應有基礎的認知了，現在您可以實際修改excel檔案，將您手邊的資料填入excel中對應FHIR的欄位，例如:
    + 您的院所有一批 **衛署藥輸字第025XXX號** 的藥物，在`Medication.xlsx`中找到 **code.coding.code** 欄位，然後將該藥物的衛署藥輸字號填入
    + 假設您上方那筆資料的藥名為**阿立批挫**，同樣於TWcore IG官網確認過藥名資料的對應欄位後，將藥名資料分別填入，**code.coding.display** 以及	**code.text** 這兩個欄位中
    
    + **十分建議您根據您實作的FHIR Resource去參照TWcore IG官網提供的範例JSON，各Resource均可以從下圖所示的地方找到範例**
    ![](https://i.imgur.com/qUH0KzY.png)
    進入範例文件後點選`JSON`頁籤
    ![](https://i.imgur.com/r98OvWX.png)
6. **重要!** 我們所提供的Excel格式文件，就是依照對應Resource的JSON結構所展開，若您對JSON格式有一定程度的理解，就能發現`text.div`對應到JSON結構的text object，其餘欄位亦是如此，這也進一步的**解釋了為何excel中部分欄位必須留空**，您可以發現text欄位是text.div的父結構，為了讓我們所提供的`csv2json`轉換程式能夠正常運作，故有此設計
7. 現在您可以將您編輯完的excel文件**另存新檔**為.csv檔案，然後參考[主文件](../README.md)中的[How to convert csv to payload json](../README.md#how-to-convert-csv-to-payload-json)來轉換CSV為可以送入F.U.C.K的合法資料格式!

---

## F.U.C.K Profile使用範例

### 請先確保您已經將F.U.C.K系統環境搭建好並啟動再往下看範例

👍 您可以參閱並實際操作

[FHIR Universal Conversion Kit (F.U.C.K.) 主文件](../README.md#installation--usage-overview)的**第1~3點**

### 以Medication作為範例
#### 1.請先確定您的Medication csv檔案已經轉換為可以送入F.U.C.K的Payload JSON
請參閱主文件的 [👉這裡](../README.md#how-to-convert-csv-to-payload-json)，查看如何將您從excel轉存的csv檔案，轉換成可以送入F.U.C.K的合法Payload JSON

#### 2.找到對應的F.U.C.K profile名稱並修改您的目標FHIR主機
![](https://i.imgur.com/2IEp2bK.png)

您可以於 `profile` 資料夾中找到對應名稱的F.U.C.K轉換profile

❗請注意❗ 檔案名稱`medicationMS.js`未必是您於RESTful Client工具 POST資料時所使用的Profile Name，請點開文件查看如上圖中選取的 `name: 'medicationMS'`

**以此範例而言，[medicationMS](#)就是您POST資料時所應填寫的Profile Name**

![](https://i.imgur.com/tKd1Dk4.png)

F.U.C.K profile內的`fhirServerBaseUrl` 與 `action` 分別為**FHIR Resource上傳的目標伺服器網址** 與 **轉換後的動作**，您可依據實際情況修改這兩項的設定

+ 💁建議更改`fhirServerBaseUrl`的上傳網址為 您的目標FHIR Server URL，或是**國內公開的FHIR測試伺服器** https://hapi.fhir.tw/fhir

+ 如果您不想直接上傳至FHIR Server，可將`action` 的設定值改為 **return**，會將FHIR Resource的轉換結果回傳至您的RESTful Client

❗❗❗**請注意** 😮 若您有修改任何profile內的參數

**請務必重新啟動F.U.C.K! 更新後的設定才會生效**

#### 3.Legal POST Payload for Medication

```json
{
  "profile": "medicationMS", //這裡的profile就是前面提到的Profile Name
  "data": //將您透過csv轉換出來的JSON完整於此處貼上(須包含最外層的[]中括號)
}
```

您現在可以透過RESTful Client工具，如:[Postman](https://www.postman.com/downloads/)，將以上的Payload Data透過工具

POST到您架設於Local 的 F.U.C.K server (預設位置為 http://localhost:1337)

詳細API用法，請參閱[主文件的此處](../README.md#api)

### 以Organization做為範例
#### 1.請先確定您的Organization csv檔案已經轉換為可以送入F.U.C.K的Payload JSON
請參閱主文件的 [👉這裡](../README.md#how-to-convert-csv-to-payload-json)，查看如何將您從excel轉存的csv檔案，轉換成可以送入F.U.C.K的合法Payload JSON

#### 2.找到對應的F.U.C.K profile名稱並修改您的目標FHIR主機
![](https://i.imgur.com/dSM6kMK.png)

您可以於 `profile` 資料夾中找到對應名稱的F.U.C.K轉換profile

❗請注意❗ 檔案名稱`organizationMS.js`未必是您於RESTful Client工具 POST資料時所使用的Profile Name，請點開文件查看如上圖中選取的 `name: 'organizationMS'`

**以此範例而言，[organizationMS](#)就是您POST資料時所應填寫的Profile Name**

![](https://i.imgur.com/fEhfhLW.png)

F.U.C.K profile內的`fhirServerBaseUrl` 與 `action` 分別為**FHIR Resource上傳的目標伺服器網址** 與 **轉換後的動作**，您可依據實際情況修改這兩項的設定

+ 💁建議更改`fhirServerBaseUrl`的上傳網址為 您的目標FHIR Server URL，或是**國內公開的FHIR測試伺服器** https://hapi.fhir.tw/fhir

+ 如果您不想直接上傳至FHIR Server，可將`action` 的設定值改為 **return**，會將FHIR Resource的轉換結果回傳至您的RESTful Client

❗❗❗**請注意** 😮 若您有修改任何profile內的參數

**請務必重新啟動F.U.C.K! 更新後的設定才會生效**

#### 3.Legal POST Payload for Organization

```json
{
  "profile": "organizationMS", //這裡的profile就是前面提到的Profile Name
  "data": //將您透過csv轉換出來的JSON完整於此處貼上(須包含最外層的[]中括號)
}
```

您現在可以透過RESTful Client工具，如:[Postman](https://www.postman.com/downloads/)，將以上的Payload Data透過工具

POST到您架設於Local 的 F.U.C.K server (預設位置為 http://localhost:1337)

詳細API用法，請參閱[主文件的此處](../README.md#api)