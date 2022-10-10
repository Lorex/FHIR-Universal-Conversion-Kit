module.exports.profile = {
    name: 'patientMS',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // return, upload
    // fhirServerBaseUrl: 'http://140.131.93.149:8080/fhir',
    // action: 'upload',
}

module.exports.globalResource = {
    // Should be resource name
    Patient: {
    }
}

module.exports.fields = [
    {
        source: 'id',
        target: 'Patient.id',
        beforeConvert: (data) => {
            return `pat-${data}`
        }
    },
    {
        source: 'text',
        target: 'Patient.text',
        // text已經組合成Object，直接回傳即可，無須再透過beforeConvert:()來處理
    },
    {
        source: 'age',
        target: 'Patient.age',
    },
    {
        source: 'identifier',
        target: 'Patient.identifier',
    },
    {
        source: 'active',
        target: 'Patient.active',
    },
    {
        source: 'name',
        target: 'Patient.name',
    },
    {
        source: 'telecom',
        target: 'Patient.telecom',
    },
    {
        source: 'gender',
        target: 'Patient.gender',
    },
    {
        source: 'birthDate',
        target: 'Patient.birthDate',
    },
    {
        source: 'address',
        target: 'Patient.address',
    },
    {
        source: 'maritalStatus',
        target: 'Patient.maritalStatus',
    },
    {
        source: 'photo',
        target: 'Patient.photo',
    },
    {
        source: 'contact',
        target: 'Patient.contact',
    },
    {
        source: 'communication',
        target: 'Patient.communication',
    },
    {
        source: 'managingOrganization',
        target: 'Patient.managingOrganization',
    }
]