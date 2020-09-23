require('moment-duration-format')
const { duration } = require('moment');
const { MessageEmbed, TextChannel, version: djsVersion } = require('discord.js')
const { version, author} = require('../../package.json')
const { release, cpus } = require('os');
const { TextHelpers: { timeZoneConvert, commatize }} = require('../../helper')

module.exports = {
  name: 'stats'
  , aliases: [
    'status'
    , 'botstatus'
  ]
  , group: 'bot'
  , description: 'Displays the bot status'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: []
  , run: async (client, message) => {

    const received = client.channels.cache
                      .filter( c => c instanceof TextChannel )
                        .reduce( (m,c) => m + c.messages.cache.filter( m => m.author.id !== client.user.id).size, 0)

    const sent = client.channels.cache
                  .filter( c => c instanceof TextChannel )
                    .reduce( (m,c) => m + c.messages.cache.filter( m => m.author.id === client.user.id).size, 0)

    const mostUsedCommands = client.commands.registers
                              .sort((a,b)=> b.used - a.used)
                                .first(3)

    const { heapUsed, heapTotal } = process.memoryUsage()

    const colors = (percentage) => {

      num = parseInt(percentage)

      if (isNaN(num)) return 'No data'

      let pitstop = false

      const emojis = [
        '<a:loading:729307311243526175>',
        '<a:loadingstop:729315795498172506>',
        '<:blank:729326717575102545>',
        '<:loadingend:729325802113728542>'
      ]

      const limits = [ 20, 30, 40, 50, 60, 70, 80, 90, 100 ]
      const array = [ '<a:loadingstart:729322641860722739>' ]

      for ( const limit of limits ) {
        if (percentage > limit) {
          array.push(emojis[0])
        } else {
          array.push(array.length == 9
                     ? emojis[3]
                     : !pitstop
                        ? emojis[1]
                        : emojis[2])
          pitstop = true
        }
      }

      return array.join('')

    }


    const platform = {
      aix : '<:aix:729344684077613207> **IBM AIX**',
      android: '<:android:729344968224800878> **Android**',
      darwin: '<:mac:726323946206527499> **Darwin**',
      freebsd: '<:freebsd:729345511332511764> **FreeBSD**',
      linux: '<:linux:726324195440721930> **Linux**',
      openbsd: '<:openbsd:729345741214187552> **OpenBSD**',
      sunprocess: '<:sunOS:729346907297677373> **SunOS**',
      win32: '<:windows:726323689238560779> **Windows**'
    }


    return message.channel.send( new MessageEmbed()

    .setColor('GREY')

    .setAuthor( 'Bot Stats for Nerds',
                client.user.displayAvatarURL() )


    .addField('__**STATISTICS**__', `**Messages**\n\n•\u2000Received:\u2000\u2000 ${
          commatize(client.messages.received)
        }\n*${
          (client.messages.received / (client.uptime / 3600000)).toFixed(2)
        } \\📧 per hour*\n\n•\u2000\u2000Sent:\u2000\u2000${
          client.messages.sent
        }\n*${
          (client.messages.sent / (client.uptime / 3600000)).toFixed(2)
        } \\📧 per hour*\n\u200b`, true)


    .addField('\u200b',     `**Data**\n\n•\u2000Server Count:\u2000\u2000${
          commatize(client.guilds.cache.size)
        }\n•\u2000Channel Count:\u2000\u2000${
          commatize(client.channels.cache.size)
        }\n•\u2000Unique Users:\u2000\u2000${
          commatize(client.users.cache.size)
        }\n•\u2000Emoji Count:\u2000\u2000${
          commatize(client.emojis.cache.size)
        }`, true)


    .addField('\u200b',     `**Commands**\n\n•\u2000Command Count:\u2000\u2000${
          client.commands.size
        }\n•\u2000Command Used:\u2000\u2000${
          client.commands.registers.reduce((acc, command) => acc + command.used, 0)
        } x\n•\u2000Top Popular Command:\n\u2000\u2000\`[${
          commatize(mostUsedCommands[0].used)
        }]\` ${
          mostUsedCommands[0].name
        }\n\u2000\u2000\`[${
          commatize(mostUsedCommands[1].used)
        }]\` ${
          mostUsedCommands[1].name
        }\n\u2000\u2000\`[${
          commatize(mostUsedCommands[2].used)
        }]\` ${
          mostUsedCommands[2].name
        }`, true)


    .addField('__**MEMORY**__',     `**Message Cache**\n${
          colors((received + sent) / (client.channels.cache.size * client.options.messageCacheMaxSize) * 100)
        }\u2000\u2000\u2000\u2000\u2000\n*Used ${
          ((received + sent) / (client.channels.cache.size * client.options.messageCacheMaxSize) * 100).toFixed(2)
        }% of the total cache capacity.*\n\`[ ${
          received + sent
        } / ${
          client.channels.cache.size * client.options.messageCacheMaxSize
        } ]\`\n\n**Current Channel's Cache**\n${
          colors((message.channel.messages.cache.size / client.options.messageCacheMaxSize) * 100)
        }\u2000\u2000\u2000\u2000\u2000\n*Used ${
          ((message.channel.messages.cache.size / client.options.messageCacheMaxSize) * 100).toFixed(2)
        }% of this channel's shared\ncache capacity.*\n\`[ ${
          message.channel.messages.cache.size
        } / ${
          client.options.messageCacheMaxSize
        } ]\`\n\u200b`, true)


    .addField('\u200b',     `**Process Memory Usage**\n${
          colors(((heapUsed / 1024 / 1024 ) / 512) * 100)
        }\u2000\u2000\u2000\u2000\u2000\n*Used ${
          (((heapUsed / 1024 / 1024 ) / 512 ) * 100).toFixed(2)
        }% of the allocated memory limit*\n\`[ ${
          (heapUsed / 1024 / 1024).toFixed(2)
        } MB / 512.00 MB ]\`\n\n**Heap Memory Distribution**\n${
          colors((heapUsed / (heapTotal + (20 * 1024 * 1024))) * 100)
        }\u2000\u2000\u2000\u2000\u2000\n*Used ${
          ((heapUsed / (heapTotal + (20 * 1024 * 1024))) * 100).toFixed(2)
        }% of the total Heap*\n\`[ ${
          (heapUsed / 1024 / 1024).toFixed(2)
        } MB / ${
          (20 + (heapTotal / 1024 / 1024)).toFixed(2)
        } MB] \``, true)


    .addField('__**SYSTEM**__',     `${
      platform[process.platform]
    } v${
      release
    }\n<:node:729350389094416484> **Node** ${
      process.version
    }\n<:djs:729351034199343145> **DiscordJS** v${
      djsVersion
    }\n<:intel:729352898248572939> **CPU**: ${
      cpus()[0].model
    } \`[ ${
      cpus()[0].speed / 1000
    } GHz ]\``)

    .addField('\u200b',     `[Github](${client.config.github}) | [Website](${client.config.website})`, true)

    .addField('\u200b',     `**Uptime**: ${duration(client.uptime).format('D [day] H [hour] m [minute]')}`, true)

    .setFooter(`Created: ${
      timeZoneConvert(client.user.createdAt).split(/ +/).splice(0,3).join(' ')
    }, ${
      duration(Date.now() - client.user.createdTimestamp, 'milliseconds').format('Y [year] M [month] d [day]')
    } ago.`
    , 'https://cdn.discordapp.com/emojis/729380844611043438')

    )
  }
}
