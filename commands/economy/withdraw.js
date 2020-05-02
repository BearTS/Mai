const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports.run = ( client, message, [ amount ] ) => {

  Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

    if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

    if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a wallet yet. You can't withdraw something you don't have any coins to withdraw. Get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

    if (money.data.bank === null) return message.channel.send(error(` **${message.member.displayName}**, You don't have a bank yet. This command requires you to have a bank. Get one first by typing \`${prefix}bank\`. You need to at least have **2,500** coins in your possession to create one!`))

    if (money.data.bank === 0) return message.channel.send(error(` **${message.member.displayName}**, You don't have coins left in your bank.`))

    if (money.data.wallet === 20000) return message.channel.send(error(` **${message.member.displayName}**, Your wallet is already at its limit!.`))

    amount = Number(amount)

    if (!amount || isNaN(amount) || amount < 1) return message.channel.send(error(` **${message.member.displayName}**, Please specify a valid amount!`))

    if ((amount * 1.05) > money.data.bank) return message.channel.send(error(` **${message.member.displayName}**, You don't have that much money in the bank to withdraw! Please be reminded that there is a transaction fee of 5% of your withdrawn amount! To view your current balance, type \`${prefix}bal\`.`))

    const transactionfee = Math.ceil(amount * 0.05)

    amount = (money.data.wallet + amount) < 20001 ? amount : money.data.wallet + amount - 20000

    money.data.wallet = money.data.wallet + amount
    money.data.bank = money.data.bank - amount - transactionfee

    const success = await money.save()

    if (!success) {

      message.channel.send(error(`MONGODB_ERROR: Failed to update server bank document.`))
      return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to update a server bank document for ${message.guild.name}.`)

    }

    return message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nWithdrawn **${commatize(amount)}** coins from your bank with a **${transactionfee}** transaction fee! To check your balance, type \`${prefix}bal\`.\n\u200B`))

  })
}

module.exports.config = {
  name: "withdraw",
  aliases: [""],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "economy",
  guildOnly: true,
  econocommand: true,
  description: "Withdraw your money from the bank",
  examples: [],
  parameters: []
}


function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
