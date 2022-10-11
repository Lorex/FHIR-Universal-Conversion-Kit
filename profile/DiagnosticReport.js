module.exports.profile = {
    name: 'DiagnosticReport',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
}

module.exports.globalResource = {
    DiagnosticReport: {
    },
}

module.exports.fields = [
    {
        source: 'id',
        target: 'DiagnosticReport.id',
    },
    {
        source: 'identifier',
        target: 'DiagnosticReport.identifier',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'status',
        target: 'DiagnosticReport.status',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'category',
        target: 'DiagnosticReport.category',
        beforeConvert: (data) => {
            let category = data
            return category
        },
    },
    {
        source: 'code',
        target: 'DiagnosticReport.code',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'subject',
        target: 'DiagnosticReport.subject',
        beforeConvert: (data) => {
            let subject = data
            return subject
        },
    },
    {
        source: 'encounter',
        target: 'DiagnosticReport.encounter',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'effectiveDateTime',
        target: 'DiagnosticReport.effectiveDateTime',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'issued',
        target: 'DiagnosticReport.issued',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'performer',
        target: 'DiagnosticReport.performer',
        beforeConvert: (data) => {
            let performer = data
            return performer
        },
    },
    {
        source: 'resultsInterpreter',
        target: 'DiagnosticReport.resultsInterpreter',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'specimen',
        target: 'DiagnosticReport.specimen',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'result',
        target: 'DiagnosticReport.result',
        beforeConvert: (data) => {
            return data;
        }

    },
    {
        source: 'imagingStudy',
        target: 'DiagnosticReport.imagingStudy',
        beforeConvert: (data) => {
            let imagingStudy = data
            return imagingStudy
        },
    },
    {
        source: 'media',
        target: 'DiagnosticReport.media',
        beforeConvert: (data) => {
            let media = data
            return media
        },
    },
    {
        source: 'conclusion',
        target: 'DiagnosticReport.conclusion',
        beforeConvert: (data) => {
            return data;
        }
    },
    {
        source: 'cconclusionCode',
        target: 'DiagnosticReport.conclusionCode',
        beforeConvert: (data) => {
            return data;
        }
    },
]