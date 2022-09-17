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
                status: data.status // HL7 FHIR官方提供 generated | extensions | additional | empty
            }
        }
    },
    {
        source: 'text',
        target: 'Organization.text',
        beforeConvert: (data) => {
            return {
                div: data.div
            }
        }
    },
    {
        source: 'identifier',
        target: 'Organization.identifier'
        // 嘗試額外寫js直接把identifier組成Object傳入
        // 若照上述方法，則無需使用beforeConvert來處理傳入的資料
    },
    {
        source: 'active',
        target: 'Organization.active'
    },
    {
        source: 'type',
        target: 'Organization.type'
    },
    {
        source: 'name',
        target: 'Organization.name'
    },
    {
        source: 'telecom',
        target: 'Organization.telecom'
    },
    {
        source: 'address',
        target: 'Organization.address'
    }
]