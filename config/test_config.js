const uuid = require('uuid');

const organizationId = uuid.v4();

module.exports.config = {
    name: 'test_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir',
    action: 'return', // 為了測試，我們使用 'return' 而不是 'upload'
}

module.exports.globalResource = {
    Organization: {
        resourceType: 'Organization',
        id: organizationId,
        name: '測試醫院',
        alias: ['Test Hospital'],
        telecom: [
            {
                system: 'phone',
                value: '02-12345678',
                use: 'work'
            }
        ],
        address: [
            {
                use: 'work',
                type: 'both',
                text: '台北市測試區測試路123號',
                line: ['測試路123號'],
                city: '台北市',
                district: '測試區',
                postalCode: '123456'
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
                system: 'https://www.vghtc.gov.tw/',
                code: 'TEST-00001',
                display: '測試數據',
            }],
            text: '測試數據',
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
                        display: '血型'
                    }]
                },
                valueString: data
            }
        }
    }
]

// 全域資料預處理器
module.exports.beforeProcess = (data) => {
    // 組合姓名
    data.fullName = `${data.lastName} ${data.firstName}`;
    
    // 添加時間戳
    data.timestamp = new Date().toISOString();
    
    // 刪除原始的 lastName 和 firstName 欄位
    delete data.lastName;
    delete data.firstName;
    
    return data;
}

// 新增一個全域後處理器來添加 Organization 資源
module.exports.afterProcess = (bundle) => {
    // 檢查是否已經存在 Organization 資源
    const organizationEntry = bundle.entry.find(entry => entry.resource.resourceType === 'Organization');
    
    if (!organizationEntry) {
        // 如果不存在，則添加 Organization 資源
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
