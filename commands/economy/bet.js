const { MessageEmbed, Collection } = require('discord.js')
const { magenta } = require('chalk')
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports.run = ( client, message, [amount] ) => {

  Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

    if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

    if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a wallet yet. Get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

    if (money.data.bank === null) return message.channel.send(error(`**${message.member.displayName}**, You don't have a bank yet. Won bets might be higher than wallet capacity depending on your bet amount. Get a bank first by typing \`${prefix}bank\`. You must have at least **2,500** coins to register to a bank!`))

    amount = Math.floor(Number(amount))

    if (!amount || isNaN(amount) || amount < 1) return  message.channel.send(error(`**${message.member.displayName}**, Please enter a valid amount`))

    if (amount < 500) return message.channel.send(error(`**${message.member.displayName}**, That amount is too low for a bet. Minimum bet is **500**`))

    if (amount > 5000) return message.channel.send(error(`**${message.member.displayName}**, That's too large amount for a single bet. Maximum bet is **5,000**`))

    if (amount > money.data.wallet) return message.channel.send(error(`**${message.member.displayName}**, You don't have enough coins to place that bet.`))

    money.data.wallet = money.data.wallet - amount

    await money.save()

    message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\n**${message.member.displayName}**!!! You placed your bet **${commatize(amount)}** coins into a betting machine! Results will come in after a minute! Good luck!\n\u200B`))

    setTimeout(async () => {

      const won = Math.floor(Math.random()*4) === 2 ? true : false

      if (!won) return message.channel.send(error(`**${message.member.displayName}**, You lost **${commatize(amount)}** coins from your previous bet!`))

      const multiplier = (Math.random() * 8).tofixed(1) + 2

      prize = amount * multiplier

      money.data.bank = money.data.bank + prize

      await money.save()

      return message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\n**${message.member.displayName}**!!! You just won your previous bet! Your bet **${commatize(Number(amount))}** coins has multiplied by **${multiplier * 100} %** You won **${commatize(prize-amount)}** in total! To check your balance, type \`${prefix}bal\`.\n\u200B`))

    }, 60000);
  })
}

module.exports.config = {
  name: "bet",
  aliases: ['gamble'],
  cooldown:{
    time: 120,
    msg: "You can't attempt to gamble twice under two minutes!"
  },
  group: "economy",
  guildOnly: true,
  econocommand: true,
  description: "Earn coins with much higher prize ( 200% - 1000% ), but low winrate ( 25% )",
  examples: ['bet 500'],
  parameters: ['bet amount']
}


function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
