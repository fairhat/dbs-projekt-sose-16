'use strict'
const Query = require('./Query')

class DBModel {

  constructor(props = {}) {
    Object.keys(props).forEach((prop) => this[prop] = props[prop])
  }

  static get tableName() {
    console.warn(`NO TABLENAME SET FOR ${this.constructor.name}`)
    return ''
  }

  static get idField() {
    console.warn(`NO IDFIELD SET FOR ${this.constructor.name}`)
    return ''
  }

  static findOneById(id = 0) {
    return this.findOne(this.idField, `= ${id}`)
  }

  static getAll() {
    return this.find()
  }

  static findOne(
    fieldName = '',
    condition = '',
    fields = '*',
    sortBy = {}
    ) {
    if (condition.length > 0) {
      return (new Query())
        .select(fields)
        .from(this.tableName)
        .where(`${fieldName} ${condition}`)
        .limit(1)
        .orderBy(sortBy)
        .done()
        .then(([first, ...rest]) => first)
    } else {
      return Promise.resolve(null)
    }
  }

  static find(
    fieldName = '',
    condition = '',
    fields = '*',
    sortBy = {},
    { page, itemsPerPage } = {}
    ) {
      return (new Query())
        .select(fields)
        .from(this.tableName)
        .where(`${fieldName} ${condition}`)
        .orderBy(sortBy)
        .paginate(page, itemsPerPage)
        .done()
  }

  static query(queryString) {
    return Query.q(queryString)
  }

  toString() {
    return JSON.stringify(this)
  }
}

module.exports = DBModel
