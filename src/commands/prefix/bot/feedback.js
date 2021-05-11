module.exports = {
  name             : 'feedback',
  description      : 'Sends support message to this bot\'s owner (Sakurajimai#6742).',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  group            : 'bot',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Feedback Message' ],
  examples         : [ 'feedback this command is not working bla bla..' ],
  run              : async (message, language, args) => message.reply(language.get({ '$in': 'COMMANDS', id: 'FEEDBACK_SEND', parameters: { '%AUTHOR%': message.author.tag }}))
};
