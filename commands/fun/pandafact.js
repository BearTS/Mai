const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: "pandafact",
    aliases: ["pf",'pandafact'],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "fun",
    description: "Generate a random useless panda facts." ,
    examples: ['pandafact'],
    parameters: []
  },
  run: async ( client, message) => {

    const data = await fetch("https://some-random-api.ml/facts/panda").then(res => res.json()).catch(()=>{})

    if (!data) return message.channel.send(error(`Oops! Pandafact API is currently down`))

    const { fact } = data

    message.channel.send( new MessageEmbed()
      .setThumbnail(`https://i.imgur.com/QUF4VQX.gif`)
      .setColor('GREY')
      .setDescription(fact)
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
