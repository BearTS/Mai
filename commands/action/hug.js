const nekos = require('nekos.life')
const { sfw: { hug } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const { url } = await hug().catch(()=>{})

if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

const embed = new MessageEmbed()

if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

  return message.channel.send(embed.setColor('GREY').setDescription(`${message.member}, Uwu <3 Thanks!`).setImage(url))

} else if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

  return message.channel.send(embed.setColor('GREY').setDescription(`Okay ${message.member}, here you go. *hugg*`).setImage(url))

}else if (message.mentions.members.size) {

  return message.channel.send(embed.setColor('GREY').setDescription(`${message.member} hugs ${message.mentions.members.first()}!`).setImage(url))

} else {

  return message.channel.send(embed.setColor('GREY').setDescription(`Okay ${message.member}, here you go. *hugg*`).setImage(url))

}

}

module.exports.config = {
  name: "hug",
  aliases: [''],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'Hug someone special.',
	examples: ['hug @user'],
	parameters: ['User Mention']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
