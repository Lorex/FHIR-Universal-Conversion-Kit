const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 讀取設定檔
const settingsPath = path.join(__dirname, '../settings.json');
const settingsContent = fs.readFileSync(settingsPath, 'utf8');
const settings = JSON.parse(settingsContent);

async function validateResource(resource, fhirVersion) {
  const server = settings.validator_server.find(s => s.version === fhirVersion);
  if (!server) {
    throw new Error(`找不到 FHIR 版本 ${fhirVersion} 的驗證伺服器`);
  }

  const validateUrl = `${server.url}/${resource.resourceType}/$validate`;

  try {
    const response = await axios.post(validateUrl, resource, {
      headers: {
        'Content-Type': 'application/fhir+json',
        'Accept': 'application/fhir+json'
      }
    });

    return parseValidationResult(response.data);
  } catch (error) {
    if (error.response) {
      return parseValidationResult(error.response.data);
    } else {
      throw new Error(`驗證請求失敗：${error.message}`);
    }
  }
}

function parseValidationResult(result) {
  if (result.resourceType !== 'OperationOutcome') {
    throw new Error('FHIR Resource 驗證失敗');
  }

  const issues = result.issue.map(issue => ({
    severity: issue.severity,
    code: issue.code,
    details: issue.details ? issue.details.text : '',
    location: issue.location ? issue.location.join(', ') : ''
  }));

  return {
    valid: !issues.some(issue => ['error', 'fatal'].includes(issue.severity)),
    issues: issues
  };
}

module.exports = {
  validateResource,
  parseValidationResult
};
