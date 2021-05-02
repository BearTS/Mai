const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'bal',
  description      : 'Check your wallet, how much have you earned?',
  aliases          : [ 'balance', 'credits' ],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  guildOnly        : true,
  rankcommand      : false,
  requiresDatabase : true,
  group            : 'social',
  parameters       : [ 'User Mention/ID' ],
  examples         : [ 'bal', 'balance', 'credits' ],
  run              : async (message, language) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const document   = message.author.profile || await profile.findById(message.author.id) || new profile({ _id: message.author.id });

    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    const dailyUsed = document.data.economy.streak.timestamp !== 0 && document.data.economy.streak.timestamp - Date.now() > 0;
    const cur       = document.data.economy.streak.current % 10;
    const left      = 10 - cur === 10 ? 0 : 10 - cur ;
    const active    = '<:activebunny:810775516641493002>';
    const inactive  = '<:inactivebunny:810775684150198292>';

    return message.channel.send(
      new MessageEmbed()
      .setColor(0xe620a4)
      .setAuthor(language.get({ '$in': 'COMMANDS', id: 'BAL_VIEW', parameters }))
      .setThumbnail(message.author.displayAvatarURL({dynamic: 'true'}))
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'BAL_EMBED_FOOT'})} | \©️${new Date().getFullYear()} Mai`)
      .setDescription(
        `${language.get({ '$in': 'COMMANDS', id: 'BAL_EMBED_DESC', parameters: parameters.assign({
          '%EMOJI%'          : '💰',
          '%BAL%'            : message.client.services.UTIL.NUMBER.separate(document.data.economy.bank || 0),
          '%STREAK%'         : document.data.economy.streak.current,
          '%BEST_STREAK%'    : document.data.economy.streak.alltime,
          '%STREAK_REQUIRED%': 10 - document.data.economy.streak.current % 10,
          '%BUNNY_METER%'    : left === 0 ? dailyUsed ? active.repeat(10) : inactive.repeat(10) : active.repeat(cur || 10) + inactive.repeat(left),
          '%TOP_GG%'         : `https://top.gg/bot/${message.client.user.id}/vote`
        })})}\n${language.get({ '$in': 'COMMANDS', id: `BAL_${dailyUsed ? 'CLAIMED' : 'AVAILABLE'}`, parameters })}`
      )
    );
  }
};
