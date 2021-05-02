const moment = require('moment');

module.exports = {
  name             : 'beg',
  description      : 'Want to earn money some more? Why don\'t you try begging, maybe someone will give you.',
  aliases          : [ 'plead', 'gimme' ],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : false,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [],
  examples         : [],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const profileDB  = message.client.database.Profile;
    const document   = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });
    const DICT       = language.getDictionary([ 'hour(s)', 'minute(s)', 'second(s)']);
    const { NUMBER } = message.client.services.UTIL;

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (message.author.socialcmds.get('beg') > Date.now()){
      const format   = `m [${DICT['MINUTE(S)']}] s [${DICT['SECOND(S)']}]`;
      const duration = moment.duration(message.author.socialcmds.get('beg') - Date.now()).format(format);
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BEG_ON_CD', parameters: parameters.assign({ '%DURATION%': duration }) }));
    };

    const amount = Math.floor(Math.random() * 200) + 100;
    document.data.economy.bank += amount;
    message.author.socialcmds.set('beg', Date.now() + 18e5);

    return document.save()
    .then(document => {
      message.author.profile = document;
      parameters.assign({ '%AMOUNT%': NUMBER.separate(amount) });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BEG_SUCCESS', parameters }));
    })
    .catch(error   => {
      parameters.assign({ '%ERROR%': error.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
