/********************************************
 *  Import Klasse, initialisierte
 *  Objekte stellen jeweils eine Zeile in der
 *  CSV Datei dar.
 ********************************************
 *
 * @name ImportData
 *
 ********************************************/
class ImportData {
  constructor(id, [
    raceCountry,
    year,
    place,
    displayName,
    gender,
    vater,
    mutter,
    runCount,
    punkte,
    distanz
  ] = []) {
    const fullName        = displayName.split('[')[0].trim()
    const BornLivesAge    = displayName.split('[')[1].replace(']', '')
    const knownAufenthalt = BornLivesAge.indexOf('/') !== -1
    const birthYear       = parseInt(BornLivesAge.split(' ')[1], 10)
    const geburtsland     = knownAufenthalt ? BornLivesAge.split('/')[0] : BornLivesAge.split(' ')[0]
    const aufenthaltsland = knownAufenthalt ? (BornLivesAge.split('/')[1] || '').split(' ')[0] : null

    const { zwinger, name } = ImportData.getName(fullName)

    this.id               = id
    this.raceCountry      = raceCountry
    this.year             = birthYear
    this.rang             = parseInt(place, 10)
    this.displayName      = displayName
    this.geschlecht       = gender ? (gender.toLowerCase() === 'm' ? 'm' : 'f') : 'm'
    this.vater            = vater
    this.mutter           = mutter
    this.runCount         = parseInt(runCount, 10)
    this.sumPoints        = parseInt(Math.round(punkte), 10)
    this.avgDistance      = distanz ? parseInt(distanz.replace('\r', ''), 10) : 0
    this.geburtsland      = geburtsland
    this.aufenthaltsland  = aufenthaltsland
    this.zwinger          = zwinger
    this.name             = name
    this.raceYear         = year
    this.raceYearCountry  = `${year}${raceCountry}`

    this.zwingerID        = null
    this.vaterID          = null
    this.mutterID         = null
    this.wurf             = null
  }

  transformToSQLInsert() {
    return [
      this.id,
      this.name,
      this.geschlecht,
      this.year,
      this.geburtsland,
      this.aufenthaltsland
    ]
  }

  static getName(fullName) {
    const words = fullName.split(' ') // trennt die einzelnen Bereiche der Spalte
    // ist in einem der Namen ein Apostroph, gehen wir davon aus, dass das der Zwingername ist
    // und dass der ZwingerName vor dem Hundenamen steht
    const hasZwingerFirst = words.find(word => word.indexOf(`'s`) !== -1) || false

    // 2 Wörter im Namen und der Zwingername ist *nicht* als erstes
    // Schema: [DogName] [ZwingerName]
    if (words.length === 2 && !hasZwingerFirst) {
      const zwinger = [...words] // copy words
      const name    = zwinger.shift()

      return {
        zwinger: zwinger.join(' '),
        name: name.trim(),
      }
    }

    // 2 oder mehr Wörter und Zwingername zuerst
    // Schema: [ZwingerName]'s [DogName]
    if (words.length >= 2 && hasZwingerFirst) {
      const name    = [...words]
      const zwinger = name.shift()

      return {
        zwinger,
        name: name.join(' ').trim()
      }
    }

    // kein Zwinger vorhanden, Zwinger (NULL)

    return {
      name: words.join(' ').trim(),
      zwinger: null
    }
  }
}

module.exports = ImportData

class ImportZwinger {
  constructor({ id, name }) {
    this.id = id
    this.name = name
  }
}

module.exports.ImportZwinger = ImportZwinger
