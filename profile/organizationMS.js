module.exports.profile = {
    name: 'organizationMS',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
}

module.exports.globalResource = {
    // Should be resource name
    Organization: {
        active: true,
    }
}

module.exports.fields = [
    {
        source: 'id',
        target: 'Organization.id',
        beforeConvert: (data) => {
            return `org-${data}`
        }
    }
]