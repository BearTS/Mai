const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports.run = async ( client, message) => {

  const res = await fetch("http://history.muffinlabs.com/date").then(res=> res.json()).catch(()=>{})

  if (!res) return message.channel.send(error(`Oops! History API is currently down`))

  const { date, url, data: { Events } } = res

  const { year, text } = Events[Math.floor(Math.random() * (Events.length - 1))]

  message.channel.send( new MessageEmbed()
  .setColor('GREY')
  .setAuthor(date ? date : 'Today',null,url)
  .setDescription(`Year: **${year}**\n\n${text}`)
  .setFooter('History Today')
)

}

module.exports.config = {
  name: "history",
  aliases: ['today','historynow'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: "Fetch a random historical event on this particular day'" ,
  examples: ['history'],
  parameters: []
}
