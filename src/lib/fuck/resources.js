module.exports.Bundle = (profile) => {
  const p = require(`../../../profile/${profile}`);
  return {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: []
    // entry: [bundleOrganization(p)],
  };
};