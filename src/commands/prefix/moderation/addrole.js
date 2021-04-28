const { Permissions: { FLAGS }, Collection } = require('discord.js');

module.exports = {
  name             : 'addrole',
  description      : 'Adds the mentioned role(s) and/or supplied role IDs to the mentioned user',
  aliases          : [ 'addroles' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.MANAGE_ROLES ],
  permissions      : [ FLAGS.MANAGE_ROLES ],
  group            : 'moderation',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Image URL', 'Emoji Name', 'image upload' ],
  examples         : [ 'addroles @user @role1 @role2 @role3', 'addrole @user @role' ],
  run              : async (message, language, args) => {

    const parameters  = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const DICT        = language.getDictionary([ 'you', 'yourself' ]);

    if (!args.join(' ').match(/\d{17,19}/g)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_NOARGS', parameters }));
    };

    const roles        = new Collection([ ...(args.join(' ').match(/\d{17,19}/g)||[])].map(x => [x, message.guild.roles.cache.get(x)])).filter(x => !!x);
    const userID       = (args.join(' ').match(/\d{17,19}/g)||[]).filter(id => !roles.has(id) && !message.guild.channels.cache.has(id) && message.guild.id !== id)[0];
    const member       = userID ? await message.guild.members.fetch({ user: userID }).catch(() => null) : null;

    if (member === null){     // No mentioned users / User ID
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_NOMEMBR', parameters }));
    };

    parameters.assign({ '%MEMBER%': message.author.id == member.id ? DICT.YOURSELF.toLowerCase() : member.user.tag });
    const missingRoles = roles.filter(role => !member.roles.cache.has(role.id));
    const rolesfrmembr = missingRoles.filter(role => role.position < message.member.roles.highest.position || message.member.id == message.guild.owner.id);
    const rolesToAdd   = rolesfrmembr.filter(role => role.position < message.guild.me.roles.highest.position);
    const reason       = args.filter(x => !x.match(/\d{17,19}/)).join(' ') || 'Command addrole from Mai invoked by ' + message.author.tag;

    if (!roles.size){         // No mentioned roles / Role ID(s)
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_NOROLES', parameters }));
    };

    if (!missingRoles.size){  // Member already has all mentioned role(s) / Role ID(s)
      parameters.assign({ '%MEMBER%': message.author.id == member.id ? DICT.YOU.toLowerCase() : member.user.tag });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_NMSSROL', parameters }));
    };

    if (!rolesfrmembr.size){  // All roles mentioned are hihger than the user who invoked the command
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_HTMEMRL', parameters }));
    };

    if (!rolesToAdd.size){    // All roles mentioned are higher than the bot's
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_NRTOADD', parameters }));
    };

    const incomplete = language.get({ '$in': 'COMMANDS', id: 'ADDROLE_INCOMPL' });
    parameters.assign({ '%INCOMPLETE%': missingRoles.size === rolesToAdd.size ? '' : incomplete });

    const  size = member.roles.cache.size;
    return member.roles.add(rolesToAdd)
    .then(mem  => message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_SUCCESS', parameters: parameters.assign({ '%ROLES_SIZE%': mem.roles.cache.size - size }) })))
    .catch(err => message.reply(language.get({ '$in': 'COMMANDS', id: 'ADDROLE_FAILED' , parameters: parameters.assign({ '%ERROR%': err.message}) })));
  }
};
