const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports = {
  config: {
    name: "bank",
    aliases: ['regbank'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Your wallet can't keep all your coins! So how about opening a bank account?",
    examples: [],
    parameters: []
  },
  run: ( client, message, args) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, Bank requires money to register, but you don't have a **wallet** yet! To create one, type \`${prefix}register\`.`))

      if (money.data.bank || money.data.bank === 0) return message.channel.send(error(`❌ **${message.member.displayName}**, You already have a bank account. To check what you can do with your coins, type \`${prefix}cmd economy\`.`))

      if (money.data.wallet < 2500) return message.channel.send(error(`❌ **${message.member.displayName}**, it seems like you don't have enough coins to register in a bank (***${commatize(2500 - money.data.wallet)}** coins more are needed*). Earn more coins first. To view how you can earn points, type \`${prefix}cmd economy\`.`))

      money.data.wallet = money.data.wallet - 2500
      money.data.bank = 2500

      const success = money.save().catch(()=>{})

      if (!success) {

        message.channel.send(error(`MONGODB_ERROR: Failed to create new server bank document.`))
        return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to create new server bank document for ${message.guild.name}.`)

      }

      return message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nRegistered to a bank! The **2,500** fee was transferred to your bank. To check your balance, type \`${prefix}bal\`.\n\u200B`))

    })

  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
