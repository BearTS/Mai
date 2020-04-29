const nekos = require('nekos.life')
const { sfw: { tickle } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const { url } = await tickle().catch(()=>{})

if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

const embed = new MessageEmbed()

if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

  return message.channel.send(error(`B~Baka ${message.member}! Stop that~ it tickles!`))

} else if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

  return message.channel.send(error(`Wai~ Seriously!?`))

}else if (message.mentions.members.size) {

  return message.channel.send(embed.setColor('GREY').setDescription(`${message.member} started tickling ${message.mentions.members.first()}!`).setImage(url))

} else {

  return message.channel.send(embed.setColor('GREY').setImage(url))

}

}

module.exports.config = {
  name: "tickle",
  aliases: [''],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'Start tickling your friends!',
	examples: ['tickle @user'],
	parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
