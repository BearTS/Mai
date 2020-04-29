const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async ( client, message) => {

  const data = await fetch("https://some-random-api.ml/facts/panda").then(res => res.json()).catch(()=>{})

  if (!data) return message.channel.send(error(`Oops! Pandafact API is currently down`))

  const { fact } = data

  message.channel.send( new MessageEmbed()
    .setThumbnail(`https://i.imgur.com/QUF4VQX.gif`)
    .setColor('GREY')
    .setDescription(fact))


}

module.exports.config = {
  name: "pandafact",
  aliases: ["pf",'pandafact'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: "Generate a random useless panda facts." ,
  examples: ['pandafact'],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
