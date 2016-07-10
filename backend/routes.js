const Joi = require('joi')
const DB = require('./lib/database')

module.exports = [
  {
    method: 'GET',
    path: '/example',
    config: {
      handler: (req, res) => {
        res(`Hello ${req.query.name}`)
      },
      validate: {
        query: {
          name: Joi.string()
        }
      },
    }
  },
];
