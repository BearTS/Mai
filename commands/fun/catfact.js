const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "catfacts",
    aliases: ['catfact','neko','cf'],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "fun",
    description: "Generate a random useless cat facts",
    examples: [],
    parameters: []
  },
  run: async (client, message) => {

    const data = await fetch("https://catfact.ninja/facts").then(res => res.json()).catch(()=>{})

    if (!data) return message.channel.send(error(`Oops! Catfact API is currently down`))

    const { data : [ cat ] } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://static.ezgif.com/images/loadcat.gif`)
      .setColor('GREY')
      .setDescription(cat.fact))
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
