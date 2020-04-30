const nekos = require('nekos.life')
const { sfw: { baka } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const { url } = await baka().catch(()=>{})

if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

const embed =  new MessageEmbed()

if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

  return message.channel.send(error(`Chigau! Anata wa baka desu!`))

} else if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

  return message.channel.send(error(`Seriously?`))

} else if (message.mentions.members.size) {

  return message.channel.send(embed
    .setColor('GREY')
    .setImage(url)
    .setDescription(`${message.mentions.members.first()} B~baka!`))

} else

  return message.channel.send(embed
    .setColor('GREY')
    .setImage(url))
}

module.exports.config = {
  name: "baka",
  aliases: [],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'It\'s not like I want you to use my command.. ~Baka!',
	examples: ['baka'],
	parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
