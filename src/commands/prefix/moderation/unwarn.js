const { Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'unwarn',
  description      : 'Remove/clear warning logs from a user.',
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
  run              : async (message, language, [user, ...ids]) => {
    const parameters = new language.Parameter({
      '%AUTHOR%': message.author.tag,
    });

    if (!user || !user.match(/\d{17,19}/)?.[0]){
      const response = language.get({ '$in': 'COMMANDS', id: '__ARGS_NOUSER', parameters });
      return message.channel.send(response);
    };

    user = await message.guild.members.fetch(user.match(/\d{17,19}/)[0])
    .then(member => member.user).catch(()=>{});

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

    if (!ids.length){
      const response = language.get({ '$in': 'COMMANDS', id: 'UNWARN_NO_IDS', parameters });
      return message.channel.send(response);
    };

    return message.client.database['Profile'].findById(user.id, (err,doc) => {
      if (err){
        parameters.assign({ '%ERROR%': err.message });
        const response = language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters });
        return message.channel.send(response);
      };

      if (!doc){
        doc = new message.client.database['Profile']({ _id: user.id });
      };

      let deleted = [];
      const infractions = [...doc.data.infractions.warn.filter(x => x.guild === message.guild.id)];

      if (!infractions){
        parameters.assign({ '%USER%': user.tag });
        const response = language.get({ '$in': 'COMMANDS', id: 'UNWARN_NO_INFRA', parameters });
        return message.channel.send(response);
      };

      if (ids[0].toLowerCase() === 'clear'){
        for (const todelete of infractions){
          const index = doc.data.infractions.warn.findIndex(x => x.id === todelete.id);
          if (index < 0) continue;
          deleted.push(doc.data.infractions.warn.splice(index, 1));
        };
      } else {
        for (const id of ids){
          const index = doc.data.infractions.warn.findIndex(x => x.id === id);
          if (index < 0 || doc.data.infractions.warn.find(x => x.id === id).guild !== message.guild.id) continue;
          deleted.push(doc.data.infractions.warn.splice(index, 1));
        };
      };

      if (!deleted.length){
        const response = language.get({ '$in': 'COMMANDS', id: 'UNWARN_NO_ID_MA', parameters });
        return message.channel.send(response);
      };

      doc.save()
      .then(() => {
        user.profile = doc;
        parameters.assign({ "%USER%": user.tag });
        const cleared = infractions.length === deleted.length;
        const id = cleared ? 'UNWARN_SUCCESS2' : "UNWARN_SUCCESS";
        return message.channel.send(language.get({'$in': 'COMMANDS', id, parameters }));
      })
      .catch(err => {
        parameters.assign({ '%ERROR%': err.message });
        const response = language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters });
        return message.channel.send(response);
      });
    });
  }
};
