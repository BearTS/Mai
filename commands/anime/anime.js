const moment = require('moment');
const { getInfoFromName } = require('mal-scraper');
const { MessageEmbed } = require('discord.js');
const { malGenres } = require(`${process.cwd()}/util/constants`);
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

    // Indicate that the bot is doing something in the background
    message.channel.startTyping();

    const data = await new Promise((resolve,reject) => {
      setTimeout(() => reject('TIMEOUT'), 10000);

      return getInfoFromName(query)
      .then(res => resolve(res))
      .catch(err => reject(err));
    }).catch((err)=> err !== 'TIMEOUT' ? null : err)

    if (!data){
      return message.channel.send([
        `\\❌ **${message.author.tag}**, No results were found for **${query}**`,
        'If you believe this anime exists, try the following methods:',
        '\u2000•\u2000Try the alternative names (e.g. English, Native, Romanized)',
        '\u2000•\u2000Include the season number (if applicable)',
        '\u2000•\u2000Include the type (e.g. OVA, ONA, TV Shorts).'
      ].join('\n')).then(() => channel.stopTyping());
    } else if (data === 'TIMEOUT'){
      return message.channel.send([
        `\\❌ **${message.author.tag}**, MyAnimeList took longer to respond.`,
        'Please try again later, this may be caused by a server downtime.'
      ].join('\n')).then(() => channel.stopTyping());
    };

    message.channel.stopTyping();
    
    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setThumbnail(data.picture || null)
      .setFooter(`Anime Query with MAL | \©️${new Date().getFullYear()} Mai`)
      .setAuthor([
        text.truncate(data.englishTitle || data.title, 200),
        text.truncate(data.type || 'showType Unavailable', 200)
      ].join('\u2000|\u2000'), null, data.url)
      .setDescription([
        data.japaneseTitle,
        [
          `[\\⭐](https://myanimelist.net/info.php?go=topanime 'Score'): **${data.score}**`,
          `[\\🏅](https://myanimelist.net/info.php?go=topanime 'Rank'): **${text.ordinalize((data.ranked.replace('N/A','0')).slice(1)).replace(/0th/,'N/A')}**`,
          `[\\✨](https://myanimelist.net/info.php?go=topanime 'Popularity'): **${data.popularity || '~'}**`,
          `[\` ▶ \`](${data.trailer} 'Watch Trailer')`
        ].join('\u2000\u2000•\u2000\u2000'),
        `\n${text.joinArray(data.genres.map(g =>
          `[**${g}**](https://myanimelist.net/anime/genre/${malGenres[g.toLowerCase()]})`
        )||[])}`,
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      ].filter(Boolean).join('\n'))
      .addFields([
        {
          name: '\\🔸 Source', inline: true,
          value: '\u2000' + data.source || 'Unknown'
        },{
          name: '\\🔸 Episodes', inline: true,
          value: data.episodes || 'Unknown'
        },{
          name: '\\🔸 Duration', inline: true,
          value: data.duration || 'Unknown'
        },{
          name: '\\🔸 Members', inline: true,
          value: data.members || 'Unknown'
        },{
          name: '\\🔸 Favorites', inline: true,
          value: data.favorites || 'Unknown'
        },{
          name: '\\🔸 Studio', inline: true,
          value: data.studios?.[0] || 'Unknown'
        },{
          name: `\\🕐 ${data.status === 'Finished Airing' ? 'Aired' : 'Airs'} (*${moment(data.aired.split('to')[0], 'll').fromNow()}*)`,
          value: data.aired || 'Unknown'
        },{
          name: '\\🎬 Producers',
          value: text.joinArray(data.producers||[]) || 'Unknown'
        },{
          name: '━━━━━━━━━━━━━━━━━━━━━━━━━━━',
          value: [
            text.truncate(data.synopsis||'No Synopsis', 500, `...\n\n[\`📖\`](${data.url} 'Read More on MyAnimeList')`) || 'No Synopsis Available.',
            '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
            `**${data.rating.replace('None', '') || 'Unrated'}**`
          ].join('\n')
        }
      ])
    );
  }
};
