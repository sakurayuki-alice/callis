const fs = require('fs')
const util = require('util')
const stemmer = require('stemmer')
const stopword = require('stopword')
const readdir = util.promisify(fs.readdir)
const readFile = util.promisify(fs.readFile)

const directory = 'shakespeare'
const keywords = ['caesar', 'romeo']

readdir(directory).then(files => {
  Promise.all(
    files.map(file => {
      return readFile(directory + '/' + file, 'utf-8')
    })
  ).then(texts => {
    texts = texts.map(text => {
      return stopword.removeStopwords(
        text
          .toLowerCase()
          .replace(/(\,|\.|:|;|\!|\?|\s|\n)+/g, ' ')
          .split(' ')
          .filter(word => {
            return word
          })
          .map(word => {
            return stemmer(word)
          })
      )
    })
    fs.writeFile('data.json', JSON.stringify(texts, null, '  '), () => {})
    const tfidf = keywords.map(keyword => {
      const idf =
        Math.log(
          texts.length /
            texts.filter(text => {
              return text.includes(keyword)
            }).length
        ) + 1
      return texts.map(text => {
        return (
          (text.filter(word => {
            return word === keyword
          }).length /
            text.length) *
          idf
        )
      })
    })
    console.table(
      files.reduce((table, file, fileIndex) => {
        table[file] = keywords.reduce((row, keyword, keywordIndex) => {
          row[keyword] = tfidf[keywordIndex][fileIndex]
          return row
        }, {})
        return table
      }, {})
    )
  })
})
