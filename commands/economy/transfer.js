const { MessageEmbed } = require('discord.js')
const { magenta } = require('chalk')
const moment = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const { commatize } = require('../../helper.js')
const { default: { prefix } } = require('../../settings.json')
const Money = require('../../models/bankSchema.js')

module.exports = {
  config: {
    name: "transfer",
    aliases: ["give"],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    econocommand:true,
    cooldown: null,
    group: 'economy',
    description: "Give some of your coins to your friends!",
    examples: ['transfer @user 500'],
    parameters: ['user mention', 'amount']
  },
  run: ( client, message, [ friend, amount ] ) => {

    Money.findOne({ guildID: message.guild.id, userID: message.author.id }, async (err, money) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!money) return message.channel.send(error(`❌ **${message.member.displayName}**, You don't have a wallet yet. Get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

      if (money.data.bank === null) return message.channel.send(error(` **${message.member.displayName}**, You don't have a bank yet. This command requires you to have a bank. Get one first by typing \`${prefix}bank\`. You need to at least have **2,500** coins in your possession to create one!`))

      if (!friend) return message.channel.send(error(` **${message.member.displayName}**, Please specify the user to send the amount to.`))

      friend = message.guild.members.cache.get(friend.replace("<@","").replace(">","").replace("!","")) || await message.guild.members.fetch(friend.replace("<@","").replace(">","").replace("!","")).catch(()=>{})

      if (!friend) return message.channel.send(error(` **${message.member.displayName}**, I couldn't find your friend.`))

      if (friend.user.bot) return message.channel.send(error(` **${message.member.displayName}**, Bots are not eligible for this command.`))

      if (!amount || isNaN(Number(amount)) || Number(amount) < 1 ) return message.channel.send(error(` **${message.member.displayName}**, Please specify a valid amount!`))

      if (Number(amount) > Math.floor(money.data.bank * 0.85)) return message.channel.send(error(` **${message.member.displayName}**, You don't have that much money to transfer! Please be reminded that there is a transaction fee of 15% of your transferred amount! To view your current balance, type \`${prefix}bal\`.`))

      Money.findOne({ guildID: message.guild.id, userID: friend.user.id }, async (err, friendmoney) => {

        if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

        if (!friendmoney) return message.channel.send(error(`❌ **${message.member.displayName}**, Your friend doesn't have a wallet yet. He cannot avail the transfer feature too unless he has a bank already. Have him get one first by typing \`${prefix}register\`. Don't worry, it's absolutely free!`))

        if (!friendmoney.data.bank) return message.channel.send(error(` **${message.member.displayName}**, Your friend doesn't have a bank yet. This command requires your friend to have a bank. Have him get one first by typing \`${prefix}bank\`. He need to at least have **2,500** coins in his possession to create one!`))

        let transactionfee = Math.floor(Number(amount) * 0.15)

        money.data.bank = money.data.bank - Number(amount) - transactionfee

        friendmoney.data.bank = friendmoney.data.bank + Number(amount)

        const success = await money.save().then( async () => { await friendmoney.save() }).catch(()=>{})

        if (!success) {

          message.channel.send(error(`MONGODB_ERROR: Failed to update server bank document.`))
          return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to update a server bank document for ${message.guild.name}.`)

        }

        return message.channel.send(new MessageEmbed().setColor('GREY').setDescription(`\u200B\nTransferred **${commatize(Number(amount))}** coins to **${friend.displayName}** with a **${Math.ceil(Number(amount) * 0.15)}** transaction fee! To check your balance, type \`${prefix}bal\`.\n\u200B`))

      })
    })
  }
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
