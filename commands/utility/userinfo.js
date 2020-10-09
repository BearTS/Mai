require('moment-duration-format')
const { duration } = require('moment')
const { MessageEmbed } = require('discord.js')
const { TextHelpers: { timeZoneConvert }} = require('../../helper')

module.exports = {
  name: 'userinfo',
  aliases: ['whois'],
  guildOnly: true,
  group: "utility",
  description: 'Fetch User Information (As of May 20, 2020 - The global function has been removed due to a possible violation to Discord ToS).',
  examples: ['whois 637485960713736491'],
  parameters: ['User ID'],
  run: async ({ emojis, users }, message, [userID]) => {

    if (!message.content.match(/\d{17,19}/))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, please specify a valid user ID or user mention`)

    const user = await users.fetch(message.content.match(/\d{17,19}/)[0]).catch(()=> null)

    if (!user)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, please specify a valid user ID or user mention`)

    const userFlags = await user.fetchFlags()
                              .then( flags => flags.toArray().map( name => emojis.cache.some( n => n.name === name) ? emojis.cache.find( n => n.name === name).toString() : '\u200b').join('\u200b\u2000'))
                                .catch(()=>null)


    const member = await message.guild.members.fetch(user.id).catch(()=> null)

    if (!member)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, That user is not in this server!`)

    return message.channel.send(new MessageEmbed()

        .setColor(member && member.displayColor
                  ? member.displayColor
                  : 'GREY' )

        .setAuthor(`Discord user ${user.username}`,
                    null ,
                    'https://discordapp.com/app')

        .setDescription(`${
                          userFlags
                          ? userFlags
                          : ''
                        } ${
                          message.guild.ownerID === user.id
                          ? '<a:GUILD_OWNER:731117984730316811>'
                          : ''
                        }`)

        .setThumbnail(user.displayAvatarURL({format: 'png', dynamic: true, size: 1024}))

        .addField(
            `Username`
          ,   '**'
            + user.username
            + '**#'
            + user.discriminator
        )

        .addField(
            `Type`
          , user.bot
            ? 'Bot'
            : 'User'
          )

        .addField(`Joined Discord`, `${
          timeZoneConvert(user.createdAt).split(/ +/).splice(0,3).join(' ')
        }, ${
          duration(new Date() - user.createdTimestamp, 'milliseconds').format(' Y [year] M [month] D [day]')
        } ago.`)

        .addField(`Activity`,
          user.presence.activities.length
          ? `${user.presence.activities[0].type.replace('CUSTOM_STATUS','')} ${user.presence.activities[0].name}`
          : `Not Playing Anything`)

        .addField(
          `Currently active on`
          , Object.keys(user.presence.clientStatus || {}).map(x => x.charAt(0).toUpperCase() + x.slice(1)).join(' ')
            || 'Offline'
        )

        .addField(
            `Current Status`
          ,   user.presence.status.charAt(0).toUpperCase()
            + user.presence.status.slice(1)
          )

        .addField(`Membership Status`, `${
            member
            ? `This user is member of this server since ${timeZoneConvert(member.joinedAt).split(/ +/).splice(0,3).join(' ')}, ${duration(new Date() - member.joinedTimestamp, 'milliseconds').format(' Y [year] M [month] D [day] ')} ago`
            : `This user is not a member of this server`
          }\n${
            member && member.premiumSince
            ? `This user is boosting this server since ${timeZoneConvert(member.premiumSince).split(/ +/).splice(0,3).join(' ')}, ${duration(new Date() - member.premiumSinceTimestamp, 'milliseconds').format(' Y [year] M [month] D [day]')} ago`
            : '\u200b'}`)

        .addField('Roles', `${
            member.roles.cache.filter(role => role.id !== message.guild.id)
              .map(role => `${role}\u2000`)
                .splice(0,25).join('•\u2000')
            } ${
              member.roles.cache.size > 26
              ? `and ${member.roles.cache.size - 26} more.`
              :'\u200b'
            }`)

        .setFooter(`userinfo | ©️${new Date().getFullYear()} Mai`,'https://cdn.discordapp.com/emojis/729380844611043438')
    )
  }
}
