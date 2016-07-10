const fs = require('fs')
const pg = require('pg')
const { host, user, pass, port, db } = require('../config').database
const connectionString = `postgres://${user}:${pass}@${host}:${port}/${db}`

const client = new pg.Client(connectionString)
client.connect()
module.exports = client
