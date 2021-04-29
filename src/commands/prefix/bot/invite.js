module.exports = {
  name             : 'invite',
  description      : 'Gives you the invite link.',
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
  run              : async (message, language, args) => message.reply(language.get({ '$in': 'COMMANDS', id: 'INVITE_SEND' }))
};
