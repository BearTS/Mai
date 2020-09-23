const { MessageEmbed } = require('discord.js')


module.exports = {
  name: 'listrole',
  aliases: ['roles'],
  group: 'utility',
  examples: [],
  parameters: [],
  run: async (client, message) => {

    return message.channel.send( new MessageEmbed()

      .setAuthor(`💮 ${message.guild.name} Roles List`)

      .setColor('GREY')

      .addField('*ADMINISTRATIVE ROLES*', `Roles having the \`ADMINISTRATOR\` permission - The highest permission level that can override any channel restrictions.\n\n${
        message.guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).size
        ? message.guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).map(role => `•\u2000${role}\u2000`).splice(0,25).join('')
        : '*No Administrative roles*'
      } ${
        message.guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).size > 25
        ? `and ${message.guild.roles.cache.filter(role => role.permissions.has('ADMINISTRATOR')).size} more.`
        : ''
      }\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

      .addField('*MODERATIVE ROLES*', `Roles having moderative permissions such as banning, kicking, and changing the nickname of other members. \n\n${
        message.guild.roles.cache.filter(role => role.permissions.any(['BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES'], false)).size
        ? message.guild.roles.cache.filter(role => role.permissions.any(['BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES'], false)).map(role => `•\u2000${role}\u2000`).splice(0,25).join('')
        : '*No Moderative roles*'
      } ${
        message.guild.roles.cache.filter(role => role.permissions.any(['BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES'], false)).size > 25
        ? `and ${message.guild.roles.cache.filter(role => role.permissions.any(['BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES'], false)).size} more.`
        : ''
      }\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

      .addField('*MODERATED ROLES*', `Roles having moderated permissions such as Textmute and VoiceMute\n\n${
        message.guild.roles.cache.filter(role => role.permissions.has('VIEW_CHANNEL', false) && !role.permissions.has('SEND_MESSAGES')).size
        ? message.guild.roles.cache.filter(role => role.permissions.has('VIEW_CHANNEL', false) && !role.permissions.has('SEND_MESSAGES')).map(role => `•\u2000${role}\u2000`).splice(0,25).join('')
        : '*No Moderated Roles*'
      } ${
        message.guild.roles.cache.filter(role => role.permissions.has('VIEW_CHANNEL', false) && !role.permissions.has('SEND_MESSAGES')).size > 25
        ? `and ${message.guild.roles.cache.filter(role => role.permissions.has('VIEW_CHANNEL', false) && !role.permissions.has('SEND_MESSAGES')).size} more.`
        : ''
      }\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

      .addField('*REGULAR ROLES*', `Roles that does not feature a special permission\n\n${
        message.guild.roles.cache.filter(role => !role.permissions.any(['ADMINISTRATOR','BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES']) && role.permissions.has('SEND_MESSAGES')).size
        ? message.guild.roles.cache.filter(role => !role.permissions.any(['ADMINISTRATOR','BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES']) && role.permissions.has('SEND_MESSAGES')).map(role => `•\u2000${role}\u2000`).splice(0,25).join('')
        : '*No Regular Roles*'
      } ${
        message.guild.roles.cache.filter(role => !role.permissions.any(['ADMINISTRATOR','BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES']) && role.permissions.has('SEND_MESSAGES')).size > 25
        ? `and ${message.guild.roles.cache.filter(role => !role.permissions.any(['ADMINISTRATOR','BAN_MEMBERS','KICK_MEMBERS','MANAGE_NICKNAMES']) && role.permissions.has('SEND_MESSAGES')).size} more.`
        : ''
      }\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

      .setFooter(`This server has a total of ${message.guild.roles.cache.filter( role => role.id !== message.guild.id).size} roles (+1 for @everyone)`,'https://cdn.discordapp.com/emojis/729380844611043438')

    )
  }
}
