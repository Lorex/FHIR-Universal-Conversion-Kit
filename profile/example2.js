module.exports.profile = {
    name: 'example2',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'upload', // return, upload
}

module.exports.globalResource = {
    Patient: {
        managingOrganization: {
            reference: '#Organization'
        },
    },
    Observation: {
        subject: {
            reference: '#Patient'
        },
        status: 'final',
        code: {
            coding: [{
                system: 'https://www.vghtc.gov.tw/',
                code: 'VGHTC-00002',
                display: 'IoT 量測數據',
            }],
            text: 'IoT 量測數據',
        }
    },
}

module.exports.fields = [
    {
        source: 'id',
        target: 'Patient.id',
    },
    {
        source: 'identifier',
        target: 'Patient.identifier',
        beforeConvert: (data) => {
            return {
                use: 'official',
                system: 'https://www.vghtc.gov.tw/',
                value: data,
            }
        }
    },
    {
        source: 'name',
        target: 'Patient.name',
        beforeConvert: (data) => {
            return {
                use: 'official',
                text: data,
            }
        }
    },
    {
        source: 'identifier2',
        target: 'Patient.identifier',
        beforeConvert: (data) => {
            return {
                use: 'official',
                system: 'https://www.vghtc.gov.tw/',
                value: data,
            }
        }
    },
    {
        source: 'rbc',
        target: 'Observation.component',
        beforeConvert: (data) => {
            return {
                code: {
                    coding: [{
                        system: 'https://www.vghtc.gov.tw/',
                        code: 'RBC',
                        display: '紅血球'
                    }]
                },
                valueQuantity: {
                    value: data,
                    unit: 'g/L',
                    system: 'http://unitsofmeasure.org',
                    code: 'g/L'
                }
            }
        }
    }
]