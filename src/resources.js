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

module.exports.Bundle = (configInput) => {
  // 保留原本邏輯：若傳入字串則嘗試載入設定檔
  // future use: we may leverage cfg data for bundle meta.
  let cfg = null;
  if (typeof configInput === 'string') {
    try {
      cfg = require(`../config/${configInput}`);
    } catch (e) {
      // 若無法載入，cfg 保持 null (部分使用情境不需要)
    }
  } else if (typeof configInput === 'object' && configInput !== null) {
    cfg = configInput;
  }

  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: []
  };
};
