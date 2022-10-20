module.exports.profile = {
  name: 'encounterMS',
  version: '1.0.0',
  fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
  action: 'return', // return, upload
  // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
  // action: 'upload',
}

module.exports.globalResource = {
  // Should be resource name
  Encounter: {
  }
}

module.exports.fields = [
  {
    source: 'id',
    target: 'Encounter.id',
    beforeConvert: (data) => {
      return `enc-${data}`
    }
  },
  {
    source: 'text',
    target: 'Encounter.text',
    // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
  },
  {
    source: 'identifier',
    target: 'Encounter.identifier',
  },
  {
    source: 'status',
    target: 'Encounter.status',
  },
  {
    source: 'class',
    target: 'Encounter.class',
  },
  {
    source: 'serviceType',
    target: 'Encounter.serviceType',
    beforeConvert: (data) => {
      let serviceType = data;
      serviceType.coding = [serviceType.coding];

      return serviceType;
    }
  },
  {
    source: 'priority',
    target: 'Encounter.priority',
    beforeConvert: (data) => {
      let priority = data;
      priority.coding = [priority.coding];

      return priority;
    }
  },
  {
    source: 'subject',
    target: 'Encounter.subject'
  },
  {
    source: 'participant',
    target: 'Encounter.participant',
    beforeConvert: (data) => {
      let participant = data;
      participant.type.coding = [participant.type.coding];
      participant.type = [participant.type];

      return participant;
    }
  },
  {
    source: 'period',
    target: 'Encounter.period'
  },
  {
    source: 'reasonCode',
    target: 'Encounter.reasonCode',
    beforeConvert: (data) => {
      let reasonCode = data;
      reasonCode.coding = [reasonCode.coding];

      return reasonCode;
    }
  },
  {
    source: 'hospitalization',
    target: 'Encounter.hospitalization',
    beforeConvert: (data) => {
      let hospitalization = data;
      hospitalization.dischargeDisposition.coding = [hospitalization.dischargeDisposition.coding];

      return hospitalization;
    }
  },
  {
    source: 'location',
    target: 'Encounter.location'
  },
  {
    source: 'serviceProvider',
    target: 'Encounter.serviceProvider'
  },
]