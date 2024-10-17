const fs = require('fs');
const path = require('path');

const loadResource = (resourceName) => {
  const filePath = path.join(__dirname, 'resources', `${resourceName}.json`);
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  }
  return null;
};

module.exports.Organization = loadResource('organization');

module.exports.Bundle = (config) => {
  const c = require(`../config/${config}`);
  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: []
  };
};
