module.exports.Organization = {
  resourceType: 'Organization',
  id: 'org-vghtc',
  active: true,
  type: [{
    coding: [{
      system: 'http://terminology.hl7.org/CodeSystem/organization-type',
      code: 'prov',
      display: 'Healthcare Provider',
      version: '4.0.1'
    }],
    text: '公立醫院'
  }],
  name: '臺中榮民總醫院',
  alias: ['臺中榮總', '台中榮總', '中榮', 'vghtc', 'tcvgh'],
  telecom: [{
    system: 'phone',
    value: '(04)2359-2525',
    use: 'work'
  }],
  address: [{
    use: 'work',
    type: 'both',
    text: '臺中市西屯區臺灣大道四段1650號',
    line: ['台灣大道四段1650號'],
    city: '臺中市',
    district: '西屯區',
    postalCode: '40705',
    country: 'TW'
  }]
};

const bundleOrganization = (profile) => {
  return {
    fullUrl: `${profile.profile.fhirServerBaseUrl}/Organization/org-vghtc`,
    resource: module.exports.Organization,
    request: {
      method: 'PUT',
      url: '/Organization/org-vghtc'
    }
  };
};

module.exports.Bundle = (profile) => {
  const p = require(`../../../profile/${profile}`);
  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: []
    // entry: [bundleOrganization(p)],
  };
};
