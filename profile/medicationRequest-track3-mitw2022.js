module.exports.profile = {
  name: 'medicationRequest-track3-mitw2022',
  version: '1.0.0',
  // fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  // action: 'return', // return, upload
  
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  fhirServerBaseUrl: 'https://mitwfhir.dicom.org.tw/fhir',
  action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  MedicationRequest: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'MedicationRequest.id',
    beforeConvert: (data) => {
      return `track3-medreq-${data}`
    }
  },
  {
    source: 'text',
    target: 'MedicationRequest.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'identifier',
    target: 'MedicationRequest.identifier',
    beforeConvert: (data) => {
      identifier = data;
      identifier.type.coding = [identifier.type.coding];

      return identifier;
    }
  },
  {
    source: 'status',
    target: 'MedicationRequest.status',
  },
  {
    source: 'intent',
    target: 'MedicationRequest.intent',
  },
  {
    source: 'category',
    target: 'MedicationRequest.category',
    beforeConvert: (data) => {
      category = data;
      category.coding = [category.coding];

      return category;
    }
  },
  {
    source: 'medicationCodeableConcept',
    target: 'MedicationRequest.medicationCodeableConcept',
    beforeConvert: (data) => {
      medicationCodeableConcept = data;
      medicationCodeableConcept.coding = [medicationCodeableConcept.coding];

      return medicationCodeableConcept;
    }
  },
  {
    source: 'subject',
    target: 'MedicationRequest.subject',
  },
  {
    source: 'encounter',
    target: 'MedicationRequest.encounter',
  },
  {
    source: 'authoredOn',
    target: 'MedicationRequest.authoredOn',
  },
  {
    source: 'requester',
    target: 'MedicationRequest.requester',
  },
  {
    source: 'reasonReference',
    target: 'MedicationRequest.reasonReference',
  },
  {
    source: 'note',
    target: 'MedicationRequest.note',
  },
  {
    source: 'dosageInstruction',
    target: 'MedicationRequest.dosageInstruction',
    beforeConvert: (data) => {
      dosageInstruction = data;
      dosageInstruction.timing.code.coding = [dosageInstruction.timing.code.coding];

      dosageInstruction.route.coding = [dosageInstruction.route.coding];

      return dosageInstruction;
    }
  },
  {
    source: 'dispenseRequest',
    target: 'MedicationRequest.dispenseRequest',
    beforeConvert: (data) => {
        let dispenseRequest = data;
        dispenseRequest.numberOfRepeatsAllowed = parseInt(dispenseRequest.numberOfRepeatsAllowed);

        return dispenseRequest;
    }
  },
]