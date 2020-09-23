const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
  name: 'pandafact'
  , aliases: [
    'pf'
    , 'pandafact'
  ]
  , group: 'fun'
  , description: 'Generate a random useless panda facts.'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'pandafact'
  ]
  , parameters: []
  , run: async ( client, message ) => {

    const data = await fetch("https://some-random-api.ml/facts/panda")
            .then(res => res.json())
              .catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Oops! Pandafact API is currently down.`)

    const { fact } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://i.imgur.com/QUF4VQX.gif`)
      .setColor('GREY')
      .setDescription(fact)
    )
  }
}
