'use strict'
const DBModel = require('./DBModel')

class Rennen extends DBModel {

  constructor({
    rid = '',
    jahr = 0,
    ort = ''
  } = {}) {
    super({ rid, jahr, ort })
  }

  static get tableName() {
    return 'rennen'
  }

  static get idField() {
    return 'rid'
  }

  static get fields() {
    return [
      'rid',
      'jahr',
      'ort'
    ]
  }
}

module.exports = Rennen
