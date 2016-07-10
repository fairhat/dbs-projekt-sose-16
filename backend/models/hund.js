'use strict'

class Hund {
  constructor({
    name = '',
    geburtstag = null,
    father = null,
    mother = null,
    gender = 'm',
    birthCountry = null,
    aufenthaltsland = null,
  }) {
    this.name = name
    this.geburtstag = geburtstag
    this.vaterName = father
    this.vater = null
    this.motherName = mother
    this.mother = null
    this.gender = gender.trim().toLowerCase()[0] === 'm' ? 'm' : 'f'
    this.birthCountry = birthCountry
    this.aufenthaltsland = aufenthaltsland
  }
}

module.exports = Hund
