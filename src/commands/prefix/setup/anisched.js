const { Permissions: { FLAGS } } = require('discord.js');

module.exports = {
  name             : 'anisched',
  description      : 'Set/Disable AniSched entry announcements channel.',
  aliases          : [ 'anischedule' ],
  cooldown         : { time: 1e3 },
  clientPermissions: [ FLAGS.MANAGE_GUILD ],
  permissions      : [],
  group            : 'setup',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  parameters       : [ 'action type', 'ID' ],
  examples         : [ 'anisched set <channel ID>', 'anisched disable' ],
  run              : async (message, language, [actiontype = '', id = '']) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const document   = await message.client.database.GuildWatchlist.findById(message.guild.id) || new message.client.database.GuildWatchlist({ _id: message.guild.id });
    let channel, hasPerms;

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    if (!actiontype){
      parameters.assign({ '%CHANNEL%': message.guild.channels.cache.get(document?.channelID)?.toString() });
      return message.reply(language.get({ '$in': 'COMMANDS', id: `ANISCHED_${document?.channelID ? 'WT' : 'NO'}CHAN`, parameters }));
    };

    if (!message.member.permissions.has(FLAGS.MANAGE_GUILD)){
      const path       = [ 'SYSTEM', 'PERM_DISCOUSER' ];
      const language   = message.author.profile?.data.language || 'en-us';
      parameters.assign({ '%PERMISSIONS%': 'Manage Guild' });
      return message.reply(message.client.services.LANGUAGE.get({ path, language, parameters }));
    };

    if (!['set', 'disable'].includes(actiontype.toLowerCase())){
      parameters.assign({ '%TYPE%': actiontype, '%TYPES%': 'set, disable' });
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'ANISCHED_INVATP', parameters }));
    };

    if (actiontype.toLowerCase() === 'set'){
      channel = id.match(/\d{17,19}/)?.[0];
      if (!channel || !(channel = message.guild.channels.cache.get(channel))){
        return message.reply(language.get({'$in': 'COMMANDS', id: 'ANISCHED_NOCHN', parameters }));
      };
      if (!['text', 'news'].includes(channel.type)){
        parameters.assign({ '%CHANNEL%': channel.tostring() });
        return message.reply(language.get({'$in': 'COMMANDS', id: 'ANISCHED_INVCHN', parameters }));
      };
      document.channelID = channel.id;
      hasPerms = channel.permissionsFor(message.guild.me).has([FLAGS.SEND_MESSAGES, FLAGS.EMBED_LINKS, FLAGS.VIEW_CHANNEL ]);
    };

    if (actiontype.toLowerCase() === 'disable'){
      document.channelID = null;
    };

    document.save()
    .then(() => {
      const disabled = document.channelID === null;
      parameters.assign({ '%CHANNEL%': channel?.toString(), '%ADD%': hasPerms ? '' : '\n' + language.get({ '$in': 'COMMANDS', id: 'ANISCHED_S_NPRM' })});
      return message.reply(language.get({'$in': 'COMMANDS', id: `ANISCHED_S_${disabled ? 'DABL' : 'EABL'}`, parameters }));
    })
    .catch(err => {
      parameters.assign({ '%ERROR%': err.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    });
  }
};
