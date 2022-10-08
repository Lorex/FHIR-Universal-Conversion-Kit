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
        target: 'Condition.clinicalStatus',
        beforeConvert: (data) => {
            let clinicalStatus = data;
            clinicalStatus.coding = [clinicalStatus.coding];// 把coding按照FHIR Definition包成Array

            return clinicalStatus;
            // 直接以Object方式回傳 不用`${}`才不會被當成字串OAO而出現\"
        }
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
        source: 'onsetDateTime',
        target: 'Condition.onsetDateTime'
    },
    {
        source: 'abatementDateTime',
        target: 'Condition.abatementDateTime'
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