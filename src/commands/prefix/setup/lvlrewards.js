const { MessageEmbed, Permissions: { FLAGS } } = require('discord.js');

module.exports = {
  name             : 'lvlrewards',
  description      : 'Set/Remove role rewards for specific levels.',
  aliases          : [],
  cooldown         : { time: 1e3 },
  clientPermissions: [],
  permissions      : [],
  group            : 'setup',
  parameters       : [],
  examples         : [],
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  run              : async (message, language, args) => {

    if (!args.length){
      if (message.guild.profile === null){
        await message.guild.loadProfile()
      };
      const DICT        = language.getDictionary(['level']);
      const doc         = message.guild.profile;
      const permissions = message.guild.me.permissions.has(FLAGS.MANAGE_ROLES);
      const strmessage  = permissions ? '' : language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_V_PR' });
      const rewards     = [...doc.xp.rewards].sort((A,B) => A.level - B.level).map(x => `**${DICT.LEVEL} ${x.level}** - <@&${x.id}>`);
      const parameters  = new language.Parameter({ '%REWARDS%': rewards.join('\n') || '- -' });
      const embed       = new MessageEmbed()
      .setColor      ( 0xe620a4 )
      .setAuthor     ( message.guild.name )
      .setDescription( language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_VIEW', parameters }) )
      .setThumbnail  ( message.guild.iconURL({ format:'png', dynamic: true }) )
      .setFooter     ( `${language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_E_FO' })}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai` );
      return message.channel.send(strmessage, embed);
    };

    const type       = args.shift().toLowerCase();
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%TYPE%': type });
    let match;

    if (!['set', 'remove'].includes(type)){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_TYPE', parameters }));
    };

    if (!message.channel.permissionsFor(message.member).has(FLAGS.MANAGE_GUILD)){
      return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_U_PR', parameters }));
    };

    if (type === 'set'){
      match = args.join(' ').match(/(\d{1,}\s*-\s*(<@&)?\d{17,19})/g);
      if (match === null){
        parameters.assign({ '%PREFIX%': message.client.prefix, '%COMMAND%': 'lvlrewards'});
        return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_NOMA', parameters }));
      };
      match = match.map(x => [x.split('-')[0].trim(), x.split('-')[1].match(/\d{17,19}/)[0]]);
      for (const [lvl, id] of [...match]){
        if (!message.guild.roles.cache.has(id)){
          match.splice(match.findIndex(([_, ID]) => ID === id), 1);
        };
      };
      if (!match.length){
        return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_INID', parameters }));
      };
    };

    if (type === 'remove'){
      match = [...new Set(args.join(' ').match(/(\d{1,})/g))];
      if (!match.length){
        return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_NOLV', parameters }));
      };
    };

    return message.client.database['GuildProfile'].findById(message.guild.id, async (err, doc) => {
      if (err){
        parameters.assign({ '%ERROR%': err.message });
        return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters}));
      };

      if (!doc){
        doc = new message.client.database['GuildProfile']({ _id: message.guild.id });
      };

      if (type === 'set'){
        for (let [level, roleID] of match){
          level = Number(level);
          if (doc.xp.rewards.some(x => x.level == level)){
            doc.xp.rewards.splice(doc.xp.rewards.findIndex(y => y.level == level), 1, { level, id: roleID });
          } else {
            doc.xp.rewards.push({ level, id: roleID });
          };
        };
      };

      if (type === 'remove'){
        for (let level of match){
          level = Number(level);
          if (doc.xp.rewards.some(x => x.level == level)){
            doc.xp.rewards.splice(doc.xp.rewards.findIndex(y => y.level === level), 1);
          };
        };
      };

      return doc.save()
      .then(() => {
        message.guild.profile = doc;
        const rewards         = doc.xp.rewards.map(({ level, id }) => `${level} - <@&${id}>`).join('\n');
        return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'LVLREWARDS_SCSS', parameters: parameters.assign({ '%REWARDS%': rewards || '[ - ]' }) }));
      })
      .catch(err => {
        return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters: parameters.assign({ '%ERROR%': err.message })}));
      });
    });
  }
};
