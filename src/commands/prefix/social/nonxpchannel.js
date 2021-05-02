const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'nonxpchannel',
  description      : 'See which channels do not give xp.',
  aliases          : [ 'nonxpchannels' ],
  cooldown         : { time: 3e3 },
  clientPermissions: [ FLAGS.MANAGE_MESSAGES, FLAGS.EMBED_LINKS, FLAGS.USE_EXTERNAL_EMOJIS ],
  permissions      : [],
  guildOnly        : true,
  rankcommand      : true,
  requiresDatabase : false,
  group            : 'social',
  parameters       : [],
  examples         : [],
  run              : async (message, language) => {

    if (message.guild.profile === null){
      await message.guild.loadProfile();
    };

    let totalch  = message.guild.channels.cache.filter(c => c.send).size;
    let channels = message.guild.profile.xp.exceptions.map(x => client.channels.cache.get(x)?.toString()).filter(Boolean);

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%CHANNELS%': channels.join(', ') });

    if (!channels.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'NONXPCHANNEL_NC', parameters }));
    };

    if (totalch === channels.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'NONXPCHANNEL_AC', parameters  }));
    };

    return message.reply(language.get({ '$in': 'COMMANDS', id: 'NONXPCHANNEL_RC', parameters }));
  }
};
