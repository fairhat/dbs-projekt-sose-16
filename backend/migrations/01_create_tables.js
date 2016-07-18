'use strict'

const DB            = require('./../lib/database')
const fs            = require('fs')
const SQLQuery      = fs.readFileSync(__dirname + './../data/create_db.sql', 'utf8')

/**
 * @desc Führt Funktion zum erzeugen der Tabelle aus
 * @return undefined
 */
function createTables() {
    console.log('Tabellen werden erstellt...')
    return new Promise((resolve, reject) => {
        DB.query(SQLQuery, (err, result) => {
            if (err) {
                reject(err)
            } else {
                resolve('Tabellen in der Datenbank erstellt.')
                console.log('Tabellen in der Datenbank erstellt')
            }
        })
    })
}

/**
 * @desc main funktion für migration
 */
function main() {
    return createTables().catch((e) => {
        console.log(`Fehler beim Erstellen der Tabellen... \nMögliche Ursachen: \n1. Datenbank existiert nicht.\n2. Keine Verbindung zur Datenbank möglich.\n3. Tabellen existieren bereits`)
        console.log('Stacktrace:')
        console.error(e)
        throw e;
    })
}

module.exports = main
module.exports.cmd = 'tbl'
module.exports.description = `Erstellt die Tabellen
(Hunde, Zwinger, etc.)
in der Datenbank
Befehl: npm run migrations -- -n=tbl`
