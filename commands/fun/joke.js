const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
  name: 'joke'
  , aliases: [
    'haha'
  ]
  , group: 'fun'
  , description: 'Generate a random joke from jokeAPI'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'joke'
  ]
  , parameters: []
  , run: async ( client, message ) => {

    const data = await fetch(`https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist`)
            .then(res => res.json())
              .catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Sorry, seems like i can't connect to JokeAPI.`)

    const {
        type
      , category
      , joke
      , setup
      , delivery
    } = data

    return message.channel.send(new MessageEmbed()
      .setAuthor(`${category} joke`)

      .setDescription(
        type === 'twopart'
        ? `${setup}\n\n||${delivery}||`
        : joke
      )

      .setColor('GREY')

      .setThumbnail('https://i.imgur.com/KOZUjcc.gif')
    )
  }
}
