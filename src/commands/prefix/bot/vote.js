const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'vote',
  description      : 'Get the bot\'s various vote links.',
  aliases          : [ "af", "animefact", 'anifact', 'animefacts' ],
  cooldown         : { time: 1e4 },
  clientPermissions: [],
  permissions      : [],
  group            : 'bot',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention / ID' ],
  examples         : [ 'avatar', 'av @user', 'pfp 728394' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({
      '%CLIENT%' : message.client.user.username,
      '%TOP_GG%' : `https://top.gg/bot/${message.client.user.id}/vote`,
      '%DBL%'    : `https://discordbotlist.com/bots/mai-3909/upvote`
    });

    return message.reply(language.get({ '$in': 'COMMANDS', id: 'VOTE_SEND', parameters }));
  }
};
