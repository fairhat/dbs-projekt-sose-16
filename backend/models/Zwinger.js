'use strict'
const DBModel = require('./DBModel')

class Zwinger extends DBModel {

  constructor({
    zid = '',
    name = 0
  } = {}) {
    super({ zid, name })
  }

  static get tableName() {
    return 'zwinger'
  }

  static get idField() {
    return 'zid'
  }

  static get fields() {
    return [
      'zid',
      'name',
    ]
  }
}

module.exports = Zwinger
