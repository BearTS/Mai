const nekos = require('nekos.life')
const { sfw: { poke } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const { url } = await poke().catch(()=>{})

if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

const embed = new MessageEmbed()

if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

  return message.channel.send(error(`${message.member}, I'm already here! You need something?`))

} else if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

  return message.channel.send(error(`What?`))

}else if (message.mentions.members.size) {

  return message.channel.send(embed.setColor('GREY').setDescription(`${message.member} pokes ${message.mentions.members.first()}!`).setImage(url))

} else {

  return message.channel.send(error(`${message.member}, I can't poke your imaginary friend! :(`))

}

}

module.exports.config = {
  name: "poke",
  aliases: [],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'Poke your friends!',
	examples: ['poke @user'],
	parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
