const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "birdfacts",
    aliases: ['birdfact','tori','bf'],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "fun",
    description: "Generate a random useless bird facts",
    examples: [],
    parameters: []
  },
  run: async (client, message) => {

    const data = await fetch("https://some-random-api.ml/facts/bird").then(res => res.json()).catch(()=>{})

    if (!data) return message.channel.send(error(`Oops! Birdfact API is currently down`))

    const { fact } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://i.imgur.com/arkxS3f.gif`)
      .setColor('GREY')
      .setDescription(fact))

  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
