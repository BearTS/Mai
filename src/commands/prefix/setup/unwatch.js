const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

module.exports = {
  name             : 'unwatch',
  description      : 'Removes a watched anime from your watchlist.',
  aliases          : [ 'anischedremove', 'anischedunwatch' ],
  cooldown         : { time: 1e3 },
  clientPermissions: [ /*DEBUGGER_MODE. NO_PERMISSION_REQUIRED*/ /*FLAGS.MANAGE_GUILD*/ ],
  permissions      : [],
  group            : 'setup',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  parameters       : [ 'Anilist/Mal link | releasing | not-yet-released | all' ],
  examples         : [ 'unwatch https://myanimelist.net/anime/45678', 'unwatch all' ],
  run              : async (message, language, links) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const document = await message.client.database.GuildWatchlist.findById(message.guild.id) || new message.client.database.GuildWatchlist({ _id: message.guild.id });

    document.data = []
    await document.save();

    return message.reply('DEBUGGER_MODE: THE LIST HAS BEEN EMPTIED!')
  }
};
