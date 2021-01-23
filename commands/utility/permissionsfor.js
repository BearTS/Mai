const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'permissionsfor'
  , aliases: ['permsfor']
  , group: 'utility'
  , description: 'List the server permissions of mentioned user or provided ID'
  , examples: []
  , parameters: []
  , run: async (client, message, [ user ]) => {

    const match = user
                  ? user.match(/\d{17,19}/)
                  : null

    if (!match) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, please mention or provide the ID of the user you want to know the permissions of.`)

    const member = await message.guild.members.fetch(match[0])
                    .catch(()=> null)

    if (!member) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, I can't find that user in this server!.`)

    const permissions = {
        CREATE_INSTANT_INVITE: 'Create server invite.'
      , KICK_MEMBERS: 'Kick users from this server.'
      , BAN_MEMBERS: 'Ban users from this server.'
      , MANAGE_CHANNELS: 'Create, Edit, and Reorder Channels from this server.'
      , MANAGE_GUILD: 'Edit Server Information such as Server Name, Server Region, and Server Icon.'
      , ADD_REACTIONS: 'Add new reactions to a message.'
      , VIEW_AUDIT_LOG: 'View this server\'s audit logs.'
      , PRIORITY_SPEAKER: 'Have Priority over speaker in Voice channels'
      , STREAM: 'Stream on voice channels.'
      , SEND_TTS_MESSAGES: 'Send Text-to-Speech Messages.'
      , MANAGE_MESSAGES: 'Delete messages and reactions.'
      , EMBED_LINKS: 'Have their sent links\'s preview embedded.'
      , ATTACH_FILES: 'Upload files.'
      , MENTION_EVERYONE: 'Mention @everyone.'
      , USE_EXTERNAL_EMOJIS: 'Use emojis from other servers.'
      , CONNECT: 'Connect to a voice channel.'
      , SPEAK: 'Speak in a voice channel.'
      , MUTE_MEMBERS: 'Mute users across all voice channels.'
      , DEAFEN_MEMBERS: 'Deafen users across all voice channels.'
      , MOVE_MEMBERS: 'Move users between voice channels.'
      , USE_VAD: 'Use voice activity detection.'
      , CHANGE_NICKNAME: 'Change his/her own Nickname.'
      , MANAGE_NICKNAMES: 'Change other user\'s Nicknames.'
      , MANAGE_ROLES: 'Create, Remove, or edit roles'
      , MANAGE_WEBHOOKS: 'Create, Remove, or edit Webhooks'
      , MANAGE_EMOJIS: 'Create, Remove, or edit Emojis'
    }

    const antiperms = []

    for (const [perms, bool] of Object.entries(member.permissions.serialize()))
      antiperms.push(!bool ? perms : undefined)

    return message.channel.send(
      new MessageEmbed()

      .setDescription(`*These permissions are bound to this server and not in any way related to other permissions in other servers
*These permissions are not absolute and can be overwritten by channel permission overwrites.`)

      .setColor('GREY')

      .setFooter(
          '*These permissions are bound to this server and not in any way related to other permissions in other servers\n'
        + '*These permissions are not absolute and can be overwritten by channel permission overwrites.'
        , 'https://cdn.discordapp.com/emojis/729380844611043438'
      )

      .setAuthor(
          `${member.displayName}'s Server Permissions`
        , member.user.displayAvatarURL()
      )

      .addField(
          `${member.user.tag} can...`
        , `\u200b${
            member.permissions.toArray().length
            ? member.permissions.toArray().map(perms => `\\🟢\u2000${permissions[perms]}`).filter(p => p !== `\\🟢\u2000undefined`).join('\n')
            : 'not do anything... All perms are disabled?'
          }`
      )

      .addField(
          `${member.user.tag} cannot...`
        , `\u200b${
            antiperms.filter(p => p !== undefined).length
            ? antiperms.map(perms => `\\🔴\u2000${permissions[perms]}`).filter(p => p !== `\\🔴\u2000undefined`).join('\n')
            : 'not do anything... All perms are enabled'
          }`
      )

      .setFooter(`Permissions | \©️${new Date().getFullYear()} Mai`)
    )
  }
}
