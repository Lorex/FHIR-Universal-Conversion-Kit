module.exports.profile = {
  name: 'organizationMS',
  version: '1.0.0',
  // fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  // action: 'return', // return, upload
  
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  fhirServerBaseUrl: 'http://192.168.50.6:8082/fhir',
  action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Organization: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Organization.id',
    beforeConvert: (data) => {
      return `org-${data}`
    }
  },
  {
    source: 'text',
    target: 'Organization.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理

    // text.status (data.status)中 HL7 FHIR官方提供 generated | extensions | additional | empty

  },
  {
    source: 'identifier',
    target: 'Organization.identifier',
    beforeConvert: (data) => {
      let identifier = data;
      identifier.type.coding = [identifier.type.coding];
      // 把coding按照FHIR Definition包成Array

      return identifier;
    }
  },
  {
    source: 'active',
    target: 'Organization.active',
    beforeConvert: (data) => {
      // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
      let booleanValue = (data.toString().toLowerCase() === "true");

      return booleanValue;
    }
  },
  {
    source: 'type',
    target: 'Organization.type',
    beforeConvert: (data) => {
      let type = data;
      type.coding = [type.coding];
      // 把coding按照FHIR Definition包成Array

      return type;
    }
  },
  {
    source: 'name',
    target: 'Organization.name'
  },
  {
    source: 'telecom',
    target: 'Organization.telecom'
  },
  {
    source: 'address',
    target: 'Organization.address'
  }
]