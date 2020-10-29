const { MessageEmbed } = require("discord.js")

module.exports = {
  name: 'respect'
  , aliases: [
    'f'
    , 'rep'
    , '+rep'
  ]
  , group: 'fun'
  , description: 'Show your respect, fella.'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async ( client, message, args ) => {

    const rep = await message.channel.send(new MessageEmbed()
      .setDescription(`${message.member} has paid their respect${args.length ? ` to ${args.join(' ')}.` : ''}`)
      .setColor('GREY')
      .setFooter(`Press F to pay respect | \©️${new Date().getFullYear()} Mai`)
    )

    if (!message.deleted) await message.delete()

    return rep.react("🇫")
  }
}
