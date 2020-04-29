const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async (client, message) => {

  const data = await fetch("https://api.adviceslip.com/advice").then(res => res.json()).catch(()=>{})

  if (!data) return message.channel.send(error(`Oops! Advice API is currently down`))

  const { slip : { advice } } = data

  message.channel.send( new MessageEmbed().setColor('GREY').setDescription(`\u200B\n${advice}\n\u200B`))

}


module.exports.config = {
  name: "advice",
  aliases: ['tips','advise'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: "Generate a random useless advice",
  examples: [],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
