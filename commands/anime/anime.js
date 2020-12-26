const { getInfoFromName } = require('mal-scraper');
const { MessageEmbed } = require('discord.js');
const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'anime',
  aliases: [ 'ani', 'as', 'anisearch'],
  cooldown: {
    time: 10000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  }, clientPermissions: [ 'EMBED_LINKS' ],
  group: 'anime',
  description: 'Searches for a specific anime in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage")',
  parameters: ['Search Query'],
  get examples(){
    return [this.name, ...this.aliases.map((x,i) => {
      const queries = [ 'aobuta' , 'seishun buta yarou' , 'bunnygirl senpai' ];
      return x + ' ' + queries[i];
    })];
  },
  run: async ( client, message, args ) => {

    const query = args.join(' ') || 'Seishun Buta Yarou';

    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    .setDescription(`Searching for Anime titled **${query}** on <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setFooter(`Anime Query with MAL | \©️${new Date().getFullYear()} Mai`);

    const msg = await message.channel.send(embed);

    const data = await new Promise((resolve,reject) => {
      const timer = setTimeout(() => reject('TIMEOUT'), 10000)

      return getInfoFromName(query)
      .then(res => resolve(res))
      .catch(err => reject(err));
    }).catch((err)=> err !== 'TIMEOUT' ? null : err)

    embed.setColor('RED')
    .setThumbnail('https://i.imgur.com/qkBQB8V.png')
    .setDescription(
      !data
      ? `**${message.member.displayName}**, No results were found for **${query}**!\n\n`
      + `If you believe this anime exists, try the following methods:\n`
      + `• Try the alternative names (e.g. English, Native, Romaji).\n`
      + `• Include the season number (if it exists).\n`
      + `• Include the term 'OVA' if it's an OVA.\n`
      : 'MyAnimeList.net took long to respond (Timeout)\n\n'
      + `Please try again in a few minutes. This is usually caused by a server downtime.`
    ).setAuthor(!data ? 'None Found' : 'Response Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1');

    if (!data || data === 'TIMEOUT'){
      return await msg.edit(embed).catch(() => null) || message.channel.send(embed);
    };

    embed.setColor('GREY')
    .setFooter(`Anime Query with MAL | \©️${new Date().getFullYear()} Mai`)
    .setThumbnail(data.picture || null)
    .setAuthor([
      text.truncate(data.englishTitle || data.title, 200),
      text.truncate(data.type || 'showType Unavailable', 200)
    ].join('\u2000|\u2000'), data.picture || 'https://myanimelist.net/images/icon.svg', data.url)
    .setDescription([
      `Score: ${data.score}\u2000•\u2000Ranked: ${text.ordinalize((data.ranked || 0).slice(1).replace('0th','~'))}\u2000•\u2000Popularity: ${data.popularity || '~'}`,
      `${text.truncate(data.synopsis || 'No Synopsis', 1000, `... [Read More](${data.url})`)}`
    ].join('\n\n'))
    .addFields([
      {
        name: '<:info:767062326859268116>  Information',
        value: [
          `•\u2000\**Japanese Name:**\u2000[${data.title}](${data.url})`,
          `•\u2000\**Age Rating:**\u2000${data.rating || 'Unrated'}`,
          `•\u2000\**Source:**\u2000${data.source || 'N/A'}`
        ].join('\n'),
        inline: true
      },
      {
        name: '\u200b',
        value: [
          `•\u2000\**Genres:**\u2000${text.joinArray(data.genres) || ''}`,
          `•\u2000\**Producers:**\u2000${text.joinArray(data.producers) || ''}`,
          `•\u2000\**Studios:**\u2000${text.joinArray(data.studios) || ''}`
        ].join('\n'),
        inline: true
      },
      {
        name: '<:stats:767062320425730059>  Status',
        value: [
          `•\u2000\**Episodes:**\u2000${data.episodes || 'Unknown'}`,
          `•\u2000\**Start Date:**\u2000${data.aired || 'Unknown'}`,
          `•\u2000\**Status:**\u2000${data.status || 'Unknown'}`
        ].join('\n')
      }
    ]);


    return await msg.edit(embed).catch(()=>{}) || message.channel.send(embed);
  }
};
