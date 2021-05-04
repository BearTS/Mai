const moment = require('moment');

module.exports = {
  name             : 'tip',
  description      : 'Give tip to your friends!',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  guildOnly        : true,
  rankcommand      : true,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'User Mention/ID' ],
  examples         : [  'tip @user', 'tip 78374756574839348' ],
  run              : async (message, language, [member = '']) => {

    const profileDB  = message.client.database.Profile;
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const tipper     = message.author.profile || await profileDB.findById(message.author.id).catch(err => err) || new profileDB({ _id: message.author.id.id });
    // When the database returns an error instead of a document
    if (tipper instanceof Error){
      parameters.assign({ '%ERROR%': tipper.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };
    // When the tipper has already used his tip for the last 12 hours
    if (tipper.data.tips.timestamp !== 0 && tipper.data.tips.timestamp - Date.now() > 0){
      const DICT = language.getDictionary([ 'hour(s)', 'minute(s)', 'second(s)']);
      parameters.assign({ '%DURATION%': moment.duration(tipper.data.tips.timestamp - Date.now()).format(`H [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}] s [${DICT['SECOND(S)']}]`)});
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TIP_ALREADYGIVN', parameters }));
    };
    // When the tipper didn't include any argument
    if (!member){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TIP_NOMEMBER', parameters }));
    };
    // When the argument provided by the tipper does not match an id
    if (!member.match(/\d{17,18}/)?.[0]){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TIP_INVALIDMEM', parameters }));
    };
    member = await message.guild.members.fetch(member.match(/\d{17,18}/)[0]).catch(() => {});
    // When the argument is not a valid discord user id or the user is not in this server
    if (!member){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TIP_INVALIDMEM', parameters }));
    };
    // When the argument ID resolves to a bot
    if (member.user.bot){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TIP_TIPPEDISBOT', parameters }));
    };
    // When the argument ID resolves to the user himself
    if (member.id === message.author.id){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'TIP_TIPPEDISSLF', parameters }));
    };
    const tipped = member.user.profile || await profileDB.findById(member.id).catch(err => err) || new profileDB({ _id: member.id });
    // When the database returns an error instead of a document
    if (tipped instanceof Error){
      parameters.assign({ '%ERROR%': tipped.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };
    tipper.data.tips.timestamp = Date.now() + 432e5;
    tipper.data.tips.given++;
    tipped.data.tips.received++;
    tipped.data.economy.bank += 300;
    return Promise.all([tipper.save(), tipped.save()])
    .then(() => {
      message.author.profile = tipper;
      member.user.profile = tipped;
      parameters.assign({ '%AMOUNT%': '300', '%MEMBER%': member.user.tag });
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'TIP_SUCCESS', parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
