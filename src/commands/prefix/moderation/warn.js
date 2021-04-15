module.exports = {
  name: 'warn',
  description: 'Warn users in your server.',
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
  run: async (message, language, [user, ...reason ]) => {
    if (!user || !user.match(/\d{17,19}/)?.[0]){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_USER', parameters }));
    };

    user = await message.guild.members.fetch(user.match(/\d{17,19}/)[0]).then(member => member.user).catch(()=>{});
    reason = reason.join(' ') || 'No Reason';

    if (!user){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'NO_USER', parameters }));
    };

    if (user.bot){
      const parameters = { '%AUTHOR%': message.author.tag };
      return message.channel.send(language.get({ id: 'BOT_USER', parameters }));
    };

    return message.client.database['Profile'].findById(user.id, (err, doc) => {
      if (err){
        const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
        return message.channel.send(language.get({ id: 'DB_ERROR', parameters }));
      };
      if (!doc){
        doc = new message.client.database['Profile']({ _id: user.id });
      };
      doc.data.infractions.warn.push({ id: Date.now().toString(), reason, executor: message.author.id, guild: message.guild.id });

      doc.save()
      .then(() => {
        user.profile = doc;
        const parameters = { '%AUTHOR%': message.author.tag, '%USER%': user.toString(), '%REASON%': reason };
        return message.channel.send(language.get({ id: 'SUCCESS', parameters }));
      })
      .catch(err => {
        const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
        return message.channel.send(language.get({ id: 'FAIL_ON_SAVE', parameters}))
      })
    });
  }
};
