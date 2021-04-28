const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'lockdown',
  description      : '[Prevent/Allow] users from sending messages in the current channel. Note that all Permission Overwrites will be lost.',
  aliases          : [ 'lock', 'ld', 'lockchannel' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_CHANNELS                        ],
  permissions      : [ FLAGS.MANAGE_MESSAGES, FLAGS.MANAGE_CHANNELS ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [  'lockdown', 'lock', 'ld', 'lockchannel' ],
  run              : async (message, language) => message.channel.overwritePermissions([
    {
      id   : message.guild.roles.everyone.id,
      deny : [ FLAGS.SEND_MESSAGES ].slice(Number(!message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES'))),
      allow: [ FLAGS.SEND_MESSAGES ].slice(Number(message.channel.permissionsFor(message.guild.roles.everyone).has('SEND_MESSAGES')))
    },{
      id   : message.guild.me.id,
      allow: [ FLAGS.SEND_MESSAGES ]
    }
  ])
  .then(channel => {
    if (channel.permissionsFor(message.guild.roles.everyone).has(FLAGS.SEND_MESSAGES)){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LOCKDOWN_END'    }));
    } else {
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LOCKDOWN_START'  }));
    };
  })
  .catch(error  => {
    if (channel.permissionsFor(message.guild.roles.everyone).has(FLAGS.SEND_MESSAGES)){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LOCKDOWN_F_STAR' }));
    } else {
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LOCKDOWN_F_END'  }));
    };
  }).finally(() => {
    if (!message.deleted) { message.delete() };
  })
};
