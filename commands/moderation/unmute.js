const { MessageEmbed } = require('discord.js')
const gsc = require('../../models/guildProfileSchema.js')

module.exports = {
  config: {
    name: "unmute",
    aliases: ['undeafen','speak'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: ['BAN_MEMBERS','KICK_MEMBERS'],
    clientPermissions: ['MANAGE_ROLES','MANAGE_CHANNELS','MANAGE_GUILD'],
    cooldown: null,
    group: 'moderation',
  	description: 'Unmutes a muted user from this server or in a specific channel.',
  	examples: ['unmute [user] [scope]','unmute @user -g'],
  	parameters: ['user mention','local/global mute (defaults to local)']
  },
  run: async ( client, message, [user, scope] ) => {

    if (!user || !message.mentions.members.size || !user.startsWith('<@')){

      return message.channel.send(error(`Please mention a user to unmute.`))

    }

    if (scope && !['-l','-g'].includes(scope)) return message.channel.send(error(`[Invalid Scope]: ${scope} is not a valid scope type. Use \`-l\` and \`-g\` for local and global scopes, respectively.`))

    const member = message.mentions.members.first()

    if (!scope || scope === '-l') {

      if (isMutedlocal(member,message)) {

        const x = await message.channel.updateOverwrite(member.id, { SEND_MESSAGES: true, ADD_REACTIONS: true }).catch(()=>{})
        if (x) {

          const role = await fetchGuildMuteRole(message)

          if (isMutedGlobal(member,role)) return message.channel.send(error(`${member} has been unmuted [locally], but he has a preexisting [global] mute. Please wait for your global mute to be removed to be able to message again.`))

          return message.channel.send(success(`${member} has been unmuted [locally]!`))
        }
        else return message.channel.send(error(`${member}'s mute status can't be removed. Please manually modify his/her permissions.`))

      }

      return message.channel.send(error(`${member} is not muted in this channel!\n\nPlease add global scope [-g] if you want to unmute the user who is muted server-wide.`))

    } else {

      const role = await fetchGuildMuteRole(message)

      if (!role) return message.channel.send(error(`Mute role has not been set yet.`))

      if (!isMutedGlobal(member,role)) return message.channel.send(error(`${member} is not globally muted!.`))

      const y = await member.roles.remove(role).catch(()=>{})

      if (y && !isMutedlocal(member,message)) return message.channel.send(success(`${member}, has been unmuted [globally]!`))
      if (!y) return message.channel.send(error(`${member}'s global mute status can't be removed. Please manually modify his/her permissions.`))
      return message.channel.send(error(`${member}, your [global] mute status from your previous [global] mute has been removed, but you still have an existing [local] mute in this channel. Wait for the [local] mute to be removed before sending messages in this channel again.`))
    }
  }
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

const { muterole } = thisGuild

if (!muterole) return undefined

const role = message.guild.roles.cache.get(muterole) || await message.guild.roles.fetch(muterole).catch(()=>{})

if (!role) return undefined

return role

}
