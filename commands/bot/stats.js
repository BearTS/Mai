const { MessageEmbed, TextChannel, version: discord_version } = require('discord.js');
const { release, cpus } = require('os');
const { version, author } = require(`${process.cwd()}/package.json`);
const moment = require('moment');
const text = require(`${process.cwd()}/util/string`);
const MemoryLimit = 512; // Heroku only allows maximum of 512MB memory usage, change when changing hosting provider.

const platform = {
  aix : '<:aix:767076079725707304> **IBM AIX**',
  android: '<:android:767076085657108481> **Android**',
  darwin: '<:mac:767062376440659978> **Darwin**',
  freebsd: '<:freebsd:774185649975590932> **FreeBSD**',
  linux: '<:linux:767062376440659978> **Linux**',
  openbsd: '<:openbsd:767076087309926400> **OpenBSD**',
  sunprocess: '<:sunOS:767076088827609088> **SunOS**',
  win32: '<:windows:767062364042166321> **Windows**'
};

module.exports = {
  name: 'stats',
  aliases: [ 'status', 'botstatus' ],
  group: 'bot',
  description: 'Displays the status of the current bot instance.',
  clientPermissions: [ 'EMBED_LINKS' ],
  parameters: [],
  get examples(){ return [ this.name, ...this.aliases ]},
  run: async (client, message) => {

    const { heapUsed, heapTotal } = process.memoryUsage();

    const messages_cached = client.channels.cache
    .filter(x => x instanceof TextChannel)
    .reduce((m, c) => m + c.messages.cache.size, 0);

    const commands_most_used= client.commands.registers
    .sort((A,B) => B.used - A.used).first(3);

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setAuthor('Bot Stats for Nerds', client.user.displayAvatarURL())
      .addFields([
        {
          name: '__**STATISTICS**__', inline: true,
          value: [
            `**Messages**\n\n•\u2000\u2000Received:\u2000\u2000${text.commatize(client.messages.received)}`,
            `*${(client.messages.received / client.uptime / 3600000).toFixed(2)}\\📧 per hour*\n`,
            `•\u2000\u2000Sent:\u2000\u2000${text.commatize(client.messages.sent)}`,
            `*${(client.messages.sent / client.uptime / 3600000).toFixed(2)}\\📧 per hour*\n`
          ].join('\n')
        },{
          name: '\u200b', inline: true,
          value: [
            `**Data**\n\n•\u2000\u2000Server Count:\u2000\u2000${text.commatize(client.guilds.cache.size)}`,
            `•\u2000\u2000Channel Count:\u2000\u2000${text.commatize(client.channels.cache.size)}`,
            `•\u2000\u2000Unique Users:\u2000\u2000${text.commatize(client.users.cache.size)}`,
            `•\u2000\u2000Emoji Count:\u2000\u2000${text.commatize(client.emojis.cache.size)}`
          ].join('\n')
        },{
          name: '\u200b', inline: true,
          value: [
            `**Commands**\n\n•\u2000\u2000Command count:\u2000\u2000${client.commands.size}`,
            `•\u2000\u2000Command used:\u2000\u2000${client.commands.registers.reduce((x,y) => x + y.used, 0)}`,
            `•\u2000\u2000Popular Commands:\u2000\u2000`,
            commands_most_used.map(x => `\`[${x.used}]\` ${x.name}`).join('\n')
          ].join('\n')
        },{
          name: '__**MEMORY**__', inline: true,
          value: [
            `**Total Cached Messages**\n${colors(messages_cached / client.channels.cache.size * client.options.messageCacheMaxSize * 100)}${'\u2000'.repeat(5)}`,
            `*Used ${(messages_cached / (client.channels.cache.size * client.options.messageCacheMaxSize)).toFixed(2)}% of the total cache capacity.*`,
            `\`[ ${messages_cached} / ${client.channels.cache.size * client.options.messageCacheMaxSize} ]\`\n`,
            `**This Channel's Cache**\n${colors(message.channel.messages.cache.size / client.options.messageCacheMaxSize * 100)}${'\u2000'.repeat(5)}`,
            `*Used ${(message.channel.messages.cache.size / client.options.messageCacheMaxSize * 100).toFixed(2)}% of this channel's shared\ncache capacity*`,
            `\`[ ${message.channel.messages.cache.size} / ${client.options.messageCacheMaxSize} ]\`\n\u200b`
          ].join('\n')
        },{
          name: '\u200b', inline: true,
          value: [
            `**Process Memory Usage**\n${colors(heapUsed / 1024 / 1024 / MemoryLimit * 100)}${'\u2000'.repeat(5)}`,
            `*Used ${(heapUsed / 1024 / 1024 / MemoryLimit * 100).toFixed(2)}% of the allocated memory limit*`,
            `\`[ ${(heapUsed / 1024 / 1024).toFixed(2)} MB / ${MemoryLimit.toFixed(2)} MB ]\`\n`,
            `**Heap Memory Distribution**\n${colors(heapUsed / heapTotal * 100)}${'\u2000'.repeat(5)}`,
            `*Used ${(heapUsed / heapTotal * 100).toFixed(2)}% of the total Heap*`,
            `\`[ ${(heapUsed / 1024 / 1024).toFixed(2)} MB / ${(heapTotal / 1024 / 1024).toFixed(2)}MB ]\``
          ].join('\n')
        },{
          name: '__**SYSTEM**__',
          value: [
            `${platform[process.platform]} v${release}`,
            `<:node:767076088248664095> **Node** ${process.version}`,
            `<:djs:767076086445244459> **DiscordJS** v${discord_version}`,
            `<:intel:767076087599464459> **CPU**: ${cpus()[0].model} \`[ ${cpus()[0].speed / 1000} GHz ]\``
          ].join('\n')
        },{
          name: '\u200b', inline: true,
          value: [
            `**Uptime:**\u2000\u2000${moment.duration(client.uptime, 'milliseconds').format('D [days] H [hours] m [minutes]')}`,
            `**Created:**\u2000\u2000${moment(client.user.createdAt).format('dddd, Do MMMM YYYY')}`
          ].join('\n')
        },{
          name: '\u200b', inline: true,
          value: [
            `[Github](${client.config.websites.github})\u2000|\u2000[Website](${client.config.websites.website})`,
            `${moment.duration(Date.now() - client.user.createdTimestamp, 'milliseconds').format('Y [years] M [months] d [days]')} old.`
          ].join('\n')
        }
      ]).setFooter(`Bot Stats | \©️${new Date().getFullYear()} Mai`)
    );
  }
};

function colors(percentage){
  num = parseInt(percentage);
  if (typeof num !== 'number'){
    return 'Invalid Data';
  };

  let pitstop = false;
  const emojis = [
    '<a:loading:767062506471424040>',
    '<a:loadingstop:767062512762880031>',
    '<:blank:767062530983198730>',
    '<:loadingend:767062525106978836>'
  ];

  const limits = [ 20, 30, 40, 50, 60, 70, 80, 90, 100 ];
  const array = [ '<a:loadingstart:767062518858121246>' ];

  for ( const limit of limits ) {
    if (percentage > limit) {
      array.push(emojis[0]);
    } else {
      array.push(array.length == 9
                 ? emojis[3]
                 : !pitstop
                    ? emojis[1]
                    : emojis[2]);
      pitstop = true;
    };
  };

  return array.join('');
};
