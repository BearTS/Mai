const { MessageEmbed } = require('discord.js')
const gsc = require('../../models/guildProfileSchema.js')

module.exports = {
  config: {
    name: "mute",
    aliases: ['deafen','silence','shut'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: ['BAN_MEMBERS','KICK_MEMBERS'],
    clientPermissions: ['MANAGE_ROLES','MANAGE_CHANNELS','MANAGE_GUILD'],
    cooldown: null,
    group: 'moderation',
  	description: 'Prevent a user from sending a message in the server or in a specific channel.',
  	examples: ['mute [user] [time] [scope]','mute @user 10 -g', 'mute @user -g'],
  	parameters: ['user mention','time','local/global mute (defaults to local)']
  },
  run: async ( client, message, [user, time, scope]) => {

    if (!user || !message.mentions.members.size || !user.startsWith('<@')){

      return message.channel.send(error(`Please mention a user to mute. [Mention in the beginning]\n\nFollow this format: mute *required*[user] *optional*[time] *optional*[scope]`))

    }

    if (isNaN(Number(time)) && !scope){

      scope = time
      time = undefined

    }

    if (isNaN(Number(time))) time = undefined

    if (scope && !['-l','-g'].includes(scope))  return message.channel.send(error(`[Invalid Scope]: ${scope} is not a valid scope type. Use \`-l\` and \`-g\` for local and global scopes, respectively.`))

    const member = message.mentions.members.first()
    const role = await fetchGuildmuterole(message)

    if (isMod(member)) return message.channel.send(error(`${message.member}, ${member} is a mod/admin, therefore i cannot mute him/her.`))

    if (isMutedGlobal(member,role)) {

      return message.channel.send(error(`${member} is already muted! (Globally)`))

    }

    if (isMutedlocal(member,message) && scope !== '-g') {

      return message.channel.send(error(`${member} is already muted! (Locally)`))

    }

    let muteSuccess

    if (scope && scope !== '-l') {

      if (scope === '-g') {

        if (!role) return message.channel.send(error(`Mute role has not been set yet.`))

        const x = await member.roles.add(role).catch(()=>{})

        if (x) muteSuccess = true
        else muteSuccess = false

      } else return message.channel.send(error(`[Invalid Scope]: ${scope} is not a valid scope type. Use \`-l\` and \`-g\` for local and global scopes, respectively.`))

    } else {

        const s = await message.channel.updateOverwrite(member.id, { SEND_MESSAGES: false, ADD_REACTIONS: false }).catch(()=>{})
        if (s) muteSuccess = true
        else muteSuccess = false

    }

    if (!muteSuccess) return message.channel.send(error(`Failled to mute ${member}!`))

    if (!time || isNaN(Number(time) || Number(time) < 1 || Number(time) > 3600 * 24)) return message.channel.send(`Muted ${member} ${scope && scope === '-g' ? '[Globally] (Server-wide)' : '[Locally] (Channel-limited)' }`)

    message.channel.send(success(`Muted ${member} ${scope && scope === '-g' ? '[Globally] (Server-wide)' : '[Locally] (Channel-limited)' } for ${time} minute(s)!`))

    setTimeout(async () => {

      if (isMutedlocal(member,message) && scope !== '-g'){

        const y = await message.channel.updateOverwrite(member.id, { SEND_MESSAGES: true, ADD_REACTIONS: true }).catch(()=>{})

        if (y && !isMutedGlobal(member,role)) return message.channel.send(success(`${member}, your [local] mute status has been removed!`))

        if (!y) return message.channel.send(error(`${member}, cannot automatically remove your [local] mute status. Please wait for a moderator to modify it.`))

        return message.channel.send(error(`${member}, your [local] mute status from your previous [local] mute has been removed, but you still have existing [global] mute. Wait for the global mute to be removed before sending messages again.`))

      }

      if (isMutedGlobal(member,role) && scope === '-g'){

        const y = await member.roles.remove(role).catch(()=>{})

        if (y && !isMutedlocal(member,message)) return message.channel.send(success(`${member}, your [global] mute status has been removed!`))

        if (!y) return message.channel.send(error(`${member}, cannot automatically remove your [global] mute status. Please wait for a moderator to modify it.`))

        return message.channel.send(error(`${member}, your [global] mute status from your previous [global] mute has been removed, but you still have an existing [local] mute in this channel. Wait for the [local] mute to be removed before sending messages in this channel again.`))
      }

    }, time * 60 * 1000)
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

function isMutedGlobal(member,muterole){
  if (!muterole) return false
  if (member.roles.cache.has(muterole.id)) return true
  return false
}

async function fetchGuildmuterole(message){

const thisGuild = message.client.guildsettings.get(message.guild.id)

if (!thisGuild) return undefined

const { muterole } = thisGuild

if (!muterole) return undefined

const role = message.guild.roles.cache.get(muterole) || await message.guild.roles.fetch(muterole).catch(()=>{})

if (!role) return undefined

return role

}

function isMod(member){
  if (member.hasPermission('ADMINISTRATOR')) return true
  if (member.hasPermission('MANAGE_MESSAGES')) return true
  if (member.hasPermission('MANAGE_CHANNELS')) return true
  if (member.hasPermission('MANAGE_ROLES')) return true
  if (member.hasPermission('MANAGE_GUILD')) return true
  return false
}
