'use strict'

const args = require('args')
const migrations = require('../migrations/')

function runAllMigrations(migs) {
    return migs.reduce(runMigration, Promise.resolve())
}

function runMigration(mig, next) {
    console.log(`MIGRATION START: ${mig.name}`)
    return new Promise((resolve, reject) => {
        mig()
            .then(() => {
                console.log(`MIGRATION END: ${mig.name}`)
                if (next) {
                    runMigration(next)
                }
                else {
                    resolve()
                }
            })
            .catch((e) => {
                reject(e)
            })
    })
}

args
    .option('name', 'Name of the Migration (csv, tbl) - -n=ALL to run all migrations sequentially', 'csv')
    .command('run', 'Run Migrations', (name, sub, options) => {
        if (migrations[options.name]) {
            if (options.name === 'ALL') {
                console.log(`Running ALL migrations:`)
                runAllMigrations(migrations.ALL, (mig) => {
                    runMigration(mig)
                })
            } else {
            console.log(`Ok, running migration: ${options.name}`)
            const run = migrations[options.name]
            run()
                .then(() => {
                    console.log(`Finished migration: ${options.name} - bye...`)
                    process.exit()
                })
            }
        } else {
            console.log(`Couldn't find migration: ${options.name}, are you sure this is the correct name?`)
            process.exit()
        }
    })
    .command('list', 'List Migrations', (name, sub, options) => {
        const NO = 'Keine Beschreibung vorhanden.'
        console.log('---------------------------------------------')
        console.log('|                MIGRATIONS                  ')
        console.log('---------------------------------------------')
        console.log('| name | description')
        console.log('---------------------------------------------')
        Object.keys(migrations).forEach((mig) => {
            if (mig !== 'ALL') {
                const desc = migrations[mig].description || NO
                const splitted = desc.split('\n')
                console.log(`| ${mig} | ${(splitted).join('\n| ' + mig + ' | ')}`)
                console.log('---------------------------------------------')
            }
        })
        process.exit()   
    })

const flags = args.parse(process.argv, { help: true, version: true })