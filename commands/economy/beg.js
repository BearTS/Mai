const { MessageEmbed, Collection } = require('discord.js')
const { magenta } = require('chalk')
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports = {
  config: {
    name: "beg",
    aliases: ['plead'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Want to earn money some more? Why don't you try begging, maybe someone will give you.",
    examples: [],
    parameters: []
  },
  run:  ( client, message, args) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a wallet yet. Begged coins are supposed to be put there. Get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

      if (!client.economy.has(message.guild.id)) client.economy.set(message.guild.id, new Collection)

      let guildeconomy = client.economy.get(message.guild.id)

      let begeconomy = guildeconomy.get('beg') || guildeconomy.set('beg', new Collection()).get('beg')

      const now = Date.parse(new Date())

      const duration = (Math.floor(Math.random() * (4 * 60 * 60)) + ( 1 * 60 * 60 ) ) * 1000

      let begdata = begeconomy.get(message.author.id) || begeconomy.set(message.author.id,now).get(message.author.id)

      if (begdata  > now) return message.channel.send(error(`**${message.member.displayName}**, I already gave you some **coins** earlier. Im not rich either so please wait \`${moment.duration(begdata - now, 'milliseconds').format('H [hours] m [minutes] s [seconds]')}\` to beg again.`))

      begeconomy.delete(message.author.id)

      begeconomy.set(message.author.id, now + duration)

      let amount = Math.floor(Math.random()*400) + 100

      if (money.data.wallet + amount > 20000) {

        await message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nYour wallet just overflowed. Instead of receiving **${commatize(amount)}** coins, you'd get **${commatize(amount + money.data.wallet - 20000)}** coins! To check your balance, type \`${prefix}bal\`.\n\u200B`))
        amount = money.data.wallet + amount - 20000

      } else {

        await message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nReceived **${amount}** coins from me! Spend these coins wisely! To check your balance, type \`${prefix}bal\`.\n\u200B`))

      }

      money.data.wallet = money.data.wallet + amount

      money.save()

    })
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
