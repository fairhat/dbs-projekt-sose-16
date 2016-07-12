'use strict'
const Hund = require('../models/Hund')
const Boom = require('Boom')

class HundeController {

  static index(req, res) {
    return res()
  }

  static findOne(req, res) {
    Hund.findOneWithRelations(req.params.id)
        .then((result) => {
          if (result) {
            res(result)
          } else {
            res(Boom.notFound('Hund nicht gefunden.'))
          }
        })
        .catch((e) => res(e))
  }

  static randomDogs(req, res) {
    Hund.getRandom(req.query.amount)
        .then((dogs) => dogs.map(d => new Hund(d)))
        .then((dogs) => {
          if (dogs.length > 0) {
            res(dogs)
          } else {
            res(Boom.notFound('Keine Hunde gefunden.'))
          }
        }).catch((e) => {
          console.error(e)
          res(e)
        })
  }
}

module.exports = HundeController
