const Convert = require('../../../src').Convert;

module.exports = {
  friendlyName: 'Convert',

  description: 'Convert something.',

  extendedDescription: `\n    Pass \`config\` either as a string (config file name) or as the full config object.\n    Example body:\n    {\n      "data": [...],\n      "config": "example_config"\n    }\n    or\n    {\n      "data": [...],\n      "config": require('../../config/example_config')\n    }\n  `,

  inputs: {
    data: {
      description: 'Data to be converted.',
      type: 'json',
      required: true
    },
    config: {
      description: 'Configuration data or config name string',
      type: 'json',
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
