'use strict'
const DBModel = require('./DBModel')
const Ergebnis = require('./Ergebnis')
const Zwinger = require('./Zwinger')

class Hund extends DBModel {

  constructor({
    hid = '',
    name = '',
    geschlecht = 'm',
    geburtsjahr = 1970,
    geburtsland = 'UNKNOWN',
    aufenthaltsland = 'UNKNOWN',
    vater = null,
    mutter = null,
    zwinger = null,
    ergebnisse = [],
    rennen = []
  } = {}) {
    super({ hid, name, geschlecht, geburtsjahr, geburtsland, aufenthaltsland, vater, mutter, zwinger, ergebnisse, rennen })
  }

  getMutter() {
    if (this.mutter) {
      return Hund.findOneById(this.mutter)
    }
    return Promise.resolve(null)
  }

  getVater() {
    if (this.vater) {
      return Hund.findOneById(this.vater)
    }
    return Promise.resolve(null)
  }

  getErgebnisse() {
    if (this.ergebnisse.length === 0) {
      const fieldName = 'ergebnisse.hund'
      const condition = `= ${this.hid}`
      return Ergebnis.find(fieldName, condition)
    } else return Promise.resolve(this.ergebnisse) // Cached
  }

  getRennen() {
    return this
      .getErgebnisse()
      .then((ergebnisse) => Promise.all(ergebnisse.map(erg => (new Ergebnis(erg)).getRennen())))
  }

  getZwinger() {
    if (this.zwinger) {
      return Zwinger.findOneById(this.zwinger)
    }
    return Promise.resolve(null)
  }

  static findOneWithRelations(id) {
    return Hund
      .findOneById(id)
      .then((dog) => {
        if (dog) {
          const DogInstance = new Hund(dog)
          return DogInstance
            .getMutter()
            .then((mutter) => {
              DogInstance.mutter = mutter || null

              return DogInstance.getVater()
            })
            .then((vater = null) => {
              DogInstance.vater = vater || null

              return DogInstance.getErgebnisse()
            })
            .then((ergebnisse) => {
              DogInstance.ergebnisse = ergebnisse

              return DogInstance.getRennen()
            })
            .then((rennen) => {
              DogInstance.rennen = rennen

              return DogInstance
            })
          } else return null
        })
  }

  static getRandom(amount, maxAge) {
    return Hund.query(`SELECT * FROM ${this.tableName} WHERE geburtsjahr >= ${maxAge} ORDER BY RANDOM() LIMIT ${amount}`)
      .then((dogs) => {
        const DogInstances = dogs.map(d => new Hund(d))

        return Promise.all(DogInstances.map(d => d.getMutter()))
          .then((mothers) => {
            mothers.filter(m => m).forEach((mother) => {
              const Child = DogInstances.find(d => d.mutter == mother.hid)
              Child.mutter = mother
            })
            return Promise.all(DogInstances.map(d => d.getVater()))
          })
          .then((fathers) => {
            fathers.filter(f => f).forEach((father) => {
              const Child = DogInstances.find(d => d.vater == father.hid)
              Child.vater = father
            })

            return Promise.all(DogInstances.map(d => d.getZwinger()))
          })
          .then((zwingers) => {
            zwingers.filter(f => f).forEach((zwi) => {
              const Child = DogInstances.find(d => d.zwinger == zwi.zid)
              Child.zwinger = zwi
            })

            return Promise.all(DogInstances.map(d => d.getErgebnisse()))
          })
          .then((ergebnisse) => {
            ergebnisse.forEach((ergebnis) => {
              const Child = DogInstances.find(d => d.hid == ergebnis[0].hund)
              Child.ergebnisse = ergebnis
            })

            return Promise.all(DogInstances.map(d => d.getRennen()))
          })
          .then((rennen) => {
            rennen.forEach((run) => {
              const Child = DogInstances.find(d => d.ergebnisse.find(e => e.rennen == run[0].rid))
              Child.rennen = run
            })

            return DogInstances
          })

      })
  }

  static get tableName() {
    return 'hunde'
  }

  static get idField() {
    return 'hid'
  }

  static get fields () {
    return [
      'hid',
      'name',
      'geschlecht',
      'geburtsjahr',
      'geburtsland',
      'aufenthaltsland',
      'vater',
      'mutter',
      'zwinger'
    ]
  }
}

module.exports = Hund
