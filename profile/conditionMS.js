module.exports.profile = {
    name: 'conditionMS',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
    // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
    // action: 'upload',
}

module.exports.globalResource = {
    // Should be resource name
    Condition: {
        active: true,
    }
}

module.exports.fields = [
    {
        source: 'id',
        target: 'Condition.id',
        beforeConvert: (data) => {
            return `con-${data}`
        }
    },
    {
        source: 'text',
        target: 'Condition.text',
        // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
    },
    {
        source: 'clinicalStatus',
        target: 'Condition.clinicalStatus'
        // 嘗試額外寫js直接把identifier組成Object傳入
        // 若照上述方法，則無需使用beforeConvert來處理傳入的資料
    },
    {
        source: 'verificationStatus',
        target: 'Condition.verificationStatus'
    },
    {
        source: 'category',
        target: 'Condition.category'
    },
    {
        source: 'severity',
        target: 'Condition.severity'
    },
    {
        source: 'bodySite',
        target: 'Condition.bodySite'
    },
    {
        source: 'subject',
        target: 'Condition.subject'
    },
    {
        source: 'onset[x]',
        target: 'Condition.onset[x]'
    },
    {
        source: 'abatement[x]',
        target: 'Condition.abatement[x]'
    },
    {
        source: 'asserter',
        target: 'Condition.asserter'
    },
    {
        source: 'note',
        target: 'Condition.note'
    }
]