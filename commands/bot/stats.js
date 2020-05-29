const { MessageEmbed } = require('discord.js');
const { version, author} = require('../../package.json');
const { heapUsed, heapTotal } = process.memoryUsage()
const { duration } = require('moment');
const momentDurationFormatSetup = require('moment-duration-format');
const { release, cpus } = require('os');
const { timeZoneConvert, commatize, fromNow, roundTo, addBlankSpace } = require('../../helper.js')

module.exports = {
  config: {
    name: "stats",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: "bot",
    description: "Returns bot stats",
    examples: [],
    parameters: []
  },
  run: (client, message, args) => {

    let received = 0
    client.guilds.cache.each( guild => {
      guild.channels.cache.each( channel => {
        if (channel.type !== 'text') return
        received += channel.messages.cache.filter(m => m.author.id !== client.user.id).size
      })
    })

    let sent = 0
    client.guilds.cache.each( guild => {
      guild.channels.cache.each( channel => {
        if (channel.type !== 'text') return
        sent += channel.messages.cache.filter(m => m.author.id === client.user.id).size
      })
    })

    message.channel.send( new MessageEmbed()
      .setAuthor(`Mai v${version}`, client.user.displayAvatarURL({format:'png',dynamic:true}),`https://discordapp.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=1043721303`)
      .setColor('GREY')
      .setThumbnail(client.user.displayAvatarURL({format:'png',dynamic:true}))
      .setFooter('Made with ❤ by Sakurajimai#6742')
      .addField(`${addBlankSpace(2)}\Discord API`,`•\u2000\**Message Received**: ${addBlankSpace(1)}${commatize(received)}${addBlankSpace(4)}\n•\u2000\**Message Sent**:${addBlankSpace(1)}${commatize(sent)}\n•\u2000\**Server Count**:${addBlankSpace(1)}${commatize(client.guilds.cache.size)}\n•\u2000\**Channel Count**:${addBlankSpace(1)}${commatize(client.channels.cache.size)}\n•\u2000\**User Count**:${addBlankSpace(1)}${commatize(client.users.cache.size)}`, true)
      .addField(`${addBlankSpace(2)}System`,`•\u2000\**OS**: ${addBlankSpace(1)}${process.platform}\n•\u2000\**Version**: ${release()}\n•\u2000\**Uptime**: ${addBlankSpace(1)}${duration(client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes] s [seconds]')}\n•\u2000\**Node**: ${addBlankSpace(1)}${process.version}\n•\u2000\**Memory**:${addBlankSpace(1)}${heapUsed / 1000 < 999 ? roundTo(heapUsed,2)+'KiB' : roundTo(heapUsed / 1000000,2) + 'MiB'} [${roundTo(heapUsed / heapTotal * 100,2)}%]\n•\u2000\**CPU**:${addBlankSpace(1)}${(cpus()[0].speed / 1000).toFixed(2)} GHz`,true)
      .addField(`${addBlankSpace(2)}Miscellaneous`,`•\u2000\**Created**: ${timeZoneConvert(client.user.createdAt)}, ${fromNow(client.user.createdAt)}\n•\u2000\**Commands**: ${client.commands.size}`)
      .addField(`\u200B`,`[Github Repository](https://github.com/maisans-maid/Mai) | [Website](https://maisans-maid.github.io/mai.moe)`)
    )
  }
}
