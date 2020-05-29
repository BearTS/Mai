const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports = {
  config: {
    name: "bal",
    aliases: ['balance'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Check your wallet, how much have you earned?",
    examples: [],
    parameters: []
  },
  run:  ( client, message, args) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a **wallet** yet! To create one, type \`${prefix}register\`.`))

      return message.channel.send(new MessageEmbed().setAuthor(`${message.member.displayName}'s wallet`).setColor('GREY').setDescription(`\u200B\n💰 **${commatize(money.data.wallet)}** coins in posession.\n\n${money.data.bank !== null ? `💰 **${commatize(money.data.bank)}** coins in bank!` : `Seems like you don't have a bank yet. Create one now by typing \`${prefix}bank\``}`).setThumbnail(message.author.displayAvatarURL({format:'png',dynamic: true})))

    })
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
