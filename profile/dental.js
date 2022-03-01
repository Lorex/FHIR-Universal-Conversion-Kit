module.exports.profile = {
    name: 'dental',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
}

module.exports.globalResource = {
    // Patient: {
    //     managingOrganization: {
    //         reference: '#Organization'
    //     },
    // },
    // Observation: {
    //     subject: {
    //         reference: '#Patient'
    //     },
    //     status: 'final',
    //     code: {
    //         coding: [{
    //             system: 'https://www.vghtc.gov.tw/',
    //             code: 'VGHTC-00001',
    //             display: 'IoT 量測數據',
    //         }],
    //         text: 'IoT 量測數據',
    //     }
    // },
}

module.exports.fields = [
    {
        source: 'doctor_id',
        target: 'Practitioner.id',
        beforeConvert: (data) => {
            return `prac-${data}`
        }
    // },
    // {
    //     source: 'identifier',
    //     target: 'Patient.identifier',
    //     beforeConvert: (data) => {
    //         return {
    //             use: 'official',
    //             system: 'https://www.vghtc.gov.tw/',
    //             value: data,
    //         }
    //     }
    // },
    // {
    //     source: 'name',
    //     target: 'Patient.name',
    //     beforeConvert: (data) => {
    //         return {
    //             use: 'official',
    //             text: data,
    //         }
    //     }
    // },
    // {
    //     source: 'identifier2',
    //     target: 'Patient.identifier',
    //     beforeConvert: (data) => {
    //         return {
    //             use: 'official',
    //             system: 'https://www.vghtc.gov.tw/',
    //             value: data,
    //         }
    //     }
    // },
    // {
    //     source: 'wbc',
    //     target: 'Observation.component',
    //     beforeConvert: (data) => {
    //         return {
    //             code: {
    //                 coding: [{
    //                     system: 'https://www.vghtc.gov.tw/',
    //                     code: 'WBC',
    //                     display: '白蛋白'
    //                 }]
    //             },
    //             valueQuantity: {
    //                 value: data,
    //                 unit: 'g/L',
    //                 system: 'http://unitsofmeasure.org',
    //                 code: 'g/L'
    //             }
    //         }
    //     }
    }
]