const Joi = require('joi')

const HundeController = require('./controllers/HundeController')

module.exports = [
  {
    method: 'GET',
    path: '/hund/random',
    config: {
      handler: HundeController.randomDogs,
      validate: {
        query: {
          amount: Joi.number().integer().min(1).max(200).required()
        }
      }
    },
  },
  {
    method: 'GET',
    path: '/hund/{id}',
    config: {
      handler: HundeController.findOne,
      validate: {
        params: {
          id: Joi.number().integer()
        }
      }
    },
  }
].map(route => {
  route.path = `/v0${route.path}`
  return route
})
