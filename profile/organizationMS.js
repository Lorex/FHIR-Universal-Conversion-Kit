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
    },
    {
        source: 'text',
        target: 'Organization.text',
        beforeConvert: (data) => {
            return {
                // 忽略text紀載的內容，使用Narrative子項目來組合
            }
        }
    },
    {
        source: 'text.status',
        target: 'Organization.text',
        beforeConvert: (data) => {
            return {
                status: data // HL7 FHIR官方提供 generated | extensions | additional | empty
            }
        }
    },
    {
        source: 'text.div',
        target: 'Organization.text',
        beforeConvert: (data) => {
            return {
                div: data
            }
        }
    },
]