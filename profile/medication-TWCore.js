module.exports.profile = {
  name: 'medication-TWCore',
  version: '1.0.0',
  // fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  // action: 'return', // return, upload

  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  fhirServerBaseUrl: 'http://192.168.50.6:8082/fhir',
  action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Medication: {
    meta: {
      profile: [
        "https://mitwfhir.dicom.org.tw/fhir/StructureDefinition/Medication-twcore"
      ]
    }
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Medication.id',
    beforeConvert: (data) => {
      return `twcore-verified-med-${data}`
    }
  },
  {
    source: 'text',
    target: 'Medication.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'code',
    target: 'Medication.code',
    beforeConvert: (data) => {
      let code = data;
      code.coding = [code.coding];// 把coding按照FHIR Definition包成Array

      return code;
    }
  },
  {
    source: 'form',
    target: 'Medication.form',
    beforeConvert: (data) => {
      let form = data;
      form.coding = [form.coding];

      return form;
    }
  },
]