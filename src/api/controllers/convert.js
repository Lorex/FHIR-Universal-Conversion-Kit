const Convert = require('../../lib/fuck').Convert;

module.exports = {
  friendlyName: 'Convert',

  description: 'Convert something.',

  inputs: {
    data: {
      description: '要轉換的數據。',
      type: 'json',
      required: true
    },
    config: {
      description: '要使用的配置文件。',
      type: 'string',
      required: true
    }
  },

  exits: sails.config.custom.exits,

  fn: async function (inputs, exits) {
    const Convert = require('../../lib/fuck').Convert;

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
