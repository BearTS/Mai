'use strict'

const quotes = require('./quotes')

const quotesLen = quotes.length
const defaultError = { Error: 'No matches were found' }

function _randomIntFromInterval (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function _searchData (inputKey, inputVal) {
  const result = []
  const isStringVal = typeof inputVal === 'string'
  if (isStringVal) {
    inputVal = inputVal.toLowerCase()
  }
  for (let i = 0; i < quotes.length; i++) {
    let currentResult = quotes[i][inputKey]
    if (isStringVal) {
      currentResult = currentResult.toLowerCase()
    }
    if (currentResult === inputVal) {
      result.push(quotes[i])
    }
  }
  if (result.length > 0) {
    return result
  } else {
    return defaultError
  }
}

function randomQuote () {
  return quotes[_randomIntFromInterval(1, quotesLen)]
}

function getQuote (id) {
  if (id > 0 && id <= quotesLen) {
    return quotes[quotesLen - id]
  } else {
    return defaultError
  }
}

function getQuotesByAnime (anime) {
  return _searchData('anime', anime)
}

function getQuotesByCharacter (character) {
  return _searchData('name', character)
}

module.exports = {
  randomQuote: randomQuote,
  getQuote: getQuote,
  getQuotesByAnime: getQuotesByAnime,
  getQuotesByCharacter: getQuotesByCharacter
}
