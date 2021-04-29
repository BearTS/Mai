module.exports = {
  name            : 'cleanup',
  aliases         : [],
  ownerOnly       : true,
  group           : 'owner',
  requiresDatabase: true,
  rankcommand     : false,
  description     : 'Remove all finished anime from anilist scheduler. Regularly run once in 4 months to reduce id clutters on watchlist data.',
  parameters      : [ 'User Mention', 'Amount' ],
  examples        : [ 'addcredits @user 1000'  ],
  run             : async (message, language) => {

    const parameters = new language.Parameter({ '%AUTHOR%' : message.author.tag });
    const watchlist  = message.client.database.GuildWatchlist;
    const collection = await watchlist.find({});
    if (collection instanceof Error){
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters: parameters.assign({ '%ERROR%': collection.message })}));
    };
    const status = [ 'FINISHED', 'CANCELLED' ];
    const ids    = [ ...new Set(collection.map(document => [...document.data]).flat(Infinity))];
    const result = await message.client.anischedule.fetch('query ($ids: [Int] $status: [MediaStatus]) { Page { media(id_in: $ids status_in: $status ) { id } } }', { ids, status });
    if (result instanceof Error){
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters: parameters.assign({ '%ERROR%': result.message })}));
    };
    if (result.errors){
      parameters.assign({ '%QUERY%': 'OWNER_CLEANUP', '%SERVICE%': 'AniList', '%ERROR%': result.errors[0].message });
      return message.reply(language.get({ '$in': 'ERRORS', id: errors[0].status, parameters }));
    };
    const finished = result.data.Page.media.map(media => media.id);
    if (!finished.length){
      return message.reply(language.get({ '$in': 'COMMANDS', id: 'CLEANUP_EMPTY', parameters }));
    };
    const update = await watchlist.updateMany({ data: { '$in': finished }}, { '$pull': { data: {'$in': finished }}})
    if (update instanceof Error){
      return message.reply(language.get({ '$in': 'ERRORS', id: 'DB_DEFAULT', parameters: parameters.assign({ '%ERROR%': update.message })}));
    };
    parameters.assign({ '%ENTRY%': update.nModified, '%GUILD%': update.n });
    return message.reply(language.get({ '$in': 'COMMANDS', id: 'CLEANUP_SUCCESS', parameters }));
  }
};
