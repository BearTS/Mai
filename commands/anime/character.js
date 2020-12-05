const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const text = require(`${process.cwd()}/util/string`);

module.exports = {
  name: 'character',
  aliases: [ 'anichar' , 'char' , 'c' ],
  cooldown: {
    time: 10000,
    message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  },
  clientPermissions: [ 'EMBED_LINKS' ],
  group: 'anime',
  description: 'Searches for a character in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage")',
  parameters: [ 'Search Query' ],
  get examples(){
    return [this.name, ...this.aliases.map((x, i) => {
      const queries = ['Mai Sakurajima', 'Mai-san', 'mai'];
      return x + ' ' + [queries][i];
    })];
  },
  run: async (client, message, args) => {

    const query = args.join(' ') || 'Mai Sakurajima';

    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setDescription(`Searching for character named **${query}** on <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
    .setFooter(`Character Query with MAL | \©️${new Date().getFullYear()}`);

    const msg = await message.channel.send(embed);

    let data = await fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`).then(res => res.json());
    const badge = '<:mal:767062339177676800> [MyAnimeList](https://myanimelist.net \'Homepage\')';

    const errstatus = {
      "404": `No results were found for **${query}**!\n\nIf you believe this character exists, try their alternative names.`,
      "429": `I am being rate-limited in ${badge}. Please try again Later`,
      "500": `Could not access ${badge}. The site might be currently down at the moment`,
      "503": `Could not access ${badge}. The site might be currently down at the moment`,
    }

    embed.setColor('RED')
    .setAuthor(data.status == 404 ? 'None Found' : 'Response Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setDescription(`**${message.member.displayName}**, ${errstatus[data.status] || `${badge} responded with HTTP error code ${data.status}`}`)
    .setThumbnail('https://i.imgur.com/qkBQB8V.png');

    if (!data || data.error){
      return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
    };

    const { results : [ { mal_id } ] } = data

    let res = await fetch(`https://api.jikan.moe/v3/character/${mal_id}`).then(res => res.json()).catch(()=>null)

    embed.setDescription(`**${message.member.displayName}**, ${errstatus[data.status] || `${badge} responded with HTTP error code ${data.status}`}`);

    if (!res || res.error){
      return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
    };

    const elapsed = Date.now() - msg.createdAt;
    const anime = text.joinArrayAndLimit(res.animeography.map(x => `[${x.name}](${x.url.split('/').slice(0,5).join('/')}) (${x.role})`),'\n');
    const manga = text.joinArrayAndLimit(res.mangaography.map(x => `[${x.name}](${x.url.split('/').slice(0,5).join('/')}) (${x.role})`),'\n');

    embed.setAuthor(`${res.name} ${res.name_kanji ? `• ${res.name_kanji}` : ''}`, null, res.url)
    .setThumbnail(res.image_url)
    .setColor('GREY')
    .setDescription(text.truncate(res.about.replace(/\\n/g,''),500,`... [Read More](${res.url})`))
    .addFields([
      {
        name: `Anime Appearances (${res.animeography.length})`,
        value: `${anime.text || 'None' } ${anime.excess ? `...and ${anime.excess} more!` : ''}`
      },
      {
        name: `Manga Appearances (${res.mangaography.length})`,
        value: `${manga.text || 'None' } ${manga.excess ? `\n...and ${manga.excess} more!` : ''}`
      },
      {
        name: `Seiyuu (${res.voice_actors.length})`,
        value: res.voice_actors.slice(0,3).map(x => `${(client.anischedule.info.langflags.find(m => m.lang === x.language) || {}).flag || x.language} [${x.name}](${x.url})`).join('\n') || 'None',
        inline: true
      }
    ]).setFooter([
      `Search duration: ${Math.abs(elapsed / 1000).toFixed(2)} seconds`,
      `Character Query with MAL | \©️${new Date().getFullYear()} Mai`
    ].join('\u2000\u2000•\u2000\u2000'));

    if (res.voice_actors.length > 3){
      embed.addFields([
        {
          name: '\u200b',
          value: res.voice_actors.slice(3,6).map(x => `${(client.anischedule.info.langflags.find(m => m.lang === x.language) || {}).flag || x.language} [${x.name}](${x.url})`).join('\n'),
          inline: true
        }
      ]);
    };

    if (res.voice_actors.length > 6){
      embed.addFields([
        {
          name: '\u200b',
          value: `${res.voice_actors.slice(6,8).map(x => `${(client.anischedule.info.langflags.find(m => m.lang === x.language) || {}).flag || x.language} [${x.name}](${x.url})`).join('\n')} ${res.voice_actors.length > 8 ? `...and ${res.voice_actors.length - 8} more!`: ''}`,
          inline: true
        }
      ]);
    };

    return await msg.edit(embed).catch(()=>null) || message.channel.send(embed);
  }
};
