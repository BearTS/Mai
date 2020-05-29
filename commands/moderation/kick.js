const { MessageEmbed } = require('discord.js')
const { user : { owner } } = require('../../settings.json')

module.exports = {
  config: {
    name: "kick",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: ['KICK_MEMBERS'],
    clientPermissions: ['KICK_MEMBERS'],
    cooldown: null,
    group: 'moderation',
  	description: 'kick mentioned user from this server.',
  	examples: ['kick @user'],
  	parameters: ['user mention']
  },
  run: async ( client, message, args) => {

  if (!message.mentions.members.size) {

    return message.channel.send(error(`Please mention user to kick.`))

  }

  if (message.mentions.members.size > 1) {

    return message.channel.send(error(`I wouldn't kick multiple users for security issues.`))

  }

  const member = message.mentions.members.first()

  if (member.id === message.author.id) {

    return message.channel.send(error('I wouldn\'t dare kick you!'))

  }

  if (member.id === client.id) {

    return message.channel.send(error('Please don\'t kick me!'))

  }

  if (member.user.bot) {

    return message.channel.send(error('I\'m friends with other bots. I wouldn\'t kick them!'))

  }

  if (member.id === message.guild.ownerID) {

    return message.channel.send(error('Sorry you cannot kick a server owner!'))

  }

  if (member.id === owner) {

    return message.channel.send(error('How dare you kick my developer!'))

  }

  if (message.guild.me.roles.highest.position < member.roles.highest.position) {

    return message.channel.send(error(`I can't kick ${member}! Their highest role position is higher than mine.`))

  }

  if (message.member.roles.highest.position < member.roles.highest.position) {

    return message.channel.send(error(`You can't kick ${member}! Their highest role position is higher than yours.`))

  }

  if (!member.kickable) {

    return message.channel.send(error(`I can't kick ${member} for some Unknown reason.`))

  }

  const reason = args.length ? args.join(' ').replace(`<@${member.id}>`,'') : 'None'

  const warnMessage = await message.channel.send(prompt(`Are you sure you want to kick **${member.displayName}**?`))
  const msg = await message.channel.awaitMessages( res => res.author.id === message.author.id, { max: 1, time: 30000})

  if (!msg.size || !['y','yes'].includes(msg.first().content.toLowerCase())) {

    if (!warnMessage.deleted) warnMessage.delete()
    message.channel.send(error(`Kick Command Terminated!`))

  }

  if (['n','no'].includes(msg.first().content.toLowerCase())) {

    if (!warnMessage.deleted) warnMessage.delete()
    warnMessage.edit(error(`Cancelled Kicking **${member.displayName}**`))

  }

  try {
    await member.send(new MessageEmbed().setAuthor('Kick Notice!').setDescription(`Oh no ${member}! You have been kicked from **${message.guild.name}**!\n\n${message.author.tag} has Kicked you from our server${reason === 'None' ? '.' : ` because of the following reason:\n\`\`\`${reason}\n\`\`\``}`).setColor('RANDOM').setThumbnail(message.author.displayAvatarURL()).setFooter('This message is auto-generated.').setTimestamp())
  } catch (err) {
    await message.channel.send(error(`Failed to notify **${member.displayName}** for the kick! (DM Failed)`))
  }

   const done = await member.kick({ reason: `MAI-KICK: ${message.author.tag}: ${reason}`}).catch(()=>{})

   if (done) return message.channel.send(success(`Successfully kicked **${member.displayName}**`))

   return message.channel.send(error(`Failed to kick **${member.displayName}**`))
  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function prompt(msg){
  return new MessageEmbed()
  .setColor('ORANGE')
  .setDescription(`\u200B\n${msg}\n\u200B`)
}

function success(msg){
  return new MessageEmbed()
  .setColor('GREEN')
  .setDescription(`\u200B\n${msg}\n\u200B`)
}
