const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper.js')
const urban = require('relevant-urban')

module.exports = {
  config:{
    name: "urban",
    aliases: ['define','ud'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "utility",
    description: "Searches for your query on Urban Dictionary!",
    examples: ["urban [term]","define [term]"],
    parameters: []
  },
  run: async ( client, message, args) => {

    let def;

    if (args.length) {

      const defs = await urban(args.join(' ')).catch(()=>{})

      if (!defs)  return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\n\nNo match found for **${args.join(' ')}**`).setThumbnail('https://files.catbox.moe/kkkxw3.png'))

      if (defs.constructor.name === 'Array') {
          total = Object.keys(defs).length

          if (!defs || !total) return message.channel.send( new MessageEmbed().setColor('RED').setDescription(`\u200B\n\nNo match found for **${args.join(' ')}**`).setThumbnail('https://files.catbox.moe/kkkxw3.png'))

          def = defs[1]

        } else if (defs.constructor.name === 'Definition') {

          def = defs

        }

        return message.channel.send( new MessageEmbed()
        .setAuthor(`Urban Dictionary`,`https://files.catbox.moe/kkkxw3.png`,`https://www.urbandictionary.com/`)
        .setTitle(`Definition of ${defs.word}`)
        .setURL(defs.urbanURL)
        .addField(`Definition`,textTrunctuate(defs.definition,1000))
        .addField('Example(s)', defs.example ? defs.example : 'N/A')
        .setColor('#e86222')
        .setFooter(`Submitted by ${defs.author}`)
        )

    } else {
      return message.channel.send( new MessageEmbed()
      .setAuthor(`Urban Dictionary`,`https://files.catbox.moe/kkkxw3.png`,`https://www.urbandictionary.com/`)
      .setTitle(`Definition of Best Girl`)
      .setURL('https://ao-buta.com/tv/?innerlink')
      .addField(`Definition`,`No arguing, Mai Sakurajima indeed is the best anime girl!`)
      .addField('Example(s)', '[Mai sakurajima] is the best girl around. No one could beat her, not even zero two.')
      .setColor('#e86222')
      .setFooter(`Submitted by Sakuta Azusagawa`))
    }
  }
}
