const uuid = require('uuid');

const organizationId = uuid.v4();

module.exports.config = {
    name: 'example_config',
    version: '1.0.0',
    fhirServerBaseUrl: 'https://hapi.fhir.org/baseR4',
    action: 'upload',
}

module.exports.globalResource = {
    Organization: {
        resourceType: 'Organization',
        id: organizationId,
        name: '高雄榮民總醫院',
        alias: ['高雄榮民總醫院'],
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
                text: '高雄市左營區大中一路386號',
                line: ['高雄市左營區大中一路386號'],
                city: '高雄市',
                district: '左營區',
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
                code: '77176-0',  // 血型的 LOINC 代碼
                display: '血型',
            }],
            text: '血型測試',
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
