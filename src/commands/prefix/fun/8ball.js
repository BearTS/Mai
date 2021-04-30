const { join } = require('path');
const badwords = require('bad-words');
const filter   = new badwords();
const filtrstr = require(join(__dirname, '../../..', 'assets/json/filter.json'));

filter.addWords(...filtrstr);

module.exports = {
  name             : '8ball',
  description      : 'Ask anything on the magic 8-ball.',
  aliases          : [ '🎱', '8b', '8-ball', 'eightball' ],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Question answerable by Yes/No' ],
  examples         : [ '8ball is mai a good bot?', '🎱 is FMA worth of it\'s top spot?' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    if (!args.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: '8BALL_NOARGS', parameters }));
    };
    if (filter.isProfane(message.content)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: '8BALL_PROFANE', parameters }));
    };
    return message.reply(language.get({ '$in': 'COMMANDS', id: `8BALL_RESPONS${Math.floor(Math.random() * 20)}`, parameters }));
  }
};
