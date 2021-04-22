const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'warn',
  description      : 'Warn users in your server.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [ FLAGS.MANAGE_GUILD ],
  group            : 'setup',
  parameters       : [],
  examples         : [],
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  run              : async (message, language, [user, ...reason ]) => {
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
    });

    if (!user || !user.match(/\d{17,19}/)?.[0]){
      const response = language.get({ '$in': 'COMMANDS', id: '__ARGS_NOUSER', parameters });
      return message.channel.send(response);
    };

    user = await message.guild.members.fetch(user.match(/\d{17,19}/)[0]).then(member => member.user).catch(()=>{});
    reason = reason.join(' ') || 'No Reason';

    if (!user){
      const response = language.get({ '$in': 'COMMANDS', id: '__ARGS_NOUSER', parameters });
      return message.channel.send(response);
    };

    if (user.bot){
      const response = language.get({ '$in': 'COMMANDS', id: '__GLOB_WA_ISBOT', parameters });
      return message.channel.send(response);
    };

    if (user.id === message.author.id){
      const response = language.get({ '$in': 'COMMANDS', id: '__GLOB_WA_ISELF', parameters });
      return message.channel.send(response);
    };

    return message.client.database['Profile'].findById(user.id, (err, doc) => {
      if (err){
        parameters.append({ '%ERROR%': err.message });
        const response = language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters });
        return message.channel.send(response);
      };

      if (!doc){
        doc = new message.client.database['Profile']({ _id: user.id });
      };

      doc.data.infractions.warn.push({
        id: Date.now().toString(),
        reason,
        executor: message.author.id,
        guild: message.guild.id
      });

      doc.save()
      .then(() => {
        user.profile = doc;
        parameters.assign({ '%USER%': user.toString(), '%REASON%': reason });
        return message.channel.send(language.get({'$in':'COMMANDS', id: 'WARN_SUCCESS', parameters }));
      })
      .catch(err => {
        parameters.assign({ '%ERROR%': err.message });
        const response = language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters });
        return message.channel.send(response);
      });
    });
  }
};
