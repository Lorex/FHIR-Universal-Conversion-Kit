module.exports.profile = {
  name: 'location',
  version: '1.0.0',
  // fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  // action: 'return', // return, upload
  
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  fhirServerBaseUrl: 'https://mitwfhir.dicom.org.tw/fhir',
  action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Location: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Location.id',
    beforeConvert: (data) => {
      return `loc-${data}`
    }
  },
  {
    source: 'identifier',
    target: 'Location.identifier',
    beforeConvert: (data) => {
      let identifier = data;
      identifier.type.coding = [identifier.type.coding];
      // 把coding按照FHIR Definition包成Array

      return identifier;
    }
  },
  {
    source: 'status',
    target: 'Location.status',
    // beforeConvert: (data) => {
    //   // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
    //   let booleanValue = (data.toString().toLowerCase() === "true");

    //   return booleanValue;
    // }
  },
  {
    source: 'name',
    target: 'Location.name'
  },
  {
    source: 'type',
    target: 'Location.type',
    beforeConvert: (data) => {
      let type = data;
      type.coding = [type.coding];
      // 把coding按照FHIR Definition包成Array

      return type;
    }
  },
  {
    source: 'telecom',
    target: 'Location.telecom'
  },
  {
    source: 'address',
    target: 'Location.address'
  }
]