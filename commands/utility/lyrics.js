const { MessageEmbed, GuildEmoji } = require('discord.js');
const fetch = require('node-fetch');
const text = require('../../util/string');
const Page = require('../../struct/Paginate');

module.exports = {
  name: 'lyrics',
  aliases: [],
  group: 'utility',
  description: 'Searches for lyric info about a song from GeniuslLyrics, or Kimi no Sei, if no query are provided.',
  parameters: [ 'Search Query' ],
  examples: [
    'lyrics kimi no sei',
    'lyrics fukashigi no karte'
  ],
  run: async (client, message, args) => {

    const query =  args.join(' ') || 'Kimi no Sei';

    const data = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURI(query)}`)
    .then(res => res.json())
    .catch(() => null);

    if (!data || data.error){
      return message.channel.send(`\\\❌ | ${message.author}, I couldn't find the lyrics for ${args.join(' ')}!`)
    };

    if (data.lyrics.length < 2000){
      return message.channel.send(
        new MessageEmbed()
        .setColor('GREY')
        .setDescription(data.lyrics)
        .setThumbnail(data.thumbnail.genius)
        .setFooter(`Lyrics | \©️${new Date().getFullYear()} Mai`)
        .setAuthor(`${data.title}\n${data.author}`, null, data.links.genius)
      );
    };

    const lyrics_array = data.lyrics.split('\n');
    const lyrics_subarray = [ '' ];
    let n = 0;

    for (const line of lyrics_array){
      if (lyrics_subarray[n].length + line.length < 2000){
        lyrics_subarray[n] = lyrics_subarray[n] + line + '\n'
      } else {
        n++
        lyrics_subarray.push(line);
      };
    };

    const pages = new Page(
      lyrics_subarray.map((x,i) =>
        new MessageEmbed()
        .setColor('GREY')
        .setDescription(x)
        .setThumbnail(data.thumbnail.genius)
        .setFooter([
          `Page ${i+1} of ${lyrics_subarray.length}`,
          `Lyrics | \©️${new Date().getFullYear()} Mai`
        ].join( '\u2000•\u2000' ))
        .setAuthor(`${data.title}\n${data.author}`, null, data.links.genius)
      )
    );

    const msg = await message.channel.send(pages.currentPage)

    const prev = client.emojis.cache.get('767062237722050561') || '◀'
    const next = client.emojis.cache.get('767062244034084865') || '▶'
    const terminate = client.emojis.cache.get('767062250279927818') || '❌'

    const collector = msg.createReactionCollector( (reaction, user) => user.id === message.author.id)
    const navigators = [ prev, next, terminate ]

    for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i])

    let timeout = setTimeout(()=> collector.stop(), 180000)

    collector.on('collect', async ( {emoji: {name}, users }) => {

    switch(name){
      case prev instanceof GuildEmoji ? prev.name : prev:
        msg.edit(pages.previous())
        break
      case next instanceof GuildEmoji ? next.name : next:
        msg.edit(pages.next())
        break
      case terminate instanceof GuildEmoji ? terminate.name : terminate:
        collector.stop()
        break
      }

      await users.remove(message.author.id)
      timeout.refresh()

    });

    collector.on('end', async () => await msg.reactions.removeAll().catch(()=>null) ? null : null);
  }
};
