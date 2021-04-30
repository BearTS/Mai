module.exports = {
  name             : 'roll',
  description      : 'Generate a random number from 1-[selected number].',
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
  parameters       : [ 'Upper limit of the number' ],
  examples         : [  'roll 10', 'roll 100', 'roll 1234567' ],
  run              : async (message, language, [tail]) => {

    const result     = Math.ceil(Math.random() * tail || Math.random() * 100);
    const { NUMBER } = message.client.services.UTIL;

    return message.reply(`**${NUMBER.separate(result)}**`);
  }
};
