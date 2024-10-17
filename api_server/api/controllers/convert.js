const Convert = require('../../../src').Convert;

module.exports = {
  friendlyName: 'Convert',

  description: 'Convert something.',

  inputs: {
    data: {
      description: 'Data to be converted.',
      type: 'json',
      required: true
    },
    config: {
      description: 'Configuration file to be used.',
      type: 'string',
      required: true
    }
  },

  exits: sails.config.custom.exits,

  fn: async function (inputs, exits) {
    const Convert = require('../../../src').Convert;

    let res = [];

    for (const item of inputs.data) {
      const convert = new Convert(inputs.config);
      const converted = await convert.convert([item]);
      res.push(converted);
    }

    // 完成
    return exits.success(res);
  }
};
