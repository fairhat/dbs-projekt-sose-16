# DBS Projekt Sommersemester 2016
Gruppe: Kai R., Jeannine D, Sebastian L, Ferhat T
Tutor: Ha

### Installation

1. NodeJS installieren (https://nodejs.org/en/) (Unter Windows nicht vergessen, in den PATH einzutragen (! npm und node))  
Checkt bitte die Installation nochmal mit ``$ node -v``
2. ``$ npm install`` zum installieren benötigter libraries (erfordert internetverbindung)
3. backend/config.example.js umbenennen in backend/config.js und die konfiguration anpassen!
4. ``$ npm start`` Dann startet unter localhost:8080 die API und localhost/ der static file server/load balancer
5. Entwicklungsumgebung starten: ``$ npm run dev``, erster Build kann etwas dauern.. localhost:8080/webpack-dev-server/ zum entwickeln!

* Code Docs unter dist/frontend-doc und dist/backend-doc
* Neues Frontend kann mit ``$ npm run build:frontend `` erstellt werden
* Verfügbare Befehle:

  ** ``$ npm start `` startet server/frontened
  ** ``$ npm run migrations -- -n=<csv|tbl>`` Migrations ausführen (csv oder tbl)
  ** ``$ npm run list:migrations`` migrations auflisten
  ** ``$ npm run help:migrations`` Hilfe zu migrations CLI
  ** ``$ npm run build:documentation`` Frontend dokumentation generieren
  ** ``$ npm run dev`` Dev Server starten

NOTE: Sollte ein fehler auftauchen beim starten.. "can't require xyz package not found", bitte einfach paket mit ``$ npm install <package-name> --save`` ausführen.
