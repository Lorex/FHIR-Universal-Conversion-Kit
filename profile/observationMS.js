module.exports.profile = {
  name: 'observationMS',
  version: '1.0.0',
  fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  action: 'return', // return, upload
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  // action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Observation: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Observation.id',
    beforeConvert: (data) => {
      return `obs-${data}`
    }
  },
  {
    source: 'text',
    target: 'Observation.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'status',
    target: 'Observation.status',
  },
  {
    source: 'category',
    target: 'Observation.category',
    beforeConvert: (data) => {
      let category = data;
      category.coding = [category.coding];

      return category;
    }
  },
  {
    source: 'code',
    target: 'Observation.code',
    beforeConvert: (data) => {
      let code = data;
      code.coding = [code.coding];

      return code;
    }
  },
  {
    source: 'subject',
    target: 'Observation.subject',
  },
  {
    source: 'effectiveDateTime',
    target: 'Observation.effectiveDateTime',
  },
  {
    source: 'performer',
    target: 'Observation.performer',
  },
  {
    source: 'valueQuantity',
    target: 'Observation.valueQuantity',
    beforeConvert: (data) => {
      let valueQuantity = data;
      valueQuantity.value = parseFloat(valueQuantity.value);

      return valueQuantity;
    }
  },
  {
    source: 'component',
    target: 'Observation.component',
  },
]