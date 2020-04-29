const nekos = require('nekos.life')
const { sfw: { smug } } = new nekos()
const { MessageEmbed } = require('discord.js')

module.exports.run = async ( client, message ) => {

const { url } = await smug().catch(()=>{})

if (!url) return message.channel.send(error(`Could not connect to nekos.life`))

message.channel.send( new MessageEmbed()
  .setColor('GREY')
  .setImage(url)
  .setDescription(`${message.member} smugs.`)
)

}

module.exports.config = {
  name: "smug",
  aliases: [''],
  cooldown: {
    time: 0,
    msg: ''
  },
	group: 'action',
  guildOnly: true,
	description: 'The epitome of arguments: smug anime girls.',
	examples: ['smug'],
	parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
