'use strict'

const DB            = require('./../lib/database')
const fs            = require('fs')
const moment        = require('moment')
const _             = require('lodash')
const ImportData    = require('./../models/importdata.js')
const ImportZwinger = ImportData.ImportZwinger
const CSV           = readCSV()
const DOGS          = createDogs(CSV)
const UNIQUEDOGS    = createUniqueDogs(DOGS)
const ZWINGER       = createImportZwinger(UNIQUEDOGS)
const RACES         = createRaces(DOGS)

function importDogs() {
    return new Promise((resolve, reject) => {
        let counter = 1
        const insertVars = UNIQUEDOGS.map((dog) => dog.transformToSQLInsert())

        const queryVars = insertVars.map((v, i) => `(${v.map(k => {
            const count = counter
            counter = counter + 1
            return `$${count}`
        }).join(',')})`).join(',')

        const QUERY = `
        INSERT INTO hunde
            (hid, name, geschlecht, geburtsjahr, geburtsland, aufenthaltsland)
        VALUES ${queryVars};
        `

        DB.query(QUERY, _.flatten(insertVars), (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve('Hunde importiert')
                console.log('Hunde importiert')
            }
        })
    })
}

function updateMomDad() {
    return new Promise((resolve, reject) => {
        const DogDad = UNIQUEDOGS.map(({ id, vaterID }) => `WHEN ${id} THEN ${vaterID}`).join('\n                    ')
        const DogMom = UNIQUEDOGS.map(({ id, mutterID }) => `WHEN ${id} THEN ${mutterID}`).join('\n                    ')

        const UpdateMomDad = `
            UPDATE hunde
            SET vater = CASE hid
                        ${DogDad}
                        ELSE null
                        END;
            UPDATE hunde
            SET mutter = CASE hid
                        ${DogMom}
                        ELSE null
                        END
        `
        // fs.writeFileSync('./momDad.sql', UpdateMomDad, 'utf8')

        DB.query(UpdateMomDad, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve('Eltern aktualisiert')
                console.log('Eltern aktualisiert')
            }
        })
    })
}

function insertZwinger() {
    return new Promise((resolve, reject) => {
        let counter = 1

        const zwingerInserts = ZWINGER.map(({ id, name }) => ([id, name]))
        const zwingerVars = zwingerInserts.map(() => {
            const id = counter
            counter = counter + 1
            const name = counter
            counter = counter + 1

            return `($${id}, $${name})`
        }).join(',')
        const QUERY = `
        INSERT INTO zwinger
            (zid, name)
        VALUES ${zwingerVars};
        `

        DB.query(QUERY, _.flatten(zwingerInserts), (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve('Zwinger importiert')
                console.log('Zwinger importiert')
            }
        })
    })
}

function updateHundeZwinger() {
    return new Promise((resolve, reject) => {
        const DogZwinger = UNIQUEDOGS.map(({ id, zwingerID }) => `WHEN ${id} THEN ${zwingerID}`).join('\n                    ')

        const UpdateZwinger = `
            UPDATE hunde
            SET zwinger = CASE hid
                        ${DogZwinger}
                        ELSE null
                        END;
        `
        // fs.writeFileSync('./momDad.sql', UpdateZwinger, 'utf8')

        DB.query(UpdateZwinger, (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve('Hunde -> Zwinger aktualisiert')
                console.log('Hunde -> Zwinger aktualisiert')
            }
        })
    })
}

function insertResults() {
    return new Promise((resolve, reject) => {
        let counter = 1

        const inserts = DOGS.map((({
            id,
            avgDistance,
            name,
            rang,
            sumPoints,
            raceCountry,
            raceYear,
            runCount,
        }) => {
            const dog = UNIQUEDOGS.find(d => d.name === name)
            const race = RACES.find(({ year, country }) => year === raceYear && country === raceCountry)
            return [
                id,
                avgDistance,
                rang,
                (dog ? dog.id : null),
                (race ? race.id : null),
                sumPoints,
                runCount
            ]
        }))

        const vars = inserts.map((x) => {
            // ES6 Magic, Array Comprehension -> [Array from 1 to length of x]
            const vars = x.map((y) => {
                const count = counter
                counter += 1
                return '$' + count
            })
            return `(${vars.join(', ')})`
        }).join(',')

        const QUERY = `
        INSERT INTO ergebnisse
            (eid, distanz, rang, hund, rennen, punkte, laeufe)
        VALUES ${vars}
        `

        DB.query(QUERY, _.flatten(inserts), (err) => {
            if (err) reject(err)
            else {
                resolve('Ergebnisse importiert')
                console.log('Ergebnisse importiert')
            }
        })
    })
}

function insertRaces() {
    return new Promise((resolve, reject) => {
        let counter = 1

        const raceInserts = RACES.map((({ id, year, country }) => ([id, year, country])))

        const raceVars = raceInserts.map((z) => {
            const id = counter
            counter = counter + 1
            const year = counter
            counter = counter + 1
            const country = counter
            counter = counter + 1

            return `($${id}, $${year}, $${country})`
        }).join(',')

        const QUERY = `
        INSERT INTO rennen
            (rid, jahr, ort)
        VALUES ${raceVars};
        `

        DB.query(QUERY, _.flatten(raceInserts), (err) => {
            if (err) {
                reject(err)
            }
            else {
                resolve('Rennen importiert')
                console.log('Rennen importiert')
            }
        })
    })
}

function dropTables () {
    return new Promise((resolve, reject) => {
        DB.query(`
            DELETE FROM ergebnisse;
            DELETE FROM hunde;
            DELETE FROM zwinger;
            DELETE FROM rennen;
        `, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve('Tabellen geleert')
                console.log('Tabellen geleert')
            }
        })
    })
}

function fillInitialDogData() {
    console.log('Bereite CSV Datei für import vor')
    UNIQUEDOGS.forEach((dog) => {
        UNIQUEDOGS.forEach(({id, name}) => {
            // finde vater und mutter eines hundes
            if (name === dog.mutter) {
                dog.mutterID = id
                return;
            }

            if (name === dog.vater) {
                dog.vaterID = id
                return;
            }
        })

        const myZwinger = ZWINGER.find(zw => zw.name === dog.zwinger)
        dog.zwingerID = myZwinger ? myZwinger.id : null
    })

    return Promise.resolve()
}

function main(args) {
    return fillInitialDogData()
        .then(dropTables)
        .then(importDogs)
        .then(updateMomDad)
        .then(insertZwinger)
        .then(updateHundeZwinger)
        .then(insertRaces)
        .then(insertResults)
        .then(() => console.log('Fertig! Alle Daten wurden von der CSV importiert.'))
        .catch((err) => console.error(err))
}

function readCSV() {
    return fs.readFileSync(__dirname + './../data/greyhounddata.csv', 'utf8')
             .split('\n')
             .map(x => x.split(';'))
}

function createDogs(csvfile) {
    return CSV.map((row, index) => new ImportData(index + 1, row))
}

function createUniqueDogs(dogs) {
    return _.uniqBy(dogs, 'name')
}

function createImportZwinger(uniqDogs) {
    return _.uniqBy(uniqDogs, 'zwinger')
            .map((z) => z.zwinger)
            .filter((z) => z && z.length > 0)
            .map((name, id) => new ImportZwinger({ name, id: id + 1 }))
}

function createRaces(dogs) {
    return (_.uniqBy(dogs, 'raceYearCountry')).map(({ raceYear, raceCountry }, index) => ({ year: raceYear, country: raceCountry, id: index + 1 }))
}

module.exports = main
module.exports.cmd = 'csv'
module.exports.description = `Liest die greyhounddata.csv
ein und importiert die Daten
in das relationale Datenbankschema
Befehl: npm run migrations -- -n=csv`