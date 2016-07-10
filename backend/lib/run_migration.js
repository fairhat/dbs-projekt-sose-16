'use strict'

const args = require('args')
const migrations = require('../migrations/')

args
    .option('name', 'Name of the Migration (csv, ...)', 'csv')
    .command('run', 'Run Migrations', (name, sub, options) => {
        if (migrations[options.name]) {
            console.log(`Ok, running migration: ${options.name}`)
            const run = migrations[options.name]
            
            run()
                .then(() => {
                    console.log(`Finished migration: ${options.name} - bye...`)
                    process.exit()
                })
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
            const desc = migrations[mig].description || NO
            const splitted = desc.split('\n')
            console.log(`| ${mig} | ${(splitted).join('\n| ' + mig + ' | ')}`)
            console.log('---------------------------------------------')
        })
        process.exit()   
    })

const flags = args.parse(process.argv, { help: true, version: true })