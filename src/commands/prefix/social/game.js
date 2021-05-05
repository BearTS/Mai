const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const moment          = require('moment');
const { readdirSync } = require('fs');
const { join }        = require('path');

const files   = readdirSync(join(__dirname, '../../../util/games'));
const jsfiles = files.filter(ext => ext.split('.').pop() === 'js');

const games = jsfiles.map(x => {
  return { [x.split('.')[0]]: require(`../../../util/games/${x}`) };
});

module.exports = {
  name             : 'game',
  description      : 'Play some games to earn credits.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'game title'   ],
  examples         : [ 'game captcha' ],
  run              : async (message, language, [title,, ...args]) => {

    if (message.author.playing){
      return;
    };

    // message.author.profile was removed from document selection as it causes conflicts when saving the same instance with xp.
    const profile    = message.client.database.Profile;
    const categories = jsfiles.map(x => x.split('.')[0]).join(', ');
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%CATEGORIES%': categories });
    const document   = /*message.author.profile ||*/ await profile.findById(message.author.id) || new profile({ _id: message.author.id });
    const DICT       = language.getDictionary([ 'hour(s)', 'minute(s)', 'second(s)']);

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (!title){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'GAME_INVALIDC', parameters }));
    };

    const playGame = games.find(x => x[title])?.[title];
    parameters.assign({ '%TITLE%': title });

    if (!playGame){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'GAME_NOTPLAYABL', parameters }));
    };

    if (message.author.socialcmds.get(title) > Date.now()){
      const format   = `h [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}] s [${DICT['SECOND(S)']}]`;
      const duration = moment.duration(message.author.socialcmds.get(title) - Date.now()).format(format);
      parameters.assign({ '%DURATION%': duration });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'GAME_ONCOOLDOWN', parameters }));
    };

    message.author.socialcmds.set(title, Date.now() + Math.floor(Math.random() * 72e5) + 36e5);
    message.author.playing = true;

    return await playGame({ message, title, args, document, language, parameters });
  }
};
