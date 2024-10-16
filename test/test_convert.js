const fs = require('fs');
const path = require('path');
const { Convert } = require('../src/lib/fuck');

// 讀取測試數據
const testData = [
    {
        patientId: "P001",
        lastName: "張",
        firstName: "三",
        birthDate: "1980-01-01",
        gender: "male",
        bloodType: "A"
    },
    {
        patientId: "P002",
        lastName: "李",
        firstName: "四",
        birthDate: "1990-05-15",
        gender: "female",
        bloodType: "B"
    },
    {
        patientId: "P003",
        lastName: "王",
        firstName: "五",
        birthDate: "1975-12-31",
        gender: "male",
        bloodType: "O"
    }
];

// 轉換數據
async function convertData() {
  const convert = new Convert('test_config');
  return await convert.convert(testData);
}

// 執行轉換並將結果寫入文件
convertData().then(result => {
  const outputPath = path.join(__dirname, 'conversion_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`轉換結果已寫入: ${outputPath}`);
}).catch(error => {
  console.error('轉換過程中發生錯誤:', error);
});
