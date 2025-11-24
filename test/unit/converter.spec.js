const { Convert } = require('../../src/index');
const assert = require('assert');
const path = require('path');
const axios = require('axios');

describe('Unit Test: Convert Class', function () {

    describe('Constructor', function () {
        it('should initialize with a valid config object', function () {
            const config = {
                config: { name: 'unit_test', fhir_version: 'R4' },
                globalResource: {},
                fields: []
            };
            const converter = new Convert(config);
            assert.ok(converter);
            assert.strictEqual(converter.useConfig, 'unit_test');
        });

        it('should throw error if config is missing', function () {
            assert.throws(() => new Convert(null), /Invalid config input/);
        });

        it('should throw error if config name string does not exist', function () {
            assert.throws(() => {
                new Convert('non_existent_config');
            }, /Config "non_existent_config" not found/);
        });
    });

    describe('convertSingle', function () {
        it('should convert a single item based on config', async function () {
            const config = {
                config: { name: 'single_test', fhir_version: 'R4' },
                globalResource: { 'TestRes': { resourceType: 'Basic' } },
                fields: [{ source: 'val', target: 'TestRes.code.text' }]
            };
            const converter = new Convert(config);

            // Access private method or use convert with single item array
            // Since convertSingle is async and used internally, we can test it via convert([item]) 
            // or if we want to test it directly we can call it.
            await converter.convertSingle({ val: 'test' });

            assert.strictEqual(converter.bundle.entry.length, 1);
            assert.strictEqual(converter.bundle.entry[0].resource.code.text, 'test');
        });
    });

    describe('Conversion Logic Boundaries', function () {
        const baseConfig = {
            config: { name: 'test_boundary', fhir_version: 'R4', action: 'return' },
            globalResource: { 'TestRes': { resourceType: 'Basic' } },
            fields: []
        };

        it('should handle empty input array', async function () {
            const converter = new Convert(baseConfig);
            const result = await converter.convert([]);
            assert.strictEqual(result.bundle.entry.length, 0);
        });

        it('should handle data missing mapped fields', async function () {
            const config = {
                ...baseConfig,
                fields: [{ source: 'missingField', target: 'TestRes.code.text' }]
            };
            const converter = new Convert(config);
            const result = await converter.convert([{ otherField: 'value' }]);
            assert.strictEqual(result.bundle.entry.length, 0);
        });

        it('should skip field if beforeConvert returns null', async function () {
            const config = {
                ...baseConfig,
                fields: [{
                    source: 'field',
                    target: 'TestRes.code.text',
                    beforeConvert: () => null
                }]
            };
            const converter = new Convert(config);
            const result = await converter.convert([{ field: 'value' }]);
            assert.strictEqual(result.bundle.entry.length, 0);
        });

        it('should support JSONPath source extraction', async function () {
            const config = {
                ...baseConfig,
                fields: [{ source: '$.nested.val', target: 'TestRes.code.text' }]
            };
            const converter = new Convert(config);
            const result = await converter.convert([{ nested: { val: 'found' } }]);
            assert.strictEqual(result.bundle.entry.length, 1);
            assert.strictEqual(result.bundle.entry[0].resource.code.text, 'found');
        });
    });

    describe('resolveInlineReferences', function () {
        it('should resolve internal references correctly', async function () {
            const config = {
                config: { name: 'ref_unit_test', fhir_version: 'R4' },
                globalResource: {
                    'Src': { resourceType: 'Basic' },
                    'Ref': { resourceType: 'Basic' }
                },
                fields: [
                    { source: 'id', target: 'Src.id' }, // This might be tricky as id is auto-generated usually
                    // Let's rely on the fact that Convert generates IDs
                    { source: 'val', target: 'Src.code.text' },
                    { source: 'val', target: 'Ref.subject.reference', beforeConvert: () => '#Src' }
                ]
            };
            const converter = new Convert(config);
            await converter.convert([{ val: 'data' }]);

            const refRes = converter.bundle.entry.find(e => e.resource.id === converter.resourceIdList['Ref']).resource;
            const srcId = converter.resourceIdList['Src'];

            assert.strictEqual(refRes.subject.reference, `Basic/${srcId}`);
        });
    });
    describe('Hooks', function () {
        it('should execute beforeProcess hook', async function () {
            const config = {
                config: { name: 'hook_test_pre', fhir_version: 'R4' },
                globalResource: { 'TestRes': { resourceType: 'Basic' } },
                fields: [{ source: 'val', target: 'TestRes.code.text' }],
                beforeProcess: (data) => {
                    data.val = 'modified';
                    return data;
                }
            };
            const converter = new Convert(config);
            await converter.convertSingle({ val: 'original' });

            assert.strictEqual(converter.bundle.entry[0].resource.code.text, 'modified');
        });

        it('should execute afterProcess hook', async function () {
            const config = {
                config: { name: 'hook_test_post', fhir_version: 'R4', action: 'return' },
                globalResource: {},
                fields: [],
                afterProcess: (bundle) => {
                    bundle.total = 999;
                    return bundle;
                }
            };
            const converter = new Convert(config);
            const result = await converter.convert([]);

            assert.strictEqual(result.bundle.total, 999);
        });
    });

    describe('Server Interaction (Mocked)', function () {
        let originalPost;
        let lastPostCall = null;

        before(function () {
            originalPost = axios.post;
            axios.post = async (url, data, config) => {
                lastPostCall = { url, data, config };
                return {
                    data: {
                        resourceType: 'Bundle',
                        type: 'transaction-response',
                        entry: []
                    }
                };
            };
        });

        after(function () {
            axios.post = originalPost;
        });

        beforeEach(function () {
            lastPostCall = null;
        });

        it('should attempt to upload to specified FHIR server', async function () {
            const config = {
                config: {
                    name: 'upload_test',
                    fhir_version: 'R4',
                    action: 'upload',
                    fhirServerBaseUrl: 'https://hapi.fhir.tw/fhir'
                },
                globalResource: { 'Pat': { resourceType: 'Patient' } },
                fields: [{ source: 'name', target: 'Pat.name[0].text' }]
            };

            const converter = new Convert(config);
            await converter.convert([{ name: 'Test Upload' }]);

            assert.ok(lastPostCall, 'axios.post should have been called');
            assert.strictEqual(lastPostCall.url, 'https://hapi.fhir.tw/fhir');
            assert.strictEqual(lastPostCall.data.resourceType, 'Bundle');
        });
    });

    describe('End-to-End Workflow', function () {
        it('should correctly convert patient data using a custom config', async function () {
            // 1. Simulate Config Creation (GUI output)
            const mockConfig = {
                config: {
                    name: 'test_patient_config',
                    version: '1.0.0',
                    fhirServerBaseUrl: 'http://localhost:8080/fhir',
                    action: 'return',
                    fhir_version: 'R4'
                },
                globalResource: {
                    'PatientTemplate': {
                        resourceType: 'Patient',
                        active: true
                    }
                },
                fields: [
                    {
                        source: 'patientName',
                        target: 'PatientTemplate.name[0].text'
                    },
                    {
                        source: 'patientName',
                        target: 'PatientTemplate.name[0].family'
                    },
                    {
                        source: 'gender',
                        target: 'PatientTemplate.gender',
                        beforeConvert: (val) => {
                            // Simple map: M -> male, F -> female
                            const map = { 'M': 'male', 'F': 'female' };
                            return map[val] || 'unknown';
                        }
                    },
                    {
                        source: 'birthDate',
                        target: 'PatientTemplate.birthDate'
                    }
                ]
            };

            // 2. Simulate Data Input
            const inputData = [
                {
                    patientName: 'John Doe',
                    gender: 'M',
                    birthDate: '1980-01-01'
                },
                {
                    patientName: 'Jane Smith',
                    gender: 'F',
                    birthDate: '1990-05-20'
                }
            ];

            // 3. Execute Conversion
            const converter = new Convert(mockConfig);
            const result = await converter.convert(inputData);

            // 4. Verify Output

            // Check if result has a bundle
            assert.ok(result.bundle, 'Result should contain a bundle');
            assert.strictEqual(result.bundle.resourceType, 'Bundle', 'Root element should be a Bundle');
            assert.strictEqual(result.bundle.type, 'transaction', 'Bundle type should be transaction');

            // Check number of entries (should be 2 patients)
            assert.strictEqual(result.bundle.entry.length, 2, 'Should have 2 entries in the bundle');

            // Verify first patient
            const patient1 = result.bundle.entry[0].resource;
            assert.strictEqual(patient1.resourceType, 'Patient');
            assert.strictEqual(patient1.name[0].text, 'John Doe');
            assert.strictEqual(patient1.name[0].family, 'John Doe');
            assert.strictEqual(patient1.gender, 'male'); // M -> male
            assert.strictEqual(patient1.birthDate, '1980-01-01');

            // Verify second patient
            const patient2 = result.bundle.entry[1].resource;
            assert.strictEqual(patient2.resourceType, 'Patient');
            assert.strictEqual(patient2.name[0].text, 'Jane Smith');
            assert.strictEqual(patient2.gender, 'female'); // F -> female
        });
    });
});
