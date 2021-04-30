module.exports = {
  name             : 'reverse',
  description      : 'Reverses the supplied text.',
  aliases          : [ 'esrever' ],
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
  parameters       : [ 'Text to reverse' ],
  examples         : [ 'reverse This text will be reversed.' ],
  run              : (message, language, args) => message.channel.send(args.join(' ').split('').reverse().join(' ') || language.get({ '$in': 'COMMANDS', id: 'REVERSE_NOTEXT' }))
};
