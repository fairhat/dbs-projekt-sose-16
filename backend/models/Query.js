'use strict'
const DB = require('../lib/database')

/**
 * @name Query
 * @desc Query Builder Klasse
 * @version 0.0.1
 */
class Query {

  constructor(props) {
    this.QUERY = ''

    this.paginateActive = false
    this.page = 0
    this.itemsPerPage = 50
  }

  /**
   *
   * Verwandelt JSON Condition Objekt in
   * SQL Select statements
   * @name select
   * @version 0.0.1
   * @example (new Query()).select('col1 col2 col3') oder (new Query()).select(['col1', 'col2'])
   * @param {Array|string} select - Select condition(s)
   */
  select(columns = ['*']) {
    // columns -> Array wenn nur String übergeben
    const _cols = Array.isArray(columns) ? columns : columns.split(' ')

    this.QUERY += `SELECT ${_cols.join(',') } `

    return this
  }

  /**
   *
   * @name from
   * @version 0.0.1
   * @param {String} table
   * @example (new Query()).select().from('table')
   */
  from(table = '') {
    if (table.length > 0) {
      this.QUERY += `FROM ${table} `
    }

    return this
  }

  /**
   *
   * @name where
   * @version 0.0.1
   * @param {String} condition
   * @example (new Query()).select().from('table').where('x NOT NULL')
   */
  where(condition = '') {
    if (condition.length > 1) {
      this.QUERY += `WHERE ${condition} `
    }

    return this
  }

  /**
   * @param {Number} size
   * @return {Query} this
   */
  offset(size = 0) {
    this.QUERY += `OFFSET ${size} `

    return this
  }

  /**
   * @desc order by query
   * @param {Object} fieldObject
   */
  orderBy(fieldObject = {}) {
    const fields = Object.keys(fieldObject)
    if (fields.length > 0) {
      const qry = fields.map((fieldName) => {
        const direction = fieldObject[fieldName]

        return `${fieldName} ${direction} `
      }).join(', ')
      this.QUERY += `ORDER BY ${qry}`
    }

    return this
  }

  /**
   * @desc limit query
   * @param {Number} limit
   */
  limit(size = 50) {
    this.QUERY += `LIMIT ${size}`

    return this
  }

  /**
   * @desc paginate query
   * @param {Number} page
   * @param {Number} itemsPerpage
   */
  paginate(page, itemsPerpage) {
    if (typeof page !== 'undefined' && itemsPerpage) {
      this.offset(page * itemsPerpage)
      this.limit(itemsPerpage)
    }

    return this
  }

  /**
   * @desc print sql query
   */
  print() {
    console.log(`DBQuery :: "${this.QUERY}"`)
    return this
  }

  /**
  * @desc raw query
  * @param {String} queryString
  */
  query(queryString) {
    this.QUERY += queryString

    return this
  }

  /**
   * @param {String} query
   */
  done(query = this.QUERY) {
    const qry = query + ';'

    this.print()

    return new Promise((resolve, reject) => {
      DB.query(qry, (err, rows) => {
        if (err) {
          reject(err)
        } else {
          if (this.paginateActive) {
            const result = { rows: rows.rows, paginated: true, page: this.page, itemsPerpage: this.itemsPerPage }
            resolve(result)
          }
          resolve(rows.rows)
        }
      })
    })
  }

  /**
   * @desc run and execute raw query
   * @param {String} queryString
   */
  static q(queryString) {
    return (new Query()).query(queryString).done()
  }
}

module.exports = Query
