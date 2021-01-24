const fetch = require('node-fetch')

module.exports = async (input) => {

  if (input.length < 1) return '???'

  return fetch('https://some-random-api.ml/chatbot?message=' + encodeURI(input))
    .then(res => res.json().catch(()=>null))
    .then(res => res ? res.response.replace(/Kate|Katie|John|Fawen|Tom|Electrica/gi, 'Mai') : '???')
}
