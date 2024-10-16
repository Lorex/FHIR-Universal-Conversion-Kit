const uuid = require('uuid');

const organizationId = uuid.v4();

module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'upload',
    fhir_version: 'R4',  // 新增此行，可以是 'R4', 'R4B', 或 'R5'
}

module.exports.globalResource = {
    Organization: {
        resourceType: 'Organization',
        id: organizationId,
        name: 'Kaohsiung Veterans General Hospital',
        alias: ['Kaohsiung Veterans General Hospital'],
        telecom: [
            {
                system: 'phone',
                value: '07-3422121',
                use: 'work'
            }
        ],
        address: [
            {
                use: 'work',
                type: 'both',
                text: 'No. 386, Dazhong 1st Rd, Zuoying District, Kaohsiung City',
                line: ['No. 386, Dazhong 1st Rd, Zuoying District, Kaohsiung City'],
                city: 'Kaohsiung City',
                district: 'Zuoying District',
                postalCode: '813'
            }
        ]
    },
    Patient: {
        managingOrganization: {
            reference: `Organization/${organizationId}`
        },
    },
    Observation: {
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
        }
    },
}

module.exports.fields = [
    {
        source: 'patientId',
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
        target: 'Observation.component',
        beforeConvert: (data) => {
            return {
                code: {
                    coding: [{
                        system: 'http://loinc.org',
                        code: '77176-0',
                        display: 'Blood Type'
                    }]
                },
                valueString: data
            }
        }
    }
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
            resource: module.exports.globalResource.Organization,
            request: {
                method: 'PUT',
                url: `Organization/${organizationId}`
            }
        });
    }
    
    return bundle;
}
