const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports.run = ( client, message ) => {

  Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

    if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

    if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a wallet yet. Daily rewards are supposed to be put there. Get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

    const now =  Date.parse(new Date()) / 1000

    if ((60 * 60 * 24) < money.daily.timestamp - now) return message.channel.send(error(`**${message.member.displayName}**, You already got your daily reward! You can get your next daily reward in ${moment.duration(money.daily.timestamp - (now + 60 * 60 * 24), 'seconds').format('D [days] H [hours] m [minutes] s [seconds]')}`))

    if (money.daily.timestamp > now) {

      money.daily.streak++

    } else {

      money.daily.streak = 0

    }

    money.daily.timestamp = now + ( 60 * 60 * 24 * 2)

    let amount = 500 + 500 * (money.daily.streak / 2)

    if (money.data.wallet + amount > 20000) {

      await message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nYour wallet just overflowed. Instead of receiving **${commatize(amount)}** coins, you'd get **${commatize(amount + money.data.wallet - 20000)}** coins! To check your balance, type \`${prefix}bal\`.\n\u200B`))
      amount = money.data.wallet + amount - 20000

    } else {

      await message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nReceived **${commatize(amount)}** coins from daily rewards! Spend these coins wisely! To check your balance, type \`${prefix}bal\`.\n\nStreak: ${money.daily.streak}`))

    }

    money.data.wallet = money.data.wallet + amount

    money.save()

  })
}

module.exports.config = {
  name: "daily",
  aliases: [],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "economy",
  guildOnly: true,
  econocommand: true,
  description: "Want to earn money some more? Why don't you try begging, maybe someone will give you.",
  examples: [],
  parameters: []
}


function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
