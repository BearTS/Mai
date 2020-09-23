const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'advice'
  , aliases: [
    'tips'
    , 'advice'
  ]
  , group: 'fun'
  , description: 'Generate a random useless advice'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message) => {

    const data = await fetch("https://api.adviceslip.com/advice").then(res => res.json()).catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}! Advice API is currently down!`)

    const { slip : { advice } } = data

    message.channel.send( new MessageEmbed().setColor('GREY').setDescription(`\u200B\n${advice}\n\u200B`))

  }
}
