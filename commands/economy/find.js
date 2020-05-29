const { MessageEmbed, Collection } = require('discord.js')
const { magenta } = require('chalk')
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')
const location = [ "under the couch", "above the desk", "in the LivingRoom", "in Sakuta's bedroom", "under the rug", "beside the window", "in my bedroom", "in Nodoka's bedroom", "in Rio's bedroom", "under the desk", "the bookshelves", "the cabinet"]

module.exports = {
  config: {
    name: "find",
    aliases: ['search'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Find coins. Maybe we have some hidden around",
    examples: [],
    parameters: []
  },
  run: ( client, message) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a **wallet** yet! To create one, type \`${prefix}register\`.`))

      if (!client.economy.has(message.guild.id)) client.economy.set(message.guild.id, new Collection)

      let guildeconomy = client.economy.get(message.guild.id)

      let findeconomy = guildeconomy.get('find') || guildeconomy.set('find', new Collection()).get('find')

      const now = Date.parse(new Date())

      const duration = (Math.floor(Math.random() * (2 * 60 * 60)) + ( 30 * 60 ) ) * 1000

      let finddata = findeconomy.get(message.author.id) || findeconomy.set(message.author.id,now).get(message.author.id)

      if (finddata  > now) return message.channel.send(error(`**${message.member.displayName}** searched **${location[Math.floor(Math.random() * (location.length - 1))]}**, but found no coins.`))

      findeconomy.delete(message.author.id)

      findeconomy.set(message.author.id, now + duration)

      let amount = Math.floor(Math.random()*200) + 100

      if (money.data.wallet + amount > 20000) {

        await message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nYour wallet just overflowed. You found **${commatize(amount)}** coins, but you'd get only **${commatize(amount + money.data.wallet - 20000)}** coins! To check your balance, type \`${prefix}bal\`.\n\u200B`))
        amount = money.data.wallet + amount - 20000

      } else {

        await message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nFound **${amount}** coins for searching **${location[Math.floor(Math.random() * (location.length - 1))]}**! Spend these coins wisely! To check your balance, type \`${prefix}bal\`.\n\u200B`))

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
