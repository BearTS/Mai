const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

module.exports = {
  name             : 'flip',
  description      : 'Win or Lose, Flip a Coin [Head or Tails].',
  aliases          : [ 'coinflip', 'coin', 'tosscoin', 'tc' ],
  cooldown         : { time: 3e3 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [],
  examples         : [ 'flip head', 'coinflip tail' ],
  run              : async (message, language, [ ht ]) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    if (!ht){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'FLIP_NOCHOICE', parameters }));
    };
    if (!ht.match(/heads*|tails*/i)){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'FLIP_NOCHOICE', parameters }));
    };
    const choice        = ht.match(/head|tail/i)[0].toUpperCase();
    const hasWon        = !!Math.round(Math.random());
    const result        = hasWon ? choice : 'HEADTAIL'.split(choice).filter(Boolean)[0];
    const { WON, LOST } = language.getDictionary(['won', 'lost'])
    parameters.assign({ '%SYMBOL%': hasWon ? '\\✔️' : '\\❌', '%STATUS%': hasWon ? WON : LOST, '%CHOICE%': choice, '%RESULT%': result });
    return message.channel.send(language.get({ '$in': 'COMMANDS', id: 'FLIP_RESULT', parameters }), {
      embed: new MessageEmbed().setImage(`https://images.mai-san.ml/coin/Bronze${hasWon ? '' : 'Back'}128x128.png`)
        .setColor(hasWon ? 'GREEN' : 'RED')
    });
  }
};
