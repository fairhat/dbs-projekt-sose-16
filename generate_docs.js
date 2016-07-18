const fs = require('fs-extra')
const docco = require('docco')
const exec = require('child_process').exec;
const items = [] // files, directories, symlinks, etc
fs.walk(__dirname + '/backend/')
  .on('data', function (item) {
    items.push(item.path)
  })
  .on('end', function () {
    console.dir(items) // => [ ... array of files]

    items.forEach((item) => exec(`docco ${item}`))
  })
