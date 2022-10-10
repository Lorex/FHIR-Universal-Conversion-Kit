module.exports.profile = {
    name: 'practitionerMS',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
    // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
    // action: 'upload',
}

module.exports.globalResource = {
    // Should be resource name
    Practitioner: {
    }
}

module.exports.fields = [
    {
        source: 'id',
        target: 'Practitioner.id',
        beforeConvert: (data) => {
            return `pra-${data}`
        }
    },
    {
        source: 'text',
        target: 'Practitioner.text',
        // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
    },
    {
        source: 'identifier',
        target: 'Practitioner.identifier',
        beforeConvert: (data) => {
            let identifier = data;
            identifier.coding = [identifier.coding];// 把coding按照FHIR Definition包成Array

            return identifier;
        }
    },
    {
        source: 'active',
        target: 'Practitioner.active',
    },
    {
        source: 'name',
        target: 'Practitioner.name',
        beforeConvert: (data) => {
            let name = data;
            name.given = [name.given];// 把name.given按照FHIR Definition包成Array

            return name;
        }
    },
    {
        source: 'telecom',
        target: 'Practitioner.telecom',
    },
    {
        source: 'address',
        target: 'Practitioner.address',
    },
    {
        source: 'gender',
        target: 'Practitioner.gender',
    },
    {
        source: 'birthDate',
        target: 'Practitioner.birthDate',
    },
    {
        source: 'photo',
        target: 'Practitioner.photo',
    },

]