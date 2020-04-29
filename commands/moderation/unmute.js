const { MessageEmbed } = require('discord.js')
const gsc = require('../../models/guildProfileSchema.js')

module.exports.run = async ( client, message, [user, scope] ) => {

  if (!user || !message.mentions.members.size || !user.startsWith('<@')){

    return message.channel.send(error(`Please mention a user to mute. [Mention in the beginning]\n\nFollow this format: mute *required*[user] *optional*[time] *optional*[scope]`))

  }

  if (scope && !['-l','-g'].includes(scope)) return message.channel.send(error(`[Invalid Scope]: ${scope} is not a valid scope type. Use \`-l\` and \`-g\` for local and global scopes, respectively.`))

  const member = message.mentions.members.first()

  if (!scope || scope === '-l') {

    if (isMutedlocal(member,message)) {

      const x = await message.channel.overwritePermissions([{id: member.id, allow: ['SEND_MESSAGES','ADD_REACTIONS']}]).catch(()=>{})
      if (x) return message.channel.send(success(`${member} has been unmuted [locally]!`))
      else return message.channel.send(error(`${member}'s mute status can't be removed. Please manually modify his/her permissions.`))

    }

    return message.channel.send(error(`${member} is not muted in this channel!\n\nPlease add global scope [-g] if you want to unmute the user who is muted server-wide.`))

  } else {

    const role = await fetchGuildMuteRole(message)

    if (!role) return message.channel.send(error(`Mute role has not been set yet.`))

    const y = await member.roles.remove(role).catch(()=>{})

    if (y && !isMutedlocal(member,message)) return message.channel.send(success(`${member}, has been unmuted [globally]!`))
    if (!y) return message.channel.send(error(`${member}'s global mute status can't be removed. Please manually modify his/her permissions.`))
    return message.channel.send(error(`${member}, your [global] mute status from your previous [global] mute has been removed, but you still have an existing [local] mute in this channel. Wait for the [local] mute to be removed before sending messages in this channel again.`))

  }

}

module.exports.config = {
  name: "unmute",
  aliases: ['undeafen','speak'],
  cooldown:{
    time: 0,
    msg: ""
  },
	group: 'moderation',
  guildOnly: true,
  permissions: ['BAN_MEMBERS','KICK_MEMBERS'],
  clientPermissions: ['MANAGE_ROLES','MANAGE_CHANNELS','MANAGE_GUILD'],
	description: 'Unmutes a muted user from this server or in a specific channel.',
	examples: ['unmute [user] [scope]','unmute @user -g'],
	parameters: ['user mention','local/global mute (defaults to local)']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function success(msg){
  return new MessageEmbed()
  .setColor('GREEN')
  .setDescription(`\u200B\n${msg}\n\u200B`)
}

function isMutedlocal(member,message){
  if (message.channel.permissionsFor(member).has('SEND_MESSAGES')) return false
  return true
}

function isMutedGlobal(member,muteRole){
  if (!muteRole || muteRole === null) return false
  if (member.roles.cache.has(muteRole.id)) return true
  return false
}

async function fetchGuildMuteRole(message){

const thisGuild = message.client.guildsettings.get(message.guild.id)

if (!thisGuild) return undefined

const { muteRole } = thisGuild

if (!muteRole) return undefined

const role = message.guild.roles.cache.get(muteRole) || await message.guild.roles.fetch(muteRole).catch(()=>{})

if (!role) return undefined

return role

}
