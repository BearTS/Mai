const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const _ = require('lodash');

module.exports = {
  name             : 'watching',
  description      : 'View list of anime this server is subscribed to.',
  aliases          : [ 'watchlist', 'list' ],
  cooldown         : { time: 0 },
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.MANAGE_MESSAGES ],
  permissions      : [],
  group            : 'core',
  guildOnly        : true ,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true ,
  rankcommand      : false,
  parameters       : [],
  examples         : [ 'watching', 'watchlist', 'list' ],
  run              : async (message, language) => {
    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });
    const listings   = await message.client.database.GuildWatchlist.findById(message.guild.id).catch(err => err);
    const { STRING } = message.client.services.UTIL;
    if (listings instanceof Error){
      parameters.assign({ '%ERROR%': listings.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };
    if (listings === null || !listings.data.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'WATCHING_NODATA', parameters }));
    };
    const channel   = message.guild.channels.cache.get(listings.channelID);
    if (!channel){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'WATCHING_NOCHAN', parameters }));
    };
    const entries = [];
    let hasNextPage, page = 0;
    do {
      const res = await message.client.anischedule.fetch(message.client.services.GRAPHQL.Watching, {watched: listings.data, page });
      if (res.errors){
        parameters.assign({ '%QUERY%': 'Watchlist Query', '%SERVICE%': 'AniList', '%ERROR%': errors[0].message });
        return message.reply(language.get({ '$in': 'ERRORS', id: errors[0].status, parameters }));
      };
      if (!entries.length && !res.data.Page.media.length){
        return message.reply(language.get({ '$in': 'COMMANDS', id: 'WATCHING_NODATA', parameters }));
      };
      page        = res.data.Page.pageInfo.currentPage + 1;
      hasNextPage = res.data.Page.pageInfo.hasNextPage;
      entries.push(...res.data.Page.media.filter(x => x.status === 'RELEASING'));
    } while (hasNextPage);
    parameters.assign({
      '%ENTRYCOUNT%': entries.length,
      '%WATCHURL%'  : 'https://mai-san.ml/docs/Features/Anischedule#adding-more-to-the-list',
      '%UNWATCHURL%': 'https://mai-san.ml/docs/Features/Anischedule#removing-anime-from-the-list'
    });
    const hyperlinkify = (id, title, url) => `•\u2000\u2000\`[ ${id} ]\` [**${title}**](${url})`;
    const formatID     = (entry)          => ' '.repeat(6 - String(entry.id).length) + String(entry.id);
    const _mapFn       = (entry)          => hyperlinkify(formatID(entry), STRING.truncate(entry.title.romaji, 42, '...'), entry.siteUrl);
    const chunks       = entries.sort((A,B) => A.id - B.id).map(_mapFn);
    const footer       = language.get({ '$in': 'COMMANDS', id: 'WATCHING_EFOOTR' });
    const descriptions = _.chunk(chunks, 20).map(d => {
      return new MessageEmbed()
      .setDescription(d.join('\n'))
      .setTitle(language.get({ '$in': 'COMMANDS', id: 'WATCHING_ETITLE', parameters }))
      .setColor(0xe620a4)
      .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .addField(language.getDictionary(['tips']).TIPS, language.get({ '$in': 'COMMANDS', id: 'WATCHING_TIPS', parameters }));
    });
    if (descriptions.length === 1){
      return message.channel.send(descriptions[0]);
    };
    return new message.client.services.UTIL.Paginate(descriptions, message, {
      previousbtn        : '767062237722050561',
      nextbtn            : '767062244034084865',
      stopbtn            : '767062250279927818',
      removeUserReactions: message.type === 'dm' ? false : true,
      appendPageInfo     : true
    }).exec();
  }
};
