const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'resetch',
  description      : 'Removes all permission overwrites and resets @everyone permissions to `unset`',
  aliases          : [ 'resetchannel' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_CHANNELS ],
  permissions      : [ FLAGS.MANAGE_CHANNELS ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [ 'resetchannel', 'resetch' ],
  run              : async (message, language, args) => message.channel.overwritePermissions([
    { id: message.guild.roles.everyone.id }
  ])
  .then(channel => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETCH_SUCCESS' })))
  .catch(err    => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETCH_FAILED', parameters:{ '%ERROR%': err.message}})))
};
