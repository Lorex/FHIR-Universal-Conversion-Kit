module.exports.profile = {
  name: 'patientMS',
  version: '1.0.0',
  // fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  // action: 'return', // return, upload
  
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  fhirServerBaseUrl: 'http://192.168.50.6:8082/fhir',
  action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Patient: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Patient.id',
    beforeConvert: (data) => {
      return `pat-${data}`
    }
  },
  {
    source: 'text',
    target: 'Patient.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'age',
    target: 'Patient.age',
  },
  {
    source: 'identifier',
    target: 'Patient.identifier',
    beforeConvert: (data) => {
      let identifier = data;
      identifier.type.coding = [identifier.type.coding];

      return identifier;
    }
  },
  {
    source: 'active',
    target: 'Patient.active',
    beforeConvert: (data) => {
      // https://stackoverflow.com/questions/263965/how-can-i-convert-a-string-to-boolean-in-javascript
      let booleanValue = (data.toString().toLowerCase() === "true");

      return booleanValue;
    }
  },
  {
    source: 'name',
    target: 'Patient.name',
    beforeConvert: (data) => {
      let name = data;
      name.given = [name.given];

      return name;
    }
  },
  {
    source: 'telecom',
    target: 'Patient.telecom',
  },
  {
    source: 'gender',
    target: 'Patient.gender',
  },
  {
    source: 'birthDate',
    target: 'Patient.birthDate',
  },
  {
    source: 'address',
    target: 'Patient.address',
  },
  {
    source: 'maritalStatus',
    target: 'Patient.maritalStatus',
    beforeConvert: (data) => {
      let maritalStatus = data;
      maritalStatus.coding = [maritalStatus.coding];

      return maritalStatus;
    }
  },
  {
    source: 'photo',
    target: 'Patient.photo',
  },
  {
    source: 'contact',
    target: 'Patient.contact',
    beforeConvert: (data) => {
      let contact = data;
      contact.relationship.coding = [contact.relationship.coding];

      contact.relationship = [contact.relationship];

      contact.name.given = [contact.name.given];

      contact.telecom = [contact.telecom];

      return contact;
    }
  },
  {
    source: 'communication',
    target: 'Patient.communication',
    beforeConvert: (data) => {
      let communication = data;
      communication.language.coding = [communication.language.coding];

      return communication;
    }
  },
  {
    source: 'managingOrganization',
    target: 'Patient.managingOrganization',
  }
]