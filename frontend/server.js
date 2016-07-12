const Hapi = require('hapi')
const Inert = require('inert')
const Vision = require('vision')
const config = require('./../backend/config')
const HapiProxy = require('h2o2')

const server = new Hapi.Server()

server.connection(config.frontend)

server.register([Vision, Inert, HapiProxy], function(err) {

    if (err) {
        console.error('Failed loading plugins: Frontend')
        process.exit(1)
    }

    server.route([
      {
        method: 'GET',
        path: '/',
        handler: (_, res) => res.file(__dirname + './../dist/index.html')
      },
      {
        method: 'GET',
        path: '/app.js',
        handler: (_, res) => res.file(__dirname + './../dist/app.js')
      },
      {
        method: '*',
        path: '/{path*}',
        handler: {
          proxy: {
            host: config.server.host,
            port: config.server.port,
            protocol: 'http',
            passThrough: true,
          }
      }
    }])
    console.log('Starte Frontend Server...')
    server.start(function () {
        console.log('Frontend Server running at:', server.info.uri)
    })
})
