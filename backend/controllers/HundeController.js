'use strict'
const Hund = require('../models/Hund')
const Boom = require('Boom')
const moment = require('moment')

class HundeController {

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
    const thisYear = parseInt(moment().format('YYYY'), 10)
    const maxAge = thisYear - parseInt(req.query.maxAge / 12, 10)
    Hund.getRandom(req.query.amount, maxAge)
        .then((dogs) => dogs.map(d => new Hund(d)))
        .then((dogs) => {
          if (dogs.length > 0) {
            res(dogs)
          } else {
            res(Boom.notFound('Keine Hunde gefunden.'))
          }
        }).catch(res)
  }

  static all(req, res) {
    const direction = req.query.direction === 1 ? 'ASC' : 'DESC'
    const { page, itemsPerPage, sortBy } = req.query
    Hund.find(undefined, undefined, undefined, { [sortBy]: direction }, { page, itemsPerPage })
      .then(res)
      .catch(res)
  }

  static avg(req, res) {
    const direction = req.query.direction === 1 ? 'ASC' : 'DESC'
    const { page, itemsPerPage } = req.query
    const offset = page * itemsPerPage
    const limit = itemsPerPage

    Hund.query(`SELECT AVG(ergebnisse.punkte)::int AS "average",
                  hunde.hid,
                  hunde.name
                FROM hunde
                FULL JOIN ergebnisse
                  ON ergebnisse.hund = hunde.hid
                GROUP BY hunde.hid, hunde.name
                ORDER BY average ${direction}
                OFFSET ${offset}
                LIMIT ${limit};`)
                .then(res)
                .catch(res)
  }

  static races(req, res) {
    const direction = req.query.direction === 1 ? 'ASC' : 'DESC'
    const { page, itemsPerPage } = req.query
    const offset = page * itemsPerPage
    const limit = itemsPerPage

    Hund.query(`SELECT MAX(ergebnisse.punkte/ergebnisse.laeufe) AS "best",
                  hunde.hid AS "hid",
                  hunde.name AS "name"
                FROM hunde
                FULL JOIN ergebnisse
                  ON ergebnisse.hund = hunde.hid
                GROUP BY hunde.hid, hunde.name
                ORDER BY best ${direction}
                OFFSET ${offset}
                LIMIT ${limit};`)
                .then(res)
                .catch(console.error)
  }

  static children(req, res) {
    const parent = req.query.gender === 'm' ? 'vater' : 'mutter'
    const { page, itemsPerPage } = req.query
    const offset = page * itemsPerPage
    const limit = itemsPerPage
    const direction = req.query.direction === 1 ? 'ASC' : 'DESC'
    const top = req.query.top

    Hund.query(`SELECT MAX(ergebnisse.punkte/ergebnisse.laeufe) AS "best",
                  parent.hid AS "parentId",
                  parent.name AS "parentName",
                  string_agg(child.name, ', ') AS "children"
              	FROM hunde AS parent
                FULL JOIN hunde AS child
                  ON parent.hid = child.${parent}
              	FULL JOIN ergebnisse
                  ON ergebnisse.hund = child.hid
              	FULL JOIN rennen
                  ON rennen.rid = ergebnisse.rennen
              	WHERE child.${parent} IS NOT NULL AND
                  ergebnisse.rang <= ${top}
            	  GROUP BY parent.name,
                  parent.hid
              	ORDER BY best ${direction}
                OFFSET ${offset}
                LIMIT ${limit};`)
                .then(res)
                .catch(res)
  }
}

module.exports = HundeController
