'use strict'

const Hapi = require('hapi')
const Inert = require('inert')
const Lout = require('lout')
const Vision = require('vision')
const Routes = require('./routes')
const Database = require('./lib/database')
const config = require('./config').server

const server = new Hapi.Server()

server.connection(config)

const loutRegister = {
    register: Lout,
    options: { endpoint: '/docs' }
}

server.register([Vision, Inert, loutRegister], function(err) {

    if (err) {
        console.error('Failed loading plugins')
        process.exit(1)
    }

    server.route(Routes)

    console.log('Starte Backend Server...')
    server.start(function () {
        console.log('Server running at:', server.info.uri)
    })
})
