const { MessageEmbed } = require("discord.js")

module.exports = {
  config: {
    name: "respect",
    aliases: ["f",'rep','+rep'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "fun",
    description: 'Show your respect, fella.',
    examples: [],
    parameters: []
  },
  run: async (bot, message, args) => {

  const rep = await message.channel.send(new MessageEmbed()
    .setDescription(`${message.member} has paid their respect${args.length ? ` to ${args.join(' ')}.` : ''}`)
    .setColor('GREY')
    .setFooter('Press F to pay respect.')
  )

  if (!message.deleted) await message.delete()

  return rep.react("🇫")

   }
}
