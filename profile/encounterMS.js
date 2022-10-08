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
        active: true,
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
    },
    {
        source: 'priority',
        target: 'Encounter.priority',
    },
    {
        source: 'subject',
        target: 'Encounter.subject'
    },
    {
        source: 'participant',
        target: 'Encounter.participant'
    },
    {
        source: 'period',
        target: 'Encounter.period'
    },
    {
        source: 'reasonCode',
        target: 'Encounter.reasonCode'
    },
    {
        source: 'hospitalization',
        target: 'Encounter.hospitalization'
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