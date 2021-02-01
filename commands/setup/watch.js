const { duration } = require('moment');
const { MessageEmbed } = require('discord.js');
const text = require('../../util/string');
const list = require('../../models/GuildWatchlist');

module.exports = {
  name: 'watch',
  aliases: [ 'anischedadd', 'anischedwatch' ],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: 'Adds a new anime to watch for new episodes of. You may provide an <:anilist:767062314121035806>AniList entry link or a <:mal:767062339177676800>MyAnimeList link. Supports multiple ids/links',
  requiresDatabase: true,
  parameters: [ 'Anilist/Mal link' ],
  examples: [
    'watch https://myanimelist.net/anime/45678',
    'anischedadd https://anilist.co/anime/10778'
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

    const valid_ids = res.filter(x => ['HIATUS','RELEASING','NOT_YET_RELEASED'].includes(x.status)).map(x => x.id);
    const existing = valid_ids.filter(x => doc.data.includes(x));
    doc.data = [...new Set(doc.data.concat(valid_ids))];

    doc.save()
    .then(() => message.channel.send(
      new MessageEmbed()
      .setColor(res.sort((A,B) => B.id - A.id)[0].coverImage.color)
      .setThumbnail(res.sort((A,B) => B.id - A.id)[0].coverImage.large)
      .setAuthor('Adding to watchlist')
      .setFooter(`Watch | \©️${new Date().getFullYear()} Mai`)
      .addFields(res.splice(0,25).sort((A,B) => B.id - A.id).map(entry => {
        const filter = ['HIATUS','RELEASING','NOT_YET_RELEASED'].includes(entry.status)
        && !existing.includes(entry.id);
        const nextep = entry.nextAiringEpisode?.episode;
        const untilnextep = entry.nextAiringEpisode?.timeUntilAiring;
        let reason;

        if (entry.status === 'FINISHED'){
          reason = 'This anime has already finished airing.'
        } else if (entry.status === 'CANCELLED'){
          reason = 'This anime was already cancelled.'
        } else if (entry.status === 'HIATUS'){
          reason = [
            'This anime is currently on hiatus.',
            [
              `Its **${text.ordinalize(nextep).replace('0th','') || 'next'}** episode`,
              untilnextep
              ? `is expected to air in **${duration(untilnextep, 'seconds')
              .format('Y [year] M [month] D [day] H [hour] m [minute]')}**`
              : 'airdate is still unknown'
            ].join(' ')
          ].join('\n')
        }else if (existing.includes(entry.id)){
          reason = [
            'This anime is already on your watchlist!',
            [
              `Its **${text.ordinalize(nextep).replace('0th','') || 'next'}** episode`,
              untilnextep
              ? `is expected to air in **${duration(untilnextep, 'seconds')
              .format('Y [year] M [month] D [day] H [hour] m [minute]')}**`
              : 'airdate is still unknown'
            ].join(' ')
          ].join('\n')
        } else {
          reason = [
            `This anime's **${text.ordinalize(nextep).replace('0th','') || 'next'}** episode`,
            untilnextep
            ? `is expected to air in **${duration(untilnextep, 'seconds')
            .format('Y [year] M [month] D [day] H [hour] m [minute]')}**`
            : 'airdate is still unknown'
          ].join(' ')
        };

        return {
          name: '\u200b', value: [
            ['\\⚠️ Failed to add', '<a:animatedcheck:758316325025087500> Successfully added'][Number(filter)],
            `[**${entry.title.romaji || entry.title.english || entry.title.native}**](${entry.siteUrl})`,
            `\n${reason}`
          ].join(' ')
        };
      }))
    )).catch(() => message.channel.send(`\`❌ [DATABASE_ERR]:\` Unable to save the document to the database, please try again later!`));
  })
};
