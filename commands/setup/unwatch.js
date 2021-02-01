const { MessageEmbed } = require('discord.js');
const list = require('../../models/GuildWatchlist');

module.exports = {
  name: 'unwatch',
  aliases: ['anischedremove', 'anischedunwatch'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: ['Removes a watched anime from your watchlist'],
  requiresDatabase: true,
  parameters: [ 'Anilist/Mal link' ],
  examples: [
    'unwatch https://myanimelist.net/anime/45678',
    'unwatch https://anilist.co/anime/10778'
  ],
  run: (client, message, links) => list.findById(message.guild.id, async (err, doc) => {

    if (err){
      return message.channel.send(`\`❌ [DATABASE_ERR]:\` The database responded with error: ${err.name}`);
    };

    // If there is no entry for the current guild, create a new one.
    if (!doc){
      doc = new list({ _id: message.guild.id });
    };

    const id = [];
    const idMal = [];
    for (const entry of links){
      const mal = (entry.match(/(?<=myanimelist\.net\/anime\/)\d{1,}/gi)||[]);
      const al = (entry.match(/(?<=anilist\.co\/anime\/)\d{1,}/gi)||[]);
      const al_id = Number(entry);

      id.push(...[...al, al_id].map(x => Number(x)).filter(Boolean));
      idMal.push(...mal.map(x => Number(x)).filter(Boolean));
    };

    const res = [];

    for (const [key, ids] of Object.entries({ id, idMal })){
      if (!ids.length){
        continue;
      };

      const query = await client.anischedule.fetch(`query($ids: [Int]){ Page(perPage: 25){ media(${key}_in: $ids type: ANIME){ id title { romaji english native userPreferred } status coverImage{ large color } siteUrl nextAiringEpisode{ episode timeUntilAiring } } } }`, { ids })

      if (query.errors){
        return message.channel.send(`\\❌ Unable to connect to AniList. Please try again later`);
      };

      res.push(...query.data.Page.media);
    };

    if (!res.length){
      return message.channel.send(`\\❌ None of the provided links/ids matches anime from AniList!`);
    };

    const tbd = res.filter(x => doc.data.includes(x.id)).map(x => x.id);
    const exc = res.filter(x => !doc.data.includes(x.id)).map(x => x.id);
    doc.data = doc.data.filter(d => !tbd.some(t => t === d));

    doc.save()
    .then(() => message.channel.send(
      new MessageEmbed()
      .setColor(res.sort((A,B) => B.id - A.id)[0].coverImage.color)
      .setThumbnail(res.sort((A,B) => B.id - A.id)[0].coverImage.large)
      .setAuthor('Removing from watchlist')
      .setFooter(`Unwatch | \©️${new Date().getFullYear()} Mai`)
      .addFields(res.splice(0,25).sort((A,B) => B.id - A.id).map(entry => {
        const mediatitle = entry.title.romaji || entry.title.english || entry.title.native;
        const name = '\u200b';
        let value = '\u200b';

        if (tbd.includes(entry.id)){
          value = `<a:animatedcheck:758316325025087500> Successfully removed [**${mediatitle}**](${entry.siteUrl})`;
        } else {
          value = [
            `\\⚠️ Failed to remove [**${mediatitle}**](${entry.siteUrl})`,
            'This entry is not on your list!'
          ].join('\n')
        };
        return { name, value };
      }))
    )).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
