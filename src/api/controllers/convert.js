

const src = [
  {
    'identifier': 'E123456789',
    'identifier2': 'E123456789',
    'name': 'Test',
    'wbc': 10
  },
  {
    'identifier': 'S10000000',
    'identifier2': 'S100000123',
    'name': 'WWW',
    'wbc': 10
  },
  {
    'identifier': 'S10000000',
    'identifier2': 'S100000123',
    'name': 'WWW',
    'wbc': 10
  }
];

module.exports = {


  friendlyName: 'Convert',


  description: 'Convert something.',


  inputs: {
    data: {
      description: 'The data to convert.',
      type: 'json',
      required: true
    },
    profile: {
      description: 'The profile to use.',
      type: 'string',
      required: true
    }
  },


  exits: sails.config.custom.exits,


  fn: async function (inputs, exits) {
    const fuck = require('../../lib/fuck');
    
    let res = [];

    for (let i = 0; i < inputs.data.length; i++) {
      let data = inputs.data[i];
      let profile = inputs.profile;
      const convert = new fuck.Convert(data, profile);
      const converted = await convert.convert(data);
      // console.log(converted)
      res.push(converted);
    }

    // All done.
    return exits.success(res);

  }


};
