const fs = require('fs');
const path = require('path');
const { Convert } = require('../src');

// Hardcoded test data
const testData = [
    {
        patientId: "P001",
        lastName: "Zhang",
        firstName: "San",
        birthDate: "1980-01-01",
        gender: "male",
        bloodType: "A"
    },
    {
        patientId: "P002",
        lastName: "Li",
        firstName: "Si",
        birthDate: "1990-05-15",
        gender: "female",
        bloodType: "B"
    },
    {
        patientId: "P003",
        lastName: "Wang",
        firstName: "Wu",
        birthDate: "1975-12-31",
        gender: "male",
        bloodType: "O"
    }
];

// Convert data
async function convertData() {
  const convert = new Convert('example_config');
  return await convert.convert(testData);
}

// Execute conversion and write results to file
convertData().then(result => {
  const outputPath = path.join(__dirname, 'conversion_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Conversion results have been written to: ${outputPath}`);
}).catch(error => {
  console.error('An error occurred during the conversion process:', error);
});
