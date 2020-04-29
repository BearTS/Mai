const { MessageEmbed } = require("discord.js")

module.exports.run = async (bot, message, args) => {

const rep = await message.channel.send(new MessageEmbed()
  .setDescription(`${message.member} has paid their respect${args.length ? ` to ${args.join(' ')}.` : ''}`)
  .setColor('GREY')
  .setFooter('Press F to pay respect.')
)

if (!message.deleted) await message.delete()

return rep.react("🇫")

 }

module.exports.config = {
  name: "respect",
  aliases: ["f",'rep','+rep'],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: 'Show your respect, fella.',
  examples: [],
  parameters: []
}
