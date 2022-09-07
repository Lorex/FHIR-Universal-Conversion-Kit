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
    {
        source: 'identifier',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            let dataUse;
            console.log("正在轉換所有Identifier子資料");

            let dataUseObj = {
                source: 'identifier.use',
                target: 'Organization.identifier',
                beforeConvert: (data) => {
                    dataUse = data;
                }
            }

            console.log("data:" + data, "dataUse:" + dataUse);
            return {
                // 忽略identifier紀載的內容，使用Identifier子項目來組合
                value: data,
                use: dataUse
            }
        }
    },
    {
        source: 'identifier.use',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                use: data, //HL7 FHIR 提供以下選項usual | official | temp | secondary | old (If known)
            }
        }
    },
    {
        source: 'identifier.type',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                // 忽略identifier.type紀載的內容，使用CodeableConcept子項目來組合
            }
        }
    },
    {
        source: 'identifier.type.coding',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                type: {
                    coding: {
                        // 忽略identifier.type.coding紀載的內容，使用Coding子項目來組合
                    }
                }
            }
        }
    },
    {
        source: 'identifier.type.coding.system',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                type: {
                    coding: {
                        system: data
                    }
                }
            }
        }
    },
    {
        source: 'identifier.type.coding.code',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                type: {
                    coding: {
                        code: data
                    }
                }
            }
        }
    },
    {
        source: 'identifier.type.coding.display',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                type: {
                    coding: {
                        display: data
                    }
                }
            }
        }
    },
    {
        source: 'identifier.type.text',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                type: {
                    text: data
                }
            }
        }
    },
    {
        source: 'identifier.system',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                system: data
            }
        }
    },
    {
        source: 'identifier.value',
        target: 'Organization.identifier',
        beforeConvert: (data) => {
            return {
                value: data
            }
        }
    },
]