const moment = require('moment');

module.exports = {
  name             : 'setbirthday',
  description      : 'Sets the profile birthday for your profile card.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : false,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'Date <DD-MM format>' ],
  examples         : [ 'setbirthday 02-12' ],
  run              : async (message, language, [date]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });

    if (!date){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETBIRTHDAY_XDT', parameters }));
    };

    date = moment(date, 'DD-MM');

    if (!date.isValid()){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETBIRTHDAY_VDT', parameters }));
    };

    const document = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    document.data.profile.birthday = date.format('Do MMMM');

    return document.save()
    .then(document => {
      message.author.profile = document;
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'SETBIRTHDAY_SCS', parameters: parameters.assign({ '%DAY%': date.format('Do MMMM')}) }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
