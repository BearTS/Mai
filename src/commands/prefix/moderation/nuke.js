const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'nuke',
  description      : 'Removes all messages in the channel (Deletes the old channel and makes a copy of it with permissions intact)',
  aliases          : [ 'clearall' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_CHANNELS                        ],
  permissions      : [ FLAGS.MANAGE_CHANNELS, FLAGS.MANAGE_MESSAGES ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention | ID' ],
  examples         : [ 'nuke','clearall'   ],
  run              : async (message, language) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });

    const proceed = await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'NUKE_ASKCONFIRM', parameters }))
    .then(() => {
      const choices = ['y', 'yes', 'n', 'no'];
      const filter  = _message => message.author.id === _message.author.id && choices.includes(_message.content.toLowerCase());
      const options = { max: 1, time: 30000, errors: ['time'] };
      return message.channel.awaitMessages(filter, options)
    }).then((c) => ['y','yes'].includes(c.first().content.toLowerCase()) ? true : false)
      .catch(() => false);

    if (!proceed){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'NUKE_CANCELLED', parameters }));
    };

    return message.channel.clone()
    .then(channel => channel.send(language.get({ '$in': 'COMMANDS', id: 'NUKE_SUCCESS', parameters })))
    .then(()      => message.channel.delete())
    .catch(error  => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'NUKE_FAILED' , parameters: parameters.assign({ '%ERROR%': error.message })})));
  }
};
