'use strict'
const Query = require('./Query')

/**
 * @desc DBModel Base Class
 */
class DBModel {

  constructor(props = {}) {
    Object.keys(props).forEach((prop) => this[prop] = props[prop])
  }

  /**
   *
   * @desc get table name, muss von kindern überschrieben werden
   * @static
   **/
  static get tableName() {
    console.warn(`NO TABLENAME SET FOR ${this.constructor.name}`)
    return ''
  }

  /**
  *
  * @desc get id field - muss überschrieben werden
  * @static
  *
  */
  static get idField() {
    console.warn(`NO IDFIELD SET FOR ${this.constructor.name}`)
    return ''
  }

  /**
   * @desc finde ein modell über die id
   */
  static findOneById(id = 0) {
    return this.findOne(this.idField, `= ${id}`)
  }

  /**
   *
   * @desc finde alle instanzen eines modells
   *
   */
  static getAll() {
    return this.find()
  }

  /**
   *
   * @desc findet eine instanz mit verschiedenen bedingungen
   * @param {String} fieldName
   * @param {String} condition
   * @param {String|Array} fields
   * @param {Object} sortBy
   */
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

  /**
   *
   * @desc finde mehrere instanzen mit den bedingungen
   * @param {String} fieldName
   * @param {String} condition
   * @param {String|Array} fields
   * @param {Object} sortBy
   */
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

  /**
   * @desc führe RAW SQL Query auf Modell aus
   * @param {String} queryString
   */
  static query(queryString) {
    return Query.q(queryString)
  }

  toString() {
    return JSON.stringify(this)
  }
}

module.exports = DBModel
