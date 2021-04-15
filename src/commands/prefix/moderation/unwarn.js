module.exports = {
  name: 'unwarn',
  description: 'Remove/clear warning logs from a user.',
  aliases: [],
  cooldown: null,
  clientPermissions: [ ],
  permissions: [ 'MANAGE_GUILD' ],
  group: 'setup',
  parameters: [ ],
  examples: [ ],
  guildOnly: true,
  ownerOnly: false,
  adminOnly: false,
  nsfw: false,
  requiresDatabase: true,
  rankcommand: false,
  run: async (message, language, [user, ...ids]) => {
    if (!user || !user.match(/\d{17,19}/)?.[0]){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_USER', parameters }));
    };

    if (!ids.length){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_IDS', parameters }));
    };

    user = await message.guild.members.fetch(user.match(/\d{17,19}/)[0]).then(member => member.user).catch(()=>{});

    if (!user){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_USER', parameters }));
    };

    if (user.bot){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'BOT_USER', parameters }));
    };

    return message.client.database['Profile'].findById(user.id, (err,doc) => {
      if (err){
        const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
        return message.channel.send(language.get({ id: 'DB_ERROR', parameters }));
      };
      if (!doc){
        doc = new message.client.database['Profile']({ _id: user.id });
      };

      let deleted = [];
      const infractions = [...doc.data.infractions.warn.filter(x => x.guild === message.guild.id)];

      if (!infractions){
        const parameters = { '%AUTHOR%': message.author.tag, '%USER%': user.tag };
        return message.channel.send(language.get({id: 'NO_INFRACTIONS', parameters }));
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
        const parameters = { '%AUTHOR%': message.author.tag }
        return message.channel.send(language.get({ id: "NO_ID_MATCH", parameters }));
      };

      doc.save()
      .then(() => {
        user.profile = doc;
        const cleared = infractions.length === deleted.length;
        const parameters = { '%AUTHOR%': message.author.tag, "%USER%": user.tag };
        const id = cleared ? 'SUCCESS_CLEAR' : "SUCCESS";
        return message.channel.send(language.get({ id, parameters }))
      })
      .catch(() => {
        const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
        return message.channel.send(language.get({ id: 'FAIL_ON_SAVE', parameters }));
      });
    });
  }
};
