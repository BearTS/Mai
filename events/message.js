const { default : { prefix }, user : { owner } } = require('../settings.json')
const { magenta } = require('chalk')
const { Collection, MessageEmbed } = require('discord.js')
const { duration } = require('moment')
const { convertTime } = require('../helper.js')
const xpSchema = require('../models/xpSchema.js')

module.exports = ( client , message ) => {

  //-------------------Command Handling----------------//

const { commands, cooldowns, guildsettings, xp, user } = client

  if (message.content.toLowerCase() === 'prefix' || (message.content.split(' ').length === 1 && message.mentions.users.first() === user)) {

    return message.channel.send(`My prefix is **${prefix}**`)

  }

try {

    if (message.content.startsWith(prefix)){

    if (message.author.bot) return;

    let [ cmd, ...args ] = message.content.split(/ +/)

    let commandfile = commands.get(cmd.slice(prefix.length)) || commands.find( c => c.config.aliases && c.config.aliases.includes(cmd.slice(prefix.length)))

    if (!commandfile) return

    const { config : { name, guildOnly, ownerOnly, adminOnly, permissions, clientPermissions, cooldown }, run } = commandfile

    if (guildOnly && message.channel.type === 'dm') return message.channel.send(error(`Sorry! This command is valid on guild channels only!`))

    if (ownerOnly && message.author.id !== owner) return message.channel.send(error(`Sorry! This command is limited to my developer only!`))

    if (adminOnly && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(error(`Sorry, this command is limited to the server admins only!`))

    if (permissions && !message.member.hasPermission(permissions)) return message.channel.send(error(`You have no permissions to use this command!`))

    if (clientPermissions && !message.guild.me.hasPermission(clientPermissions)) return message.channel.send(error(`Sorry, I need the following permissions to execute this command\n\n\`${clientPermissions.join('`, `')}\``))

    if (!cooldown || !cooldown.time || cooldown.time === 0) return run(client, message, args)

    if (!cooldowns.has(name)) cooldowns.set(name, new Collection())

    const now = Date.now()
    const ts = cooldowns.get(name)
    const cdamt = cooldown.time * 1000

    if (ts.has(message.author.id)) {

      const expiry = ts.get(message.author.id) + cdamt

      if (now < expiry) {

        const { msg } = cooldown

        const timeLeft = (expiry - now)
        return message.channel.send(error(`${msg ? msg : ' You cannot use this command yet.'}\nTime left : ${duration(timeLeft / 1000, 'seconds').format('D [days] H [hours] m [minutes] s [seconds]')}`))
      }

    } else {

      ts.set(message.author.id,now)
      run( client, message, args )
      setTimeout(()=> ts.delete(message.author.id), cdamt);

    }
  }

} catch (err) {

  message.channel.send(error(`Oops! Seems like that command didn't work as expected! Please contact Sakurajimai#6742 to fix this using the error information below. \`\`\`xl\n${err}\`\`\``))

}

  //--------------------EXP SYSTEM CODE ----------------//
  if (!message.content.startsWith(prefix)){

    if (message.author.bot) return

    if (message.channel.type === 'dm') return

    if (xp.has(message.author.id)) return

    if (!guildsettings.get(message.guild.id)) return
    if (!guildsettings.get(message.guild.id).isxpActive || guildsettings.get(message.guild.id).xpExceptions.includes(message.channel.id)) return

    xpSchema.findOne({ guildID : message.guild.id, userID: message.author.id }, async (err, data) => {

      if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

      if (!data) {

        data = await new xpSchema({  guildID: message.guild.id , userID: message.author.id, points: 0, level: 1, bg: 'https://i.imgur.com/djHyEE0.png'}).save()

      }

      if (!data) return console.log(`${magenta('[Mai-Promise ERROR]')} : Failed to create new server xp document for ${message.guild.name}.`)

      const point = Math.floor(Math.random() * 10) + 15
      const cap = 150 * (data.level * 2)
      const next = cap * data.level
      const difference = next - data.points

      data.points = data.points + point

      if (next <= data.points)  data.level = data.level + 1
      data.save()

      xp.set(message.author.id,message.member.displayName)
      setTimeout(()=> xp.delete(message.author.id), 60000)

    })

  }

}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
