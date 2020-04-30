const nekos = require('nekos.life')
const { sfw: { pat } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const { url } = await pat().catch(()=>{})

if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

const embed = new MessageEmbed()

if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

  return message.channel.send(embed.setColor('GREY').setDescription(`${message.member}, Uwu <3 Thanks!`).setImage(url))

} else if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

  return message.channel.send(embed.setColor('GREY').setDescription(`Okay ${message.member}, here you go. *pat pat*`).setImage(url))

}else if (message.mentions.members.size) {

  return message.channel.send(embed.setColor('GREY').setDescription(`${message.member} pats ${message.mentions.members.first()}!`).setImage(url))

} else {

  return message.channel.send(embed.setColor('GREY').setDescription(`Okay ${message.member}, here you go. *pat pat*`).setImage(url))

}

}

module.exports.config = {
  name: "pat",
  aliases: [],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'Why not? All anime girls likes a headpat, don\'t they?',
	examples: ['pat @user'],
	parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
