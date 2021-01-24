require('moment-duration-format')
const { duration } = require('moment')
const { MessageEmbed } = require('discord.js')


module.exports = {
  name: 'serverinfo',
  aliases: ['guild?','server?','serverstat','serverstats','guildstat','guildstats'],
  group: 'utility',
  examples: [],
  parameters: [],
  run: async (client, message) => {

    const bar = (percentage) => {
      num = parseInt(percentage)
      if (isNaN(num)) return 'No data'
      let pitstop = false
      const emojis = [ '<a:loading:774183152729849916>', '<a:loadingstop:774183152729849916>', '<:blank:767062530983198730>', '<:loadingend:767062525106978836>' ]
      const limits = [20,30,40,50,60,70,80,90,100]
      const array = [ '<a:loadingstart:767062518858121246>' ]
      for ( const limit of limits ) {
        if (percentage > limit) {
          array.push(emojis[0])
        } else {
          array.push(array.length == 9 ? emojis[3] : !pitstop ? emojis[1] : emojis[2])
          pitstop = true
        }
      }
      return array.join('')
    }

  const emojiLimit = !message.guild.premiumTier
                     ? 50 : message.guild.premiumTier === 1
                     ? 100 : message.guild.premiumTier === 2
                     ? 150 : 250

  const randomstaticemoji = message.guild.emojis.cache.filter( e => !e.animated ).size
                            ? message.guild.emojis.cache.filter( e => !e.animated ).random()
                            : ''

  const randomanimemoji = message.guild.emojis.cache.filter( e => e.animated ).size
                          ? message.guild.emojis.cache.filter( e => e.animated ).random()
                          : ''

  const guildowner = await message.guild.members.fetch(message.guild.ownerID)

  const verificationlvl = {
    NONE: "None",
    LOW: "Low",
    MEDIUM: "Medium",
    HIGH: "(╯°□°）╯︵ ┻━┻",
    VERY_HIGH: "┻━┻彡 ヽ(ಠ益ಠ)ノ彡┻━┻",
  }

  return message.channel.send( new MessageEmbed()
                          .setAuthor(`♨️ ${message.guild.name} Server Information`, message.guild.iconURL())

                          .setColor('GREY')

                          .setDescription(`Server Name:\u2000**${
                              message.guild.name
                            }**\nServer Region:\u2000**${
                              message.guild.region.split('')[0].toUpperCase() + message.guild.region.slice(1)
                            }**\nOwner:\u2000**${
                              guildowner.user.tag
                            }**\nVerification Level:\u2000**${
                              verificationlvl[message.guild.verificationLevel]
                            }**\nBoost Level:\u2000**Level ${
                              message.guild.premiumTier
                            }** *(Boosted by **${
                              message.guild.premiumSubscriptionCount
                            }** users)*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

                          .addField('__**MEMBERS**__', `${
                              bar((message.guild.memberCount / 250000) * 100)
                            }\n*This server has ${
                              ((message.guild.memberCount / 25000) * 100).toFixed(3)
                            }% **members** out of allocated members per server limit* \`[ ${
                              message.guild.memberCount
                            } / 250000 ]\`\n\u2000\u2000\\🟢 **${
                              message.guild.members.cache.filter(member => member.presence.status === 'online').size
                            }** users are Online!\n\u2000\u2000\\🟠 **${
                              message.guild.members.cache.filter(member => member.presence.status === 'idle').size
                            }** are Idle\n\u2000\u2000\\🔴 **${
                              message.guild.members.cache.filter(member => member.presence.status === 'dnd').size
                            }** don't want to be disturbed\n\u2000\u2000\\⚫ **${
                              message.guild.memberCount - message.guild.members.cache.filter(member => ['online','idle','dnd'].includes(member.presence.status)).size
                            }** are Offline or using Invisible Status\n**Includes Users and Bots alike.\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━*`)

                          .addField('__**ROLES**__', `${
                              bar((message.guild.roles.cache.size / 250) * 100)
                            }\n*This server has used ${
                              ((message.guild.roles.cache.size / 250) * 100).toFixed(2)
                            }% of maximum allowable **roles** per server.* \`[ ${
                              message.guild.roles.cache.size
                            } / 250 ]\`\n\u2000\u2000\\⚜️ You own **${
                              ((message.member.roles.cache.size / message.guild.roles.cache.size) * 100).toFixed(0)
                            }%** of all the roles in this server. \`[ ${
                              message.member.roles.cache.size
                            } / ${
                              message.guild.roles.cache.size
                            } ]\`\n\u2000\u2000\\⚜️ **${
                              ((message.guild.roles.cache.filter( role => role.permissions.any(['ADMINISTRATOR','KICK_MEMBERS','BAN_MEMBERS'])).size / message.guild.roles.cache.size) * 100).toFixed(0)
                            }%** of the total roles have a moderative permissions. \`[ ${
                              message.guild.roles.cache.filter( role => role.permissions.any(['ADMINISTRATOR','KICK_MEMBERS','BAN_MEMBERS'])).size
                            } / ${
                              message.guild.roles.cache.size
                            } ]\`\n\u2000\u2000\\⚜️The  ${
                              message.guild.roles.everyone.toString()
                            } role is **${
                              message.guild.roles.everyone.mentionable ? 'mentionable' : 'not mentionable'
                            }** by anyone in this server.\n**Use the command \`listrole\` to view all the roles available in this server.*\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)

                          .addField('__**EMOJIS**__', `\u200b\u2000${
                            randomstaticemoji
                          }\u2000**Static** ${
                            message.guild.emojis.cache.filter(emoji => !emoji.animated ).size === emojiLimit
                            ? '(Full)'
                            : ''
                          }\n${bar((
                            message.guild.emojis.cache.filter(emoji => !emoji.animated ).size / emojiLimit) * 100)
                          }\n*Used ${
                            (message.guild.emojis.cache.filter(e => !e.animated).size / emojiLimit) * 100
                          }% of the server's emoji limit* \n\`[ ${
                            message.guild.emojis.cache.filter(e => !e.animated).size} / ${emojiLimit
                          } ]\``
                          , true)

                          .addField('\u200b', `\u200b\u2000${
                            randomanimemoji
                          }\u2000**Animated** ${
                            message.guild.emojis.cache.filter(emoji => emoji.animated ).size === emojiLimit
                            ? '(Full)'
                            : ''
                          }\n${
                            bar((message.guild.emojis.cache.filter(emoji => emoji.animated ).size / emojiLimit) * 100)
                          }\n*Used ${
                            (message.guild.emojis.cache.filter(e => e.animated).size / emojiLimit) * 100
                          }% of the server's emoji limit* \n\`[ ${
                            message.guild.emojis.cache.filter(e => e.animated).size
                          } / ${
                            emojiLimit
                          } ]\``
                          , true)

                          .addField('\u200b','━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

                          .addField('__**CHANNELS**__',`\u200b${
                              bar((message.guild.channels.cache.size / 500) * 100)
                            }\n*This server has used ${
                              ((message.guild.channels.cache.size / 500) * 100).toFixed(2)
                            }% of maximum allowable **channels** per server.* \`[ ${
                              message.guild.channels.cache.size
                            } / 500 ]\`\n\u2000\u2000\\⚜️ **${
                              Math.round((message.guild.channels.cache.filter( c => c.type === 'category').size / message.guild.channels.cache.size) * 100)
                            }%** are Category Channels \`[${
                              message.guild.channels.cache.filter( c => c.type === 'category').size
                            } / ${
                              message.guild.channels.cache.size
                            } ]\` ${
                              message.guild.channels.cache.filter( c => c.type === 'category' && !c.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL')).size
                              ? `**(${message.guild.channels.cache.filter( c => c.type === 'category' && !c.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL')).size}** private)`
                              : ''
                            }\n\u2000\u2000\\⚜️ **${
                              Math.round((message.guild.channels.cache.filter( c => c.type === 'text').size / message.guild.channels.cache.size) * 100)
                            }%** are Text Channels \`[ ${
                              message.guild.channels.cache.filter( c => c.type === 'text').size
                            } / ${
                              message.guild.channels.cache.size
                            } ]\` ${
                              message.guild.channels.cache.filter( c => c.type === 'text' && !c.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL')).size
                              ? `*(**${message.guild.channels.cache.filter( c => c.type === 'text' && !c.permissionsFor(message.guild.roles.everyone).has('VIEW_CHANNEL')).size}** private)*`
                              : ''
                            } ${
                              message.guild.channels.cache.filter( c => c.type === 'text' && c.rateLimitPerUser ).size
                              ? `*(**${message.guild.channels.cache.filter( c => c.type === 'text' && c.rateLimitPerUser ).size}** Slowmode on)*`
                              : ''
                            }\n\u2000\u2000\\⚜️ **${
                              Math.round((message.guild.channels.cache.filter( c => c.type === 'voice').size / message.guild.channels.cache.size) * 100)
                            }%** are Voice Channels \`[ ${
                              message.guild.channels.cache.filter( c => c.type === 'voice').size
                            } / ${
                              message.guild.channels.cache.size
                            } ]\` ${
                              message.guild.channels.cache.filter( c => c.type === 'voice' && !c.permissionsFor(message.guild.roles.everyone).has('CONNECT')).size
                              ? `*(**${message.guild.channels.cache.filter( c => c.type === 'voice' && !c.permissionsFor(message.guild.roles.everyone).has('CONNECT')).size}** private)*`
                              : ''
                            } ${
                              message.guild.voiceStates.cache.filter(s => s.channelID).size
                              ? `*(**${message.guild.voiceStates.cache.filter(s => s.channelID).size}** connected)*`
                              : ''
                            }\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n•\u2000[Server Logo](${
                              message.guild.iconURL({size: 1024, format: 'png', dynamic: true})
                            })\u2000•\u2000[Server Limits](https://discordia.me/en/server-limits)\u2000`)

                          .setFooter(`This server is approximately ${duration(Date.now() - message.guild.createdTimestamp, 'milliseconds').format(' Y [year] M [month] D [day]')} old`,'https://cdn.discordapp.com/emojis/729380844611043438')
    )
  }
}
