const uuid = require('uuid');
const organizationId = uuid.v4();

module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'return',
    fhir_version: 'R4',  // FHIR 版本，可以是 'R4', 'R4B', 或 'R5'
    validate: false // 設定是否啟用驗證
}

module.exports.globalResource = {
    Organization: {
        resourceType: 'Organization',
        name: 'Kaohsiung Veterans General Hospital',
        // other fields
    },
    ObservationABP: {
        resourceType: 'Observation',
        status: 'final',
        subject: {
            reference: '#Patient'
        },
        code: {
            coding: [{
                system: 'http://loinc.org',
                code: '96607-7',
            }],
            text: 'Average Blood Pressure',
        },
        component: [{
            code: {
                coding: [{
                    system: 'http://loinc.org',
                    code: '96608-5',
                }]
            },
            valueQuantity: {
                code: 'mm[Hg]',
                system: 'http://unitsofmeasure.org',
            }
        },
        {
            code: {
                coding: [{
                    system: 'http://loinc.org',
                    code: '96609-3',
                }]
            },
            valueQuantity: {
                code: 'mm[Hg]',
                system: 'http://unitsofmeasure.org',
            }
        },
        {
            code: {
                coding: [{
                    system: ' http://snomed.info/sct',
                    code: '246432004',
                }]
            },
        },
    ]
    },
    ObservationBloodType: {
        resourceType: 'Observation',
        subject: {
            reference: '#Patient'
        },
        status: 'final',
        code: {
            coding: [{
                system: 'http://loinc.org',
                code: '77176-0',  // LOINC code for blood type
                display: 'Blood Type',
            }],
            text: 'Blood Type Test',
        },
    },
    Patient: {
        managingOrganization: {
            reference: '#Organization'
        },
    },
    PractitionerRequester: {
        resourceType: 'Practitioner',
    },
    PractitionerPerformer: {
        resourceType: 'Practitioner',
    },
    ServiceRequest: {
        requester: {
            reference: '#PractitionerRequester'
        },
        performer: {
            reference: '#PractitionerPerformer'
        },
    },
}

module.exports.fields = [
    {
        source: 'patientData.patientId',
        target: 'Patient.id',
        beforeConvert: (data) => {
            return `patient-${data}`;
        }
    },
    {
        source: 'fullName',
        target: 'Patient.name',
        beforeConvert: (data) => {
            return {
                use: 'official',
                text: data,
                family: data.split(' ')[0],
                given: [data.split(' ')[1]]
            }
        }
    },
    {
        source: 'birthDate',
        target: 'Patient.birthDate',
    },
    {
        source: 'gender',
        target: 'Patient.gender',
    },
    {
        source: 'bloodType',
        target: 'ObservationBloodType.valueString',
    },
    {
        source: 'abp_systolic',
        target: 'ObservationABP.component[0].valueQuantity.value'
    },
    {
        source: 'abp_diastolic',
        target: 'ObservationABP.component[1].valueQuantity.value'
    },
    {
        source: 'abp_number',
        target: 'ObservationABP.component[2].valueQuantity.value'
    },
    {
        source: 'requester',
        target: 'PractitionerRequester.identifier[0].value'
    },
    {
        source: 'performer',
        target: 'PractitionerPerformer.identifier[0].value'
    },
    {
        source: 'orderId',
        target: 'ServiceRequest.identifier[0].value'
    },
]

// Global data pre-processor
module.exports.beforeProcess = (data) => {
    // Combine names
    data.fullName = `${data.lastName} ${data.firstName}`;
    
    // Add timestamp
    data.timestamp = new Date().toISOString();
    
    // Delete original lastName and firstName fields
    delete data.lastName;
    delete data.firstName;
    
    return data;
}

// Add a global post-processor to add Organization resource
module.exports.afterProcess = (bundle) => {
    // Check if Organization resource already exists
    const organizationEntry = bundle.entry.find(entry => entry.resource.resourceType === 'Organization');
    
    if (!organizationEntry) {
        // If not, add Organization resource
        bundle.entry.unshift({
            fullUrl: `${module.exports.config.fhirServerBaseUrl}/Organization/${organizationId}`,
            resource: { id: organizationId, ...module.exports.globalResource.Organization },
            request: {
                method: 'PUT',
                url: `Organization/${organizationId}`
            }
        });
    }
    
    return bundle;
}
