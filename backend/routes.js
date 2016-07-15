const Joi = require('joi')

const HundeController = require('./controllers/HundeController')
const ZwingerController = require('./controllers/ZwingerController')
const moment = require('moment')

module.exports = [
  {
    method: 'GET',
    path: '/hund/random',
    config: {
      handler: HundeController.randomDogs,
      validate: {
        query: {
          amount: Joi.number().integer().min(1).max(25).required(),
          maxAge: Joi.number().integer().min(15).max(96).default(99999),
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
          id: Joi.number().integer().default(1)
        }
      }
    },
  },
  {
    method: 'GET',
    path: '/zwinger',
    config: {
      handler: ZwingerController.getTop,
      validate: {
        query: {
          amount: Joi.number().integer().min(1).max(50).required()
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hund/children',
    config: {
      handler: HundeController.children,
      validate: {
        query: {
          page: Joi.number().integer().min(0).default(0),
          direction: Joi.number().integer().min(-1).max(1).not(0).default(1),
          gender: Joi.string().default('m'),
          top: Joi.number().integer().min(1).max(50).default(25),
          itemsPerPage: Joi.number().integer().min(1).max(50).default(25),
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hund/races',
    config: {
      handler: HundeController.races,
      validate: {
        query: {
          page: Joi.number().integer().min(0).default(0),
          direction: Joi.number().integer().min(-1).max(1).not(0).default(1),
          itemsPerPage: Joi.number().integer().min(1).max(50).default(25),
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hund/average',
    config: {
      handler: HundeController.avg,
      validate: {
        query: {
          page: Joi.number().integer().min(0).default(0),
          direction: Joi.number().integer().min(-1).max(1).not(0).default(1),
          top: Joi.number().integer().min(1).max(50).default(25),
          itemsPerPage: Joi.number().integer().min(1).max(50).default(25),
        }
      }
    }
  },
  {
    method: 'GET',
    path: '/hund',
    config: {
      handler: HundeController.all,
      validate: {
        query: {
          sortBy: Joi.string().default('hid'),
          direction: Joi.number().integer().min(-1).max(1).not(0).default(1),
          page: Joi.number().integer().min(0).default(0),
          itemsPerPage: Joi.number().integer().min(1).max(50).default(25),
        }
      }
    }
  },
].map(route => {
  const PREFIX = '/v0'
  route.path = `${PREFIX}${route.path}`
  return route
})
