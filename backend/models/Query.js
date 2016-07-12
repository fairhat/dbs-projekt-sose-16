'use strict'
const DB = require('../lib/database')

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
   * @param {[string]|string} select - Select condition(s)
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
   * @example (new Query()).select().from('table').where('x NOT NULL')
   */
  where(condition = '') {
    if (condition.length > 1) {
      this.QUERY += `WHERE ${condition} `
    }

    return this
  }

  offset(size = 0) {
    this.QUERY += `OFFSET ${size}`

    return this
  }

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

  limit(size = 50) {
    this.QUERY += `LIMIT ${size}`

    return this
  }

  paginate(page, itemsPerpage) {
    this.offset(page * itemsPerpage)
    this.limit(itemsPerpage)

    return this
  }

  print() {
    console.log(this.QUERY || 'Empty')
    return this
  }

  done(query = this.QUERY) {
    const qry = query + ';'
    console.log(qry)

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

  static q(queryString) {
    return (new Query()).done(queryString)
  }
}

module.exports = Query
