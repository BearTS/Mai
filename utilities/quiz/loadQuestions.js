module.exports = (difficulty) => {
  const [ ...easy ] = require('../../assets/json/quiz/easy.json')
  const [ ...medium ] = require('../../assets/json/quiz/medium.json')
  const [ ...hard ] = require('../../assets/json/quiz/hard.json')

  const map = { easy, medium, hard, random: [...easy, ...medium, ...hard]}

  return map[difficulty]

}
