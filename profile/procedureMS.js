module.exports.profile = {
  name: 'procedureMS',
  version: '1.0.0',
  fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  action: 'return', // return, upload
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
    source: 'identifier',
    target: 'Procedure.identifier',
    beforeConvert: (data) => {
      let identifier = data;
      identifier.type.coding = [identifier.type.coding];// 把coding按照FHIR Definition包成Array

      return identifier;
    }
  },
  {
    source: 'active',
    target: 'Procedure.active',
    beforeConvert: (data) => {
      // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
      let booleanValue = (data.toString().toLowerCase() === "true");
      // https://www.w3schools.com/JSREF/jsref_tolowercase.asp

      return booleanValue;
    }
  },

]