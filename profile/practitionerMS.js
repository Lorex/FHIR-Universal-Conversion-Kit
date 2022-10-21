module.exports.profile = {
  name: 'practitionerMS',
  version: '1.0.0',
  fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  action: 'upload', // return, upload
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  // action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Practitioner: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Practitioner.id',
    beforeConvert: (data) => {
      return `pra-${data}`
    }
  },
  {
    source: 'text',
    target: 'Practitioner.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'identifier',
    target: 'Practitioner.identifier',
    beforeConvert: (data) => {
      let identifier = data;
      identifier.type.coding = [identifier.type.coding];// 把coding按照FHIR Definition包成Array

      return identifier;
    }
  },
  {
    source: 'active',
    target: 'Practitioner.active',
    beforeConvert: (data) => {
      // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
      let booleanValue = (data.toString().toLowerCase() === "true");
      // https://www.w3schools.com/JSREF/jsref_tolowercase.asp

      return booleanValue;
    }
  },
  {
    source: 'name',
    target: 'Practitioner.name',
    beforeConvert: (data) => {
      let name = data;
      name.given = [name.given];// 把name.given按照FHIR Definition包成Array

      return name;
    }
  },
  {
    source: 'telecom',
    target: 'Practitioner.telecom',
  },
  {
    source: 'address',
    target: 'Practitioner.address',
  },
  {
    source: 'gender',
    target: 'Practitioner.gender',
  },
  {
    source: 'birthDate',
    target: 'Practitioner.birthDate',
  },
  {
    source: 'photo',
    target: 'Practitioner.photo',
  },

]