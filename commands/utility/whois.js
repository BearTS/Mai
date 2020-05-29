const { MessageEmbed } = require('discord.js')
const { timeZoneConvert } = require('../../helper.js')

module.exports = {
  config:{
    name: "whois",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "utility",
  	description: 'Fetch User Information (As of May 20, 2020 - The global function has been removed due to a probable violation to Discord ToS).',
  	examples: ['whois 637485960713736491'],
  	parameters: ['User ID']
  },
  run: async ( { users } , message, [userID] ) => {

  if (!userID) return message.channel.send(error(`Please specify the user ID to search`))

  if (userID == message.author.id) return message.channel.send(error(`Did you just queried your own ID?`))

  if (userID == message.client.user.id) return message.channel.send(error(`Oh, that's me, btw!`))

  const user = await users.fetch(userID).catch(()=>{})

  if (!user) return message.channel.send(error(`Please specify a valid Discord User ID.`))

  if (!message.guild.members.cache.has(user.id)) return message.channel.send(error(`That User doesn't belong to this server.`))

  const member = message.guild.members.cache.get(user.id) || await message.guild.members.fetch(user.id).catch(()=>{})

  message.channel.send(new MessageEmbed()
    .setColor('GREY')
    .setAuthor(`Discord user ${user.username}`,null,'https://discordapp.com/app')
    .setThumbnail(user.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))
    .addField(`Username`, user.tag, true)
    .addField(`Type`, user.bot ? 'Bot' : 'User', true)
    .addField(`Joined Discord`, timeZoneConvert(user.createdAt), true)
    .addField(`Activity`, user.presence.activities.length ? `${user.presence.activities[0].type} ${user.presence.activities[0].name}` : `Not Playing Anything`, true)
    .addField(`Currently active on`, user.presence.clientStatus && user.presence.clientStatus.web ? 'Web Browser' : user.presence.clientStatus && user.presence.clientStatus.mobile ? 'Mobile Phone' : user.presence.clientStatus && user.presence.clientStatus.desktop ? 'Desktop App' : 'Offline', true)
    .addField(`Current Status`, user.presence.status, true)
    .addField(`Membership Status`, member ? `This user is member of this server since ${timeZoneConvert(member.joinedAt)}`: `This user is not a member of this server`)
    .setFooter(`Activity, currently active, and current status will not show real status unless in a member in this server.`)
    )
  }
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
