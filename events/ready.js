const { AniListSchedule: startScheduledAnnouncement } = require('../helper')
const { MessageEmbed } = require('discord.js')


module.exports = client => {

  client.guildsettings.load()

  console.log(`
${client.user.username} is now online!

    Startup Statistics:
Servers:  ||  ${client.guilds.cache.size}
Channels: ||  ${client.channels.cache.size}
Users:    ||  ${client.users.cache.size}
Commands: ||  ${client.commands.size}

<=======BOT LOGS WILL SHOW HERE======>`)


startScheduledAnnouncement(client)

const loggingchannel = client.channels.cache.get('736504664815828992')
if (loggingchannel) loggingchannel.send(
    new MessageEmbed()
    .setColor('GREY')
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription(
        'Restarted **'
      + client.user.tag
      + '**. Up and ready to serve on '
      + client.guilds.cache.size + ' servers, '
      + client.channels.cache.size + ' channels, and '
      + client.users.cache.size + ' unique users, with over '
      + client.commands.size + ' commands readily available for use!'
     )
    .setFooter(
        'Boot Time \u200b • \u200b '
      + parseInt(client.readyAt - client.bootTimeStart)
      + ' ms.\u2000\u2000\u2000 | \u2000\u2000\u2000Last Boot '
    ).setTimestamp()
  )
}
