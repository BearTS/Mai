const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: "catfacts"
  , aliases: [
    'catfact'
    , 'neko'
    , 'cf'
  ]
  , group: 'fun'
  , description: 'Generate a random useless cat facts'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message) => {

    const data = await fetch("https://catfact.ninja/facts").then(res => res.json()).catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}! Catfact API is currently down!`)

    const { data: [cat] } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://i.imgur.com/KeitRew.gif`)
      .setColor('GREY')
      .setDescription(cat.fact))
  }
}
