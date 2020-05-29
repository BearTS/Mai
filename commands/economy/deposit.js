const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports = {
  config: {
    name: "deposit",
    aliases: ["dep"],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Deposit your money in a bank to safeguard your money!",
    examples: [],
    parameters: []
  },
  run: ( client, message, [ amount ] ) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a wallet yet. You can't deposit something you don't have. Get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

      if (money.data.bank === null) return message.channel.send(error(` **${message.member.displayName}**, You don't have a bank yet. This command requires you to have a bank. Get one first by typing \`${prefix}bank\`. You need to at least have **2,500** coins in your possession to create one!`))

      if (!money.data.wallet) return message.channel.send(error(` **${message.member.displayName}**, You don't have coins left in your possession. To view how to earn points, type \`${prefix}cmd economy\`.`))

      if (!amount) return message.channel.send(error(` **${message.member.displayName}**, Please specify a valid amount!`))

      let transactionfee;

      if (amount.toLowerCase() === 'all') {

        transactionfee = Math.floor(money.data.wallet * 0.05)
        amount = money.data.wallet - transactionfee
        money.data.bank = money.data.bank + money.data.wallet - transactionfee
        money.data.wallet = 0

      } else if (isNaN(Number(amount))) {

        return message.channel.send(error(` **${message.member.displayName}**, Please specify a valid amount!`))

      } else if (Number(amount) > (Math.floor(money.data.wallet * 0.95))) {

        return message.channel.send(error(` **${message.member.displayName}**, You don't have that much money to deposit! Please be reminded that there is a transaction fee of 5% of your deposited amount! To view your current balance, type \`${prefix}bal\`. To deposit all your current coins in posession, type\`${prefix}deposit all\`.`))

      } else if (Number(amount) < 1 ) {

        return message.channel.send(error(` **${message.member.displayName}**, Please specify a valid amount!.`))

      } else {

        transactionfee = Math.floor(Number(amount) * 0.05)
        money.data.wallet = money.data.wallet - Number(amount) - transactionfee
        money.data.bank = money.data.bank + Number(amount)

      }

      const success = await money.save()

      if (!success) {

        message.channel.send(error(`MONGODB_ERROR: Failed to update server bank document.`))
        return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to update a server bank document for ${message.guild.name}.`)

      }

      return message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\Deposited **${commatize(Number(amount))}** coins to the bank with a **${Math.ceil(Number(amount) * 0.05)}** transaction fee! To check your balance, type \`${prefix}bal\`.`))

    })
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
