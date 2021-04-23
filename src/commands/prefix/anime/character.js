const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const _                                       = require('lodash');
const fetch                                   = require('node-fetch');

module.exports = {
  name             : 'character',
  aliases          : [ 'anichar' , 'char' , 'c' ],
  cooldown         : { time: 10000 },
  guildOnly        : true,
  requiresDatabase : false,
  rankcommand      : false,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  group            : 'anime',
  description      : 'Searches for a character in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage"), or Mai\'s character information if no query is provided.',
  parameters       : [ 'Search Query' ],
  examples         : [ 'character', 'anichar Mai', 'anichar Sakuta Azusagawa', 'char Rio Futaba', 'c Kaede Azusagawa' ],
  run              : async (message, language, args ) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const query      = args.join(' ') || 'Mai Sakurajima';
    const URI        = `https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`;
    const data       = await fetch(URI).then(res => res.json()).catch(err => {return { status: 500, error: err.message }});

    message.channel.startTyping();

    if (data.error){
      parameters.assign({ '%QUERY%': query, '%SERVICE%': 'MyAnimeList (via Jikan)', '%ERROR%': data.error.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: data.error.status, parameters }));
    };

    const uri = `https://api.jikan.moe/v3/character/${data.results[0].mal_id}`
    const res = await fetch(uri).then(res => res.json()).catch(err => {return { status: 500, error: err.message }});

    if (res.error){
      parameters.assign({ '%QUERY%': query, '%SERVICE%': 'MyAnimeList (via Jikan)', '%ERROR%': res.error.message });
      return message.reply(language.get({ '$in': 'ERRORS', id: res.error.status, parameters }));
    };

    const { ARRAY, STRING } = message.client.services.UTIL;
    const DICT              = language.getDictionary(['read more', 'voice actors']);
    const FLAGS             = message.client.anischedule.info.langflags;
    const _map              = (x)              => `[${x.name}](${x.url.split('/').slice(0,5).join('/')}) (${x.role})`;
    const _va_map           = (va, i, res, _i) => _i == 2 && i == 2 ? `...and ${res.voice_actors.length - 8} more!` : `${FLAGS.find(m => m.lang === va.language)?.flag || va.language} [${va.name}](${va.url})` ;
    const [ anime, manga ]  = [ 'animeography', 'mangaography' ].map(prop => ARRAY.joinAndLimit(res[prop]?.map(_map), 1000, ' • '));
    const mediastore        = { anime, manga, g: function g(type){ return this[type.toLowerCase()]}};

    return message.channel.send(
      new MessageEmbed()
      .setFooter(`${language.get({ '$in': 'COMMANDS', id: 'CHARACTER_EFOOT'})}\u2000|\u2000${message.client.user.username}\u2000|\u2000\©️${new Date().getFullYear()} Mai`)
      .setDescription(STRING.truncate(res.about.replace(/\\n/g,''),500,`... [${DICT['READ MORE']}](${res.url})`))
      .setAuthor(`${res.name} ${res.name_kanji ? `• ${res.name_kanji}` : ''}`, null, res.url)
      .setThumbnail(res.image_url)
      .setColor('GREY')
      .addFields(...['Anime', 'Manga'].map(m => { return {
        name: language.get({ '$in': 'COMMANDS', id: 'CHARACTER_APPEA', parameters: { '%MEDIA%': m }}), inline: false,
        value: `${mediastore.g(m)?.text || 'None'} ${mediastore.g(m)?.excess ? `\n...and ${store.excess} more!` : ''}` }}))
      .addFields(..._.chunk(res.voice_actors, 3).slice(0,3).map((va_arr, index) => { return {
        name: index === 0 ? DICT['VOICE ACTORS'] : '\u200b', inline: false,
        value: va_arr.map((va, i) => _va_map(va, i, res, index)).join('\n') || '\u200b'
      }}))
    ).finally(() => message.channel.stopTyping());
  }
};
