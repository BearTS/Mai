const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "meme",
    aliases: ["humorme"],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "fun",
    description: "Generate a random meme from a selected subreddit." ,
    examples: ['meme'],
    parameters: []
  },
  run: async ( client, message ) => {

  const data = await fetch(`https://meme-api.herokuapp.com/gimme`).then(res => res.json())

  if (!data) return message.channel.send(error(`Sorry, seems like i can't connect to memeAPI.`))

  const { title, postLink, url, subreddit } = data

  return message.channel.send(new MessageEmbed()
    .setAuthor(title, null, postLink)
    .setColor('GREY')
    .setImage(url)
    .setFooter(subreddit)
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
