// RATELIMIT NOTICE:
// This command takes 2 api calls on MongoDB (Ratelimited at 100 cals per second)
// and 1 api call on anilist (Ratelimited at 90 calls per minute)
//
const { MessageEmbed } = require('discord.js');
const watchlist = require('../../models/GuildWatchlist');
const text = require('../../util/string');

module.exports = {
  name: 'cleanup',
  aliases: [],
  guildOnly: true,
  group: 'owner',
  description: 'Remove all finished anime from anilist scheduler. Regularly run once in 4 months to reduce id clutters on watchlist data.',
  examples: [
    'cleanup'
  ],
  run: (client, message) => watchlist.find({}, async (err, docs) => {

    if (err) {
      return message.channel.send(`\\❌ An error occured while fetching documets from the database: \`${err.name}\``);
    };

    const status = [ 'FINISHED', 'CANCELLED' ];
    const ids = [...new Set(docs.map(doc => [...doc.data]).flat(Infinity))];
    const res = await client.anischedule.fetch(`query ($ids: [Int] $status: [MediaStatus]) { Page { media(id_in: $ids status_in: $status ) { id } } }`, {ids, status});

    if (res.errors){
      return;
    };

    const finished = res.data.Page.media.map(media => media.id);

    if (!finished.length){
      return message.channel.send(`\`❌ [ALL_UPDATED]:\` There's nothing to clean here.`);
    };

    return watchlist.updateMany({
      data: { '$in': finished
    }}, {
      '$pull': { data: { '$in': finished }}
    }, (err, upd) => {
      if (err) {
        return message.channel.send(`\\❌ An error occured while updating the list: \`${err.name}\``)
      } else {
        return message.channel.send(`\\✔️ Successfully removed **${upd.nModified}** entries from **${upd.n}** guilds!`);
      };
    });
  })
};
