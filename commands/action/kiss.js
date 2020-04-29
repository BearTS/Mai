const nekos = require('nekos.life')
const { sfw: { kiss, slap } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const embed = new MessageEmbed()

if (message.mentions.members.size && message.mentions.members.first().id === client.user.id){

  const { url } = await slap().catch(()=>{})

  if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

  return message.channel.send(embed.setColor('RED').setDescription(`${message.member}, How dare you!`).setImage(url).setFooter(`${message.member.displayName}, you really do deserve a slapping.`))

} else {

  const { url } = await kiss().catch(()=>{})

  if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

  if (message.mentions.members.size && message.mentions.members.first().id === message.author.id){

    return message.channel.send(error(`S~seriously?!`))

  }else if (message.mentions.members.size) {

    return message.channel.send(embed.setColor('GREY').setDescription(`${message.member} kisses ${message.mentions.members.first()}!`).setImage(url))

  } else {

    return message.channel.send(error(`Sorry ${message.member}, I can't seem to locate your imaginary friend.`))

    }
  }
}

module.exports.config = {
  name: "kiss",
  aliases: [''],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'Show your love to someone special!',
	examples: ['kiss @user'],
	parameters: ['User mention']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
