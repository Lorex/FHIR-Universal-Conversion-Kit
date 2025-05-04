const fs = require('fs');
const path = require('path');
const { Convert } = require('../src');
const config = require('../config/example_config'); // or 'example_config'

// Hardcoded test data
const testData = [
    {
        patientData: {
          patientId: "P001", 
        },
        lastName: "Zhang",
        firstName: "San",
        birthDate: "1980-01-01",
        gender: "male",
        bloodType: "A",
        abp_systolic: 120,
        abp_diastolic: 80,
        abp_number: 1,
        requester: 'R123456789',
        performer: 'F123999888',
        orderId: '1234567890',
    },
    // {
    //     patientId: "P002",
    //     lastName: "Li", 
    //     firstName: "Si",
    //     birthDate: "1990-05-15",
    //     gender: "female", 
    //     bloodType: "B",
    //     abp_systolic: 115,
    //     abp_diastolic: 75,
    //     abp_number: 2
    // },
    // {
    //     patientId: "P003",
    //     lastName: "Wang",
    //     firstName: "Wu", 
    //     birthDate: "1975-12-31",
    //     gender: "male",
    //     bloodType: "O",
    //     abp_systolic: 130,
    //     abp_diastolic: 85,
    //     abp_number: 3
    // }
];

// Convert data
async function convertData() {
  const convert = new Convert(config);
  const bundle = await convert.convert(testData);
  return bundle;
}

// Execute conversion and write results to file
convertData().then(result => {
  const outputPath = path.join(__dirname, 'conversion_results.json');
  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Conversion results have been written to: ${outputPath}`);
}).catch(error => {
  console.error('An error occurred during the conversion process:', error);
});
