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
    },
    {
        source: 'code',
        target: 'Observation.code',
    },
    {
        source: 'subject',
        target: 'Observation.subject',
    },
    // {
    //     source: 'effective',
    //     target: 'Observation.effective',
    // },
    {
        source: 'performer',
        target: 'Observation.performer',
    },
    // {
    //     source: 'value',
    //     target: 'Observation.value',
    // },
    {
        source: 'component',
        target: 'Observation.component',
    },
]