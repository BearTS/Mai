const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
  name: 'meme'
  , aliases: [
    'humorme'
  ]
  , group: 'fun'
  , description: 'Generate a random meme from a selected subreddit.'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'meme'
  ]
  , parameters: []
  , run: async ( client, message ) => {

    const data = await fetch(`https://meme-api.herokuapp.com/gimme`)
            .then(res => res.json())
              .catch(()=>null)

    if (!data) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Sorry, seems like i can't connect to memeAPI.`)

    const {
        title
      , postLink
      , url
      , subreddit
    } = data

    return message.channel.send(

      new MessageEmbed()
      .setAuthor(
          title
        , null
        , postLink
      )

      .setColor('GREY')

      .setImage(url)

      .setFooter(subreddit)

    )
  }
}
