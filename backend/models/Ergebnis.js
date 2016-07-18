'use strict'
const DBModel = require('./DBModel')
const Hund = require('./Hund')
const Rennen = require('./Rennen')

/**
 *
 * @desc Ergebnis Modell
 *
 *
 */
class Ergebnis extends DBModel {

  /**
   * @desc Public constructor
   */
  constructor({
    eid = '',
    distanz = 0,
    rang = 0,
    hund = null,
    rennen = null,
    punkte = 0,
    laeufe = 0
  } = {}) {
    super({ eid, distanz, rang, hund, rennen, punkte, laeufe })
  }

  /**
   * @desc einen hund zu einem ergebnis finden
   */
  getHund() {
    return Hund.findOneById(this.hund)
  }

  /**
   * @desc finde das rennen  zum ergebnis
   */
  getRennen() {
    return Rennen.findOneById(this.rennen)
  }

  static get tableName() {
    return 'ergebnisse'
  }

  static get idField() {
    return 'eid'
  }

  static get fields() {
    return [
      'eid',
      'distanz',
      'rang',
      'hund',
      'rennen',
      'punkte',
      'laeufe'
    ]
  }
}

module.exports = Ergebnis
