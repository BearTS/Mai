const { TextHelpers: { commatize }} = require('../../helper')

module.exports = {
  name: 'roll'
  , aliases: []
  , group: "fun"
  , description: 'Generate a random number from 1-[selected number]'
  , examples: [
    'roll 150'
  ]
  , parameters: []
  , run: async ( client, message, [ tail ]) => {

    tail = parseInt(parseInt(tail) ? tail : (Math.round(Math.random()*999) + 1))
    const rand = (Math.random())

    message.channel.send(`**${commatize(Math.round(rand * tail))}** ---> [0 -> ${commatize(Math.round(tail))}]`)

  }
}
