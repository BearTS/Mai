const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "joke",
    aliases: ["haha"],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "fun",
    description: "Generate a random joke from jokeAPI" ,
    examples: ['joke'],
    parameters: []
  },
  run: async ( client, message ) => {

  const data = await fetch(`https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist`).then(res => res.json())

  if (!data) return message.channel.send(error(`Sorry, seems like i can't connect to JokeAPI.`))

  const { type, category, joke, setup, delivery } = data

  return message.channel.send(new MessageEmbed()
    .setAuthor(`${category} joke`)
    .setDescription( type === 'twopart' ? `${setup}\n\n||${delivery}||` : joke)
    .setColor('GREY')
    .setThumbnail('https://i.imgur.com/KOZUjcc.gif')
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
