const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'dogfacts'
  , aliases: [
    'inu'
    , 'df'
    , 'dogfact'
  ]
  , group: 'fun'
  , description: 'Generate a random useless dog facts'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message) => {

    const data = await fetch("https://dog-api.kinduff.com/api/facts").then(res => res.json()).catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}! Dogfact API is currently down!`)

    const { facts } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://i.imgur.com/oTVVqHQ.gif`)
      .setColor('GREY')
      .setDescription(facts)
      .setFooter(`Dogfact | \©️${new Date().getFullYear()} Mai`))
  }
}
