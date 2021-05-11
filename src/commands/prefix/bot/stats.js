const { join } = require('path')
const moment = require('moment');

const { Permissions: { FLAGS }, MessageEmbed, version } = require('discord.js');
const { version: _version, author }                     = require(join(__dirname, '../../../../package.json'));
const { release, cpus }                                 = require('os');

module.exports = {
  name             : 'stats',
  description      : 'Displays the status of the current bot instance.',
  aliases          : [ 'status', 'botstatus' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'bot',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [],
  run              : async (message, language) => {

    const { heapUsed, heapTotal } = process.memoryUsage();

    const parameters = new language.Parameter({ '%TITLE%': 'Bunny Girl Senpai','%SHARD%': message.client.shard.ids[0], '%SERVER%': message.client.guilds.cache.size, '%MUSIC%': '0'});
    const { NUMBER } = message.client.services.UTIL;
    const DICT       = language.getDictionary([ 'day(s)', 'hour(s)', 'minute(s)', 'messages', 'sent', 'received', 'cached', 'users', 'total', 'here', 'commands', 'times accessed', 'most used', 'memory', 'used', 'shard', 'system', 'unavailable', 'uptime' ]);

    /* Messages Field Values */
    const msgssent = NUMBER.compact(message.client.messages.sent);
    const msgsrcvd = NUMBER.compact(message.client.messages.received);
    const msgscach = NUMBER.compact(message.client.channels.cache.filter(x => x.send).reduce((m,c) => m + c.messages.cache.size, 0));

    /* Users Field Values */
    const usrtotal = NUMBER.compact(message.client.guilds.cache.reduce((acc, cur) => acc + cur.memberCount, 0));
    const usrcachd = NUMBER.compact(message.client.users.cache.size);
    const userhere = message.guild?.memberCount ? NUMBER.compact(message.guild.memberCount) : DICT.UNAVAILABLE;

    /* Commands Field Values */
    const mostused = [...message.client.commands.store.array()].sort((A,B) => B.used - A.used).splice(0,1)[0]
    const cmdtotal = NUMBER.compact(message.client.commands.store.size);
    const cmdxaccs = NUMBER.compact(message.client.commands.store.reduce((a,c) => a + c.used, 0));
    const cmdmused = `\`${mostused.name} [${NUMBER.compact(mostused.used)}]\``;

    /* Memory Field Values*/
    const memtotal = `[\`${(heapTotal / 1024 / 1024).toFixed(0)} MB\`]`;
    const memoused = `[\`${(heapUsed  / 1024 / 1024).toFixed(0)} MB\`]`;
    const curshard = message.client.shard.ids[0];

    /* System Field Values*/
    const systemos = `**${process.platform} ${release}**`;
    const discordv = `**${version}**`;
    const nodevers = `**${process.version}**`;
    const systmcpu = `**${cpus()[0].model}**`;

    const uptime   = moment.duration(message.client.uptime, 'ms').format(`D [${DICT['DAY(S)']}] H [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}]`);
    const FIELD    = language.get({ '$in': 'COMMANDS', id: 'STATS_FIELD', parameters });

    return message.channel.send(
      new MessageEmbed()
      .setColor(0xe620a4)
      .setURL('https://mai-san.ml/')
      .setTitle(`${message.client.user.username} v${_version}`)
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'STATS_EFOOTER'})}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .addFields([
        { name: FIELD                                   , inline: false, value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'                                                                                                                      },
        { name: `📧\u2000${DICT.MESSAGES.toUpperCase()}`, inline: true, value: `${DICT.SENT }:\u2000\u2000**${msgssent}**\n${DICT.RECEIVED         }:\u2000\u2000**${msgsrcvd}**\n${DICT.CACHED      }:\u2000\u2000**${msgscach}**` },
        { name: `👥\u2000${DICT.USERS.toUpperCase()   }`, inline: true, value: `${DICT.TOTAL}:\u2000\u2000**${usrtotal}**\n${DICT.CACHED           }:\u2000\u2000**${usrcachd}**\n${DICT.HERE        }:\u2000\u2000**${userhere}**` },
        { name: `\u200b`                                , inline: false, value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'                                                                                                                      },
        { name: `⭐\u2000${DICT.COMMANDS.toUpperCase()}`, inline: true, value: `${DICT.TOTAL}:\u2000\u2000**${cmdtotal}**\n${DICT['TIMES ACCESSED']}:\u2000\u2000**${cmdxaccs}**\n${DICT['MOST USED']}:\u2000\u2000**${cmdmused}**` },
        { name: `🧠\u2000${DICT.MEMORY.toUpperCase()  }`, inline: true, value: `${DICT.TOTAL}:\u2000\u2000**${memtotal}**\n${DICT.USED             }:\u2000\u2000**${memoused}**\n${DICT.SHARD       }:\u2000\u2000**${curshard}**` },
        { name: `\u200b`                                , inline: false, value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'                                                                                                                      },
        { name: `⚙️\u2000${DICT.SYSTEM.toUpperCase()  }`, inline: false, value: `OS:\u2000\u2000${systemos}\nDISCORDJS:\u2000\u2000${discordv}\nNODE:\u2000\u2000${nodevers}\nCPU:\u2000\u2000${systmcpu}`                          },
        { name: `${DICT.UPTIME}:\u2000${uptime}`, inline: false, value: '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'                                                                                                                               }
      ])
    );
  }
};
