const { Permissions: { FLAGS }, MessageEmbed } = require('discord.js');

const moment = require('moment');

module.exports = {
  name             : 'watch',
  description      : 'Adds a new anime to watch for new episodes of. You may provide an Anilist/MAL entry link.  Supports multiple ids/links.',
  aliases          : [ 'anischedadd', 'anischedwatch' ],
  cooldown         : { time: 5e3 },
  clientPermissions: [ FLAGS.MANAGE_GUILD ],
  permissions      : [],
  group            : 'setup',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : true,
  rankcommand      : false,
  parameters       : [ 'Anilist/Mal link | releasing | not-yet-released' ],
  examples         : [ 'watch https://myanimelist.net/anime/45678', 'watch releasing' ],
  run              : async (message, language, links) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag, '%PREFIX%': message.client.prefix });

    // Executed whenever user cannot provide any argument
    if (!links.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'WATCH_NOARGS', parameters }));
    };

    // Fetch the current guild/server document from the database containing watchlist data
    const document = await message.client.database.GuildWatchlist.findById(message.guild.id) || new message.client.database.GuildWatchlist({ _id: message.guild.id });

    // Executed whenever the document returned is an error rather than a mongoose document
    if (document instanceof Error){
      parameters.assign({ '%ERROR%': document.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters }));
    };

    // Parse message containing links
    const id    = links.map(link => link.match(/(?<=anilist\.co\/anime\/)\d{1,}/gi)?.[0]).filter(Boolean);
    const idMal = links.map(link => link.match(/(?<=myanimelist\.net\/anime\/)\d{1,}/gi)?.[0]).filter(Boolean);

    let options = [], fetchedIDs = [], fetchedEntries = [], isStatusQuery = false;

    // Executed whenever the first argument is either of 'RELEASING' or 'NOT-YET-RELEASED'.
    // This block will fetch all the releasing | not yet released entries (based on user query)
    // that is not on the database. If all entries are already in the database, will return empty results.
    if (['releasing', 'not-yet-released'].includes(links[0].toLowerCase())){
      isStatusQuery = true;
      options.push({
        page /*Always start on the first page*/                                  : 1,
        id_not_in /*Do not query the anime which is already on the list*/        : document.data,
        status /*Query anime with status RELEASING or NOT_YET_RELEASED*/         : links[0].replace(/-/g,'_').toUpperCase(),
        seasonYear /*Do not query anime which was not released during this year*/: new Date().getFullYear(),
      });
    }

    // Executed whenever the first condition fails (if the first argument is neither "RELEASING" nor "NOT-YET-RELEASED")
    // This block will fetch the anilist using the parsed id from either anilist, or mal. If there is no parsed ids, will
    // not fetch anilist at all and instead will return a message saying so on line 69.
    else {
      for (const [key, ids] of Object.entries({ id, idMal })){
        if (!ids.length) continue;
        options.push({
          page     : 1,
          [key]    : ids,
          status_in: ['RELEASING', 'NOT_YET_RELEASED'],
        });
      };
    };

    // Executed whenever the user uses an invalid argument. (Neither of the two status nor a valid MAL/Anilist link)
    if (!options.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'WATCH_NOARGS', parameters }));
    };

    // This block will execute once if status is provided instead of a link, once if user provides MAL or Anilist,
    // or twice if user provides both MAL and Anilist links.
    for (const option of options){
      // For every cycle, redeclare the variables to prevent usage from previous cycle.
      let hasNextPage;
      // Always execute once, before checking the hasNextPage variable.
      do {
        // Extract errors or data from the Anilist API
        const { errors, data } = await message.client.anischedule.fetch(message.client.services.GRAPHQL.Watch, option);
        // If any error occurs while fetching the API. Cancel all operation.
        if (errors){
          parameters.assign({ '%QUERY%': 'Watch', '%SERVICE%': 'AniList', '%ERROR%': res.errors[0].message });
          return message.reply(language.get({ '$in': 'ERRORS', id: res.errors[0].status, parameters }));
        };
        // add the fetched entry from this current cycle to all of the fetched entries
        fetchedEntries = [...fetchedEntries, ...data.Page.media ];
        // add the fetched id from each entry from this current cycle while preventing duplicates
        fetchedIDs = [...new Set([...fetchedIDs, ...data.Page.media.map(media => media.id )])];
        // modify the hasNextPage variable. If true, this loop will cycle again, using different parameters for current page
        hasNextPage = data.Page.pageInfo.hasNextPage;
        // Modify the value of the option's currentPage to the next page in case the hasNextPage variable is true
        option.page = data.Page.pageInfo.currentPage + 1;
      } while (hasNextPage);
    };

    if (!fetchedIDs.length){
      // Empty response from Anilist. Meaning if you provided links, none of the links match an anime
      // If you used the [status] query, all [status] anime has already been added.
      parameters.assign({ '%MEDIASTATUS%': links[0].replace(/-/g,'_').toUpperCase()})
      const id = isStatusQuery ? 'WATCH_SALLADDED' : 'WATCH_EMPTYRES';
      return message.reply(language.get({ '$in': 'COMMANDS', id, parameters }));
    };

    const idsToBeAdded    = fetchedIDs.filter(id => document.data.indexOf(id) <  0);
    const idsAlreadyAdded = fetchedIDs.filter(id => document.data.indexOf(id) >= 0);

    // Add all new IDs to the document
    document.data = [...new Set([ ...document.data, ...fetchedEntries.filter(x => ['RELEASING', 'NOT_YET_RELEASED'].includes(x.status)).map(x => x.id) ])];

    // Save the document and catch the error, if there is any
    new_document  = await document.save().catch(e => e);

    // Display error, if there is any
    if (new_document instanceof Error){
      parameters.assign({ '%ERROR%': new_document.message });
      return message.channel.send(language.get({ '$in': 'ERRORS', id: 'DB_ONSAVE', parameters }));
    };

    const DICT = language.getDictionary(['tips', 'watch', 'day(s)', 'hour(s)', 'minute(s)']);

    if (fetchedIDs.length === 1){
      parameters.assign({
        '%ENTRY_TITLE%' : `[**${Object.values(fetchedEntries[0].title).filter(Boolean)[0]}**](${fetchedEntries[0].siteUrl})`,
        '%TIMEUNTILAIR%': moment.duration(fetchedEntries[0].nextAiringEpisode?.timeUntilAiring, 'seconds').format(`d [${DICT['DAY(S)']}] h [${DICT['HOUR(S)']}] m [${DICT['MINUTE(S)']}]`),
        '%EPISODENUM%'  : message.client.services.UTIL.NUMBER.ordinalize(fetchedEntries[0].nextAiringEpisode?.episode),
        '%EMOJI%'       : '<a:animatedcheck:758316325025087500>'
      });
      let description = '';
      if (['FINISHED','CANCELLED','HIATUS'].includes(fetchedEntries[0].status)){
        description += language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_DSC', parameters }) + '\n';
        description += language.get({ '$in': 'COMMANDS', id: `WATCH_${fetchedEntries[0].status}`, parameters });
      } else {
        if (idsAlreadyAdded.length){
          description += language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_DSC', parameters }) + '\n';
          description += language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_RS1', parameters }) + '\n';
        } else {
          description += language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_ASC', parameters }) + '\n';
        };
        if (fetchedEntries[0].nextAiringEpisode?.timeUntilAiring){
          description += language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_TTA', parameters })
        } else {
          description += language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_UTA', parameters })
        };
      };
      return message.channel.send(new MessageEmbed()
      .setDescription(description)
      .setThumbnail(fetchedEntries[0].coverImage.large)
      .setColor(fetchedEntries[0].coverImage.color || 0xe620a4)
      .setAuthor(language.get({'$in': 'COMMANDS', id: 'WATCH_EMBED_ATH' }))
      .setFooter(`${DICT.WATCH}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
      );
    };

    const entries = fetchedIDs.slice(0,20).map(id => {
      const entry = fetchedEntries.find(x => x.id === id);
      const title = message.client.services.UTIL.STRING.truncate(Object.values(entry.title).filter(Boolean)[0], 40, '...');
      const idfmt = String.fromCharCode(32).repeat(6 - id.toString().length) + id.toString();
      const added = idsAlreadyAdded.includes(id) ? '\\⚠️' : idsToBeAdded.includes(id) && ['RELEASING', 'NOT_YET_RELEASED'].includes(entry.status) ? '\\✔️' : '\\❌';
      return `${added}\u2000\u2000\`[ ${idfmt} ]\` [**${title}**](${entry.siteUrl})`;
    });

    parameters.assign({ '%COUNT%': fetchedIDs.length });
    return message.channel.send(new MessageEmbed()
    .setColor(0xe620a4)
    .setDescription(entries.join('\n'))
    .setThumbnail(fetchedEntries.map(x => x.coverImage.large).filter(Boolean)[0])
    .setTitle(language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_TTL', parameters }))
    .setFooter(`${DICT.WATCH}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
    .addFields([
      {
        name : DICT.TIPS,
        value: language.get({ '$in': 'COMMANDS', id: 'WATCH_EMBED_TPS', parameters }),
      }
    ]));
  }
};
