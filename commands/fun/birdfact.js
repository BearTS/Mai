const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: "birdfacts"
  , aliases: [
    'birdfact'
    , 'tori'
    , 'bf'
  ]
  , group: 'fun'
  , description: 'Generate a random useless bird facts'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message) => {

    const data = await fetch("https://some-random-api.ml/facts/bird").then(res => res.json()).catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}! Birdfact API is currently down!`)

    const { fact } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://i.imgur.com/arkxS3f.gif`)
      .setColor('GREY')
      .setDescription(fact))
  }
}
