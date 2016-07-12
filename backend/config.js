/**
 * CONFIG Datei
 */
module.exports = {
  /**
   * Datenbank Konfiguration
   */
  database: {
      host: 'localhost',
      user: 'postgres',
      pass: 'myU4tN93',
      port: 5432,
      db:   'dograce',
  },
  /**
   * Backend Server Konfiguration
   */
  server: {
      port: 8000,
      host: 'localhost',
      routes: {
        cors: {
          origin: ['*']
        },
      }
  },
  /**
   * Frontend
   */
  frontend: {
    port: 80,
    host: '0.0.0.0',
  },
}
