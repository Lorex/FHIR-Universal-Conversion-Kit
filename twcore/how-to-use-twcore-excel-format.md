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

## F.U.C.K Profile使用範例