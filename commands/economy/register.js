const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports = {
  config: {
    name: "register",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Start earning currency. Register to keep track of your earned currencies!",
    examples: [],
    parameters: []
  },
  run: ( client, message, args) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)


      if (money) return message.channel.send(error(`❌ **${message.member.displayName}**, You already have an existing wallet! To check your balance, type \`${prefix}bal\`.`))

      const starter = Math.floor(Math.random() * 250) + 250;

      money = await new Money({ guildID: message.guild.id, userID: message.author.id, data: { bank: null, wallet: starter}}).save()

      if (!money) {

        message.channel.send(error(`MONGODB_ERROR: Failed to create new server bank document.`))
        return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to create new server bank document for ${message.guild.name}.`)

      }

      return message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nRegistered! 💰**${starter}** coins were added to your account! To check your balance, type \`${prefix}bal\`.\n\u200B`))

    })
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
