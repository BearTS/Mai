const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'hackban',
  description      : 'Bans a user even if they are not in the server. This is a bruteforce method and will not provide a warn-before-ban confirmation and will bypass all server/based permissions.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.BAN_MEMBERS                      ],
  permissions      : [ FLAGS.BAN_MEMBERS, FLAGS.ADMINISTRATOR ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User ID', 'Ban Reason' ],
  examples         : [ 'hackban 7823713678123123123', 'hackban 2345678765423567817 not following discord tos' ],
  run              : (message, language, [user = '', ...reason]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%GUILD%': message.guild.name });
          user       = user.match(/\d{17,19}/)?.[0] || null;
          reason     = reason.join(' ') || 'unspecified';
          language   = message.client.services.LANGUAGE.getCommand('ban', message.author.profile?.data.language || 'en-us');

    if (!user){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_NO_USER'     , parameters }));
    };

    if (user === message.guild.owner.id){
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'BAN_IS_SV_OWNER', parameters }));
    };

    return message.guild.members.ban(user,  { reason: `MAI Hackban Command: ${message.author.tag}: ${reason}`})
    .then(_user => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BAN_SUCCESS', parameters: parameters.assign({ '%MEMBER%': _user.user?.tag || _user.tag || user })})))
    .catch(err  => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'BAN_FAILED',  parameters: parameters.assign({ '%MEMBER%': user, '%ERROR%': err.message }) })))
    .finally(() => !message.deleted ? message.delete() : null);
  }
};
