const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async (client, message) => {

  const data = await fetch("https://dog-api.kinduff.com/api/facts").then(res => res.json()).catch(()=>{})

  if (!data) return message.channel.send(error(`Oops! Dogfact API is currently down`))

  const { facts } = data

  message.channel.send( new MessageEmbed()
    .setThumbnail(`https://i.imgur.com/iDhLFct.gif`)
    .setColor('GREY')
    .setDescription(facts))

}


module.exports.config = {
  name: "dogfacts",
  aliases: ['inu','df','dogfact'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: "Generate a random useless dog facts",
  examples: [],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
