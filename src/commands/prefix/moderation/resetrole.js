const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'resetrole',
  description      : 'Removes **all** custom roles from a user. (@everyone will be excluded)',
  aliases          : [ 'resetroles', 'removeroles', 'removerole', 'purgerole' ],
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
  parameters       : [ 'User Mention | ID' ],
  examples         : [ 'resetroles @user', 'resetrole 7283746571920016374' ],
  run              : async (message, language, [member='', ...args]) => {

    const parameters  = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const force       = Boolean(args.join(' ').match(/-f/i));
    let   proceed     = force ? true : false;

    if (!member.match(/\d{17,19}/g)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_NOARG', parameters }));
    };

    member = await message.guild.members.fetch(member.match(/\d{17,19}/g)[0]).catch(()=> null);

    if (member === null){     // No mentioned users / User ID
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_NOMEM', parameters }));
    };

    parameters.assign({ '%MEMBER%': message.author.id == member.id ? DICT.YOURSELF.toLowerCase() : member.user.tag });

    if (member.id === message.client.user.id){
     return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_IS_ME', parameters }));
   };

    if (member.user.bot){
     return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_IS_BT', parameters }));
   };

    if (message.member.id === member.id){
     return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_ISSLF', parameters }));
   };

    if (message.member.roles.highest.position < member.roles.highest.position){
     return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_ROLEC', parameters }));
   };

    if (!Boolean(member.roles.cache.size - 1)){
     return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_NORLE', parameters }));
   };

   if (!force){
     parameters.assign({ '%TIP%': language.get({ '$in': 'COMMANDS', id: 'RESETROLE_INF', parameters })})
     proceed = await message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_ACFM', parameters })).then(() => {
       const choices = ['y', 'yes', 'n', 'no'];
       const filter  = _message => message.author.id === _message.author.id && choices.includes(_message.content.toLowerCase());
       const options = { max: 1, time: 30000, errors: ['time'] };
       return message.channel.awaitMessages(filter, options)
       .then((c) => ['y','yes'].includes(c.first().content.toLowerCase()) ? true : false)
       .catch(() => false);
     });
   };

   if (!proceed){
     return message.reply(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_CANCL', parameters }));
   };

   parameters.assign({ '%PREVCOUNT%': member.roles.cache.size - 1 });

   return member.roles.set([])
  .then(member => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_SUCCE', parameters })))
  .catch(error => message.channel.send(language.get({ '$in': 'COMMANDS', id: 'RESETROLE_FAILE', parameters })));
  }
};
