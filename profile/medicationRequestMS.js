module.exports.profile = {
    name: 'medicationRequestMS',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
    // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
    // action: 'upload',
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
            return `medreq-${data}`
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
    },
    {
        source: 'medicationCodeableConcept',
        target: 'MedicationRequest.medicationCodeableConcept',
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
    },
    {
        source: 'dispenseRequest',
        target: 'MedicationRequest.dispenseRequest',
        // beforeConvert: (data) => {
        //     let dispenseRequest = data;
        //     dispenseRequest.validityPeriod = [dispenseRequest.validityPeriod];

        //     return dispenseRequest;
        // }
    },
]