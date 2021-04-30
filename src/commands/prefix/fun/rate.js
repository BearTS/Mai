module.exports = {
  name             : 'rate',
  description      : 'Rates the provided argument.',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [],
  permissions      : [],
  group            : 'fun',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'Something to rate with' ],
  examples         : [ 'rate Potato', 'rate cheese', 'rate Bringles' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    if (!args.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'RATE_NOARGS', parameters }));
    };
    const rating = parseInt(args.join('').replace(/[^\w]/g, '1202'), 32) % 101;
    const emoji  = '\\❤️'.repeat(Math.floor(rating/10)) + '\\🖤'.repeat(10 - Math.floor(rating/10));
    return message.channel.send(`${emoji} (**${rating}**) %`);
  }
};
