module.exports.profile = {
  name: 'procedureMS',
  version: '1.0.0',
  fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  action: 'upload', // return, upload
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  // action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Procedure: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Procedure.id',
    beforeConvert: (data) => {
      return `pro-${data}`
    }
  },
  {
    source: 'text',
    target: 'Procedure.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'status',
    target: 'Procedure.status',
  },
  {
    source: 'code',
    target: 'Procedure.code',
    beforeConvert: (data) => {
      let code = data;
      code.coding = [code.coding];// 把coding按照FHIR Definition包成Array

      return code;
    }
  },
  {
    source: 'subject',
    target: 'Procedure.subject',
  },
  {
    source: 'performedDateTime',
    target: 'Procedure.performedDateTime',
  },
  {
    source: 'asserter',
    target: 'Procedure.asserter',
  },
  {
    source: 'performer',
    target: 'Procedure.performer',
  },
  {
    source: 'bodySite',
    target: 'Procedure.bodySite',
    beforeConvert: (data) => {
      let bodySite = data;
      bodySite.coding = [bodySite.coding];

      return bodySite;
    }
  },

]