const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');

module.exports = {
  name: 'lvlrewards',
  description: 'Set/Remove role rewards for specific levels.',
  aliases: [],
  cooldown: null,
  clientPermissions: [ ],
  permissions: [ ],
  group: 'setup',
  parameters: [],
  examples: [],
  guildOnly: true,
  ownerOnly: false,
  adminOnly: false,
  nsfw: false,
  requiresDatabase: true,
  rankcommand: false,
  run: async (message, language, args) => {

    if (!args.length){
      if (message.guild.profile === null){
        await message.guild.loadProfile()
      };
      const doc = message.guild.profile;
      const permissions = message.guild.me.permissions.has(FLAGS.MANAGE_ROLES);
      const strmessage = permissions ? '' : language.get({ id: 'CLIENTPERMMSNG' });
      const embed = new MessageEmbed().setColor('GREY').setThumbnail(message.guild.iconURL({ format:'png', dynamic: true })).setAuthor(message.guild.name)
      .setDescription(language.get({ id: 'VIEW_REWARDS', parameters: {'%REWARDS%': doc.xp.rewards.map(x => `**Level ${x.level}** - <@&${x.id}>`).join('\n') || '- -' }}))
      .setFooter(`Level Rewards\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`);
      return message.channel.send(strmessage, embed);
    };

    const type = args.shift().toLowerCase();
    let match;

    if (!['set', 'remove'].includes(type)){
      const parameters = { '%AUTHOR%': message.author.tag, '%TYPE%': type };
      return message.channel.send(language.get({ id: 'INVALID_TYPE', parameters }));
    };

    if (!message.channel.permissionsFor(message.guild.me).has(FLAGS.MANAGE_GUILD)){
      return message.channel.send(language.get({ id: 'MISSING_PERM' }));
    };

    if (type === 'set'){
      match = args.join(' ').match(/(\d{1,}\s*-\s*(<@&)?\d{17,19})/g);
      if (match === null){
        const parameters = { '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix, '%COMMAND%': 'lvlrewards', '%TYPE%': type };
        return message.channel.send(language.get({ id: 'NO_MATCH', parameters }))
      };
      match = match.map(x => [x.split('-')[0].trim(), x.split('-')[1].match(/\d{17,19}/)[0]]);
      for (const [lvl, id] of [...match]){
        if (!message.guild.roles.cache.has(id)){
          match.splice(match.findIndex(([_, ID]) => ID === id), 1);
        };
      };
      if (!match.length){
        const parameters = { '%AUTHOR%': message.author.tag };
        return message.channel.send(language.get({ id: 'INVALID_ID', parameters }))
      };
    };

    if (type === 'remove'){
      match = [...new Set(args.join(' ').match(/(\d{1,})/g))];
      if (!match.length){
        const parameters = { '%AUTHOR%': message.author.tag }
        return message.channel.send(language.get({ id: 'NO_LEVEL', parameters }))
      };
    };

    return message.client.database['GuildProfile'].findById(message.guild.id, async (err, doc) => {
      if (err){
        const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
        return message.channel.send(language.get({ id: 'DB_ERROR', parameters}));
      };

      if (!doc){
        doc = new message.client.database['GuildProfile']({ _id: message.guild.id });
      };

      if (type === 'set'){
        for (const [level, roleID] of match){
          if (doc.xp.rewards.some(x => x.level === level)){
            doc.xp.rewards.splice(doc.xp.rewards.findIndex(y => y.level === level), 1, { level, id: roleID });
          } else {
            doc.xp.rewards.push({ level, id: roleID });
          };
        };
      };

      if (type === 'remove'){
        for (const level of match){
          if (doc.xp.rewards.some(x => x.level === level)){
            doc.xp.rewards.splice(doc.xp.rewards.findIndex(y => y.level === level), 1);
          };
        };
      };

      return doc.save()
      .then(() => {
        message.guild.profile = doc;
        const rewards = doc.xp.rewards.map(({ level, id }) => `${level} - <@&${id}>`).join('\n');
        const parameters = { '%AUTHOR%': message.author.tag, '%REWARDS%': rewards || '[ - ]' };
        return message.channel.send(language.get({ id: 'SUCCESS', parameters }));
      })
      .catch(err => {
        const parameters = { '%AUTHOR%': message.author.tag, '%ERROR_NAME%': err.message };
        return message.channel.send(language.get({ id: 'FAIL_ON_SAVE', parameters }));
      });
    });
  }
};
