const { Permissions: { FLAGS }} = require('discord.js');

const moment = require('moment');

module.exports = {
  name             : 'mute',
  description      : 'Prevents a user from sending a message in this server.',
  aliases          : [ 'deafen', 'silence', 'shut' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_ROLES ],
  permissions      : [ FLAGS.MANAGE_ROLES ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention | ID'                     ],
  examples         : [ 'mute @user', 'mute 798213718237181231' ],
  run              : async (message, language, user) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });

    if (!message.guild.profile?.roles.muted){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_NOMUTED', parameters }));
    };

    if (!message.guild.roles.cache.has(message.guild.profile.roles.muted)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_INVMUTED', parameters }));
    };

    const mutedrole  = message.guild.roles.cache.get(message.guild.profile.roles.muted);
    let   timearg    = user.find(x => x.match(/\-\s*\d+(d|h|m|s)([\w])*/i)) || '';
          user       = user.map(x => x.match(/\d{17,19}/g)).filter(Boolean)[0]?.[0];
    let   time       = 0, warn = '', member;

    if (!user || !(member = await message.guild.members.fetch(user).catch(()=>{}))){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_NOUSER', parameters }));
    };

    for (const [key, multiplier] of Object.entries({ days: 864e5, hours: 36e5, minutes: 6e4 })){
      time = time + (Math.ceil(timearg.match(new RegExp(`\\d{1,}${key[0]}`))?.[0].split(/[a-z]/i)[0])||0) * multiplier;
    };

    const DICT      = language.getDictionary([ 'day(s)', 'hour(s)', 'minute(s)', 'no duration']);
    const { ARRAY } = message.client.services.UTIL;
    const format    = `d [${DICT['DAY(S)']}] h [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}]`;

    parameters.assign({ '%DURATION%':  moment.duration(time).format(format), '%MEMBER%': member.user.tag });

    if (message.member.roles.highest.position < member.roles.highest.position){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_ROLEPOS', parameters }));
    };

    if (member.id === message.client.user.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_IS_ME', parameters }));
    };

    if (member.user.bot){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_IS_BOT', parameters }));
    };

    if (message.member.id === member.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_IS_SELF', parameters }));
    };

    if (member.muted){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'MUTE_IS_MUTED', parameters }));
    };

    if (mutedrole.permissions.has(FLAGS.SEND_MESSAGES)){
      warn += language.get({ '$in': 'COMMANDS', id: 'MUTE_CANSEND', parameters })
    };

    const aboveroles = member.roles.cache.filter(role => role.position > mutedrole.position && role.permissions.has(FLAGS.SEND_MESSAGES));

    if (aboveroles.size){
      parameters.assign({ '%ROLES%': ARRAY.join(aboveroles.map(x => x.toString()).array()) });
      warn += language.get({ '$in': 'COMMANDS', id: 'MUTE_HASROLES', parameters });
    };

    parameters.assign({ '%WARN%': warn });
    const success = language.get({ '$in': 'COMMANDS', id: `MUTE_SUCCESS${time ? '_WD' : ''}`, parameters })

    return member.roles.add(mutedrole)
    .then(()    => message.channel.send(success))
    .then(()    => Promise.resolve(time ? setTimeout(() => member.roles.cache.has(mutedrole.id)?member.roles.remove(mutedrole).catch(()=>{}):{}, time) : 0))
    .catch(err  => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'MUTE_FAILED',  parameters: parameters.assign({ '%ERROR%': err.message }) })))
    .finally(() => !message.deleted ? message.delete() : null);
  }
};
