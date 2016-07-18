'use strict'

const tbl = require('./01_create_tables.js')
const csv = require('./02_import_csv.js')

/**
 * export migrations
 */
module.exports = {
    tbl,
    csv,
}

module.exports.ALL = [ tbl, csv ]
