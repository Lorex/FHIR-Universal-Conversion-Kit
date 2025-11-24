const { validateResource } = require('../../src/validator');
const assert = require('assert');
const axios = require('axios');

describe('Unit Test: Validator', function () {
    let originalPost;

    before(function () {
        originalPost = axios.post;
    });

    after(function () {
        axios.post = originalPost;
    });

    it('should return valid result when server returns no issues', async function () {
        axios.post = async () => ({
            data: {
                resourceType: 'OperationOutcome',
                issue: []
            }
        });

        const result = await validateResource({ resourceType: 'Patient' }, 'R4');
        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.issues.length, 0);
    });

    it('should return invalid result when server returns error issues', async function () {
        axios.post = async () => ({
            data: {
                resourceType: 'OperationOutcome',
                issue: [{ severity: 'error', code: 'invalid', diagnostics: 'Bad data' }]
            }
        });

        const result = await validateResource({ resourceType: 'Patient' }, 'R4');
        assert.strictEqual(result.valid, false);
        assert.strictEqual(result.issues.length, 1);
    });

    it('should throw error if server returns non-OperationOutcome', async function () {
        axios.post = async () => ({
            data: { resourceType: 'Patient' }
        });

        await assert.rejects(async () => {
            await validateResource({ resourceType: 'Patient' }, 'R4');
        }, /FHIR Resource 驗證失敗/);
    });
});
