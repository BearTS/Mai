const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const {
  TextHelpers : {
    textTrunctuate
  }
} = require('../../helper.js')
const langflags = [
  { lang: 'Hungarian', flag: '🇭🇺' }, { lang: 'Japanese', flag: '🇯🇵' }
  , { lang: 'French' , flag: '🇫🇷' }, { lang: 'Russian' , flag:'🇷🇺' }
  , { lang: 'German', flag: '🇩🇪' }, { lang: 'English', flag: '🇺🇸' }
  , { lang: 'Italian', flag: '🇮🇹' }, { lang: 'Spanish', flag: '🇪🇸' }
  , { lang: 'Korean', flag: '🇰🇷' }, { lang: 'Chinese', flag: '🇨🇳' }
  , { lang: 'Brazilian', flag: '🇧🇷' }
  ]


module.exports = {
    name: 'character'
  , aliases: [
      'anichar'
    , 'char'
    , 'c'
  ]
  , cooldown: {
      time: 10000
    , message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , group: 'anime'
  , image: 'https://files.catbox.moe/syzyj7.gif'
  , description: 'Searches for a character in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net "Homepage")'
  , examples: [
      'character mai sakurajima'
    , 'anichar Mai Sakurajima'
    , 'char Mai-san'
    , 'c mai'
  ]
  , parameters: [
    'search query'
  ]
  , run: async (client, message, args) => {

    const query = args.length
    ? args.join(' ')
    : 'Mai Sakurajima'

    const msg = await message.channel.send(
      new MessageEmbed()
      .setColor('YELLOW')
      .setDescription(`Searching for character named **${query}** on <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage').`)
      .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
      .setFooter(`Character Query with MAL | \©️${new Date().getFullYear()}`)
    )

    let data = await fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`)
      .then(res => res.json())

    const errstatus = {
      "404": `No results were found for **${query}**!\n\nIf you believe this character exists, try their alternative names.`,
      "429": `I am being rate-limited in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage'). Please try again Later`,
      "500": `Could not access <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net \'Homepage\'). The site might be currently down at the moment`,
      "503": `Could not access <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net \'Homepage\'). The site might be currently down at the moment`,
    }

    let errmsg = new MessageEmbed()
    .setColor('RED')
    .setAuthor(data.status == 404 ? 'None Found' : 'Response Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    .setDescription(
      `**${message.member.displayName}**, ${
        errstatus[data.status]
        || `<:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage') responded with HTTP error code ${data.status}`
      }`
    )
    .setThumbnail('https://i.imgur.com/qkBQB8V.png')

    if (!data || data.error)
    return await msg.edit(errmsg).catch(()=>null)
    ? null
    : await message.channel.send(errmsg).then(()=> null)

    const { results : [ { mal_id } ] } = data

    let res = await fetch(`https://api.jikan.moe/v3/character/${mal_id}`)
      .then( res => res.json()).catch(()=>null)

    errmsg.setDescription(
      `**${message.member.displayName}**, ${
        errstatus[res.status]
        || `<:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage') responded with HTTP error code ${data.status}`
      }`
    )

    if (!res || res.error)
    return await msg.edit(errmsg).catch(()=>null)
    ? null
    : await message.channel.send(errmsg).then(()=> null)

    const {
      url, name, name_kanji,
      about, image_url, animeography,
      mangaography, voice_actors } = res

    let animeography_uncounted = 0
    let mangaography_uncounted = 0

    const elapsed = Date.now() - msg.createdAt

    const embed = new MessageEmbed()
    .setAuthor(`${name}${name_kanji ? ` • ${name_kanji}` : ''}`, null, url)

    .setThumbnail(image_url)

    .setColor('GREY')

    .setDescription(textTrunctuate(about.replace(/\\n/g,''),500,`... [Read More](${url})`))

    .addField(
      `Anime Appearances (${animeography.length})`,
      `${animeography.length ? animeography.map( a => `• [${a.name}](${a.url.split('/').slice(0,5).join('/')}) (${a.role})`)
        .reduce((acc, curr) => {
          if (acc.length + curr.length + 3 > 1000){
            animeography_uncounted++
            return acc
          }
          acc = acc + '\n'
          return acc + curr
        })
      : 'None'}${animeography_uncounted ? `\n...and ${animeography_uncounted} more!` : ''}`)

    .addField(
      `Manga Appearances (${mangaography.length})`,
      `${mangaography.length ? mangaography.map( m => `• [${m.name}](${m.url.split('/').slice(0,5).join('/')}) (${m.role})`)
        .reduce((acc,curr) => {
          if (acc.length + curr.length + 3 > 1000){
            mangaography_uncounted++
            return acc
          }
          acc = acc + '\n'
          return acc + curr
        })
      : 'None'}${mangaography_uncounted ? `\n...and ${mangaography_uncounted} more!` : ''}`)

    .addField(
      `Seiyuu (${voice_actors.length})`,
      voice_actors.length
      ? voice_actors.length < 4
        ? voice_actors.map(c => `• ${
          langflags.find( m => m.lang === c.language)
          ? langflags.find( m => m.lang === c.language).flag
          : c.language} [${c.name}](${c.url})` ).join('\n')
        : voice_actors.slice(0,3).map(c => `• ${
          langflags.find( m => m.lang === c.language)
          ? langflags.find( m => m.lang === c.language).flag
          : c.language} [${c.name}](${c.url})` ).join('\n')
      : 'None',
      true
    )

    .setFooter(`Search duration: ${(elapsed / 1000).toFixed(2)} seconds\nCharacter Query with MAL | \©️${new Date().getFullYear()} Mai`)

    if (voice_actors.length > 3)
      embed.addField(
        `\u200B`,
        voice_actors.length < 7
        ? voice_actors.slice(3).map(c => `• ${langflags.find( m => m.lang === c.language)
          ? langflags.find( m => m.lang === c.language).flag
          : c.language} [${c.name}](${c.url})`).join('\n')
        : voice_actors.slice(3,6).map(c => `• ${langflags.find( m => m.lang === c.language)
          ? langflags.find( m => m.lang === c.language).flag
          : c.language} [${c.name}](${c.url})`).join('\n'),
        true
       )

    if (voice_actors.length > 6)
      embed.addField(
        `\u200B`,
        voice_actors.length < 10
        ? voice_actors.slice(6).map(c => `• ${langflags.find( m => m.lang === c.language)
          ? langflags.find( m => m.lang === c.language).flag
          : c.language} [${c.name}](${c.url})` ).join('\n')
        : `${voice_actors.slice(6,8).map(c => `• ${langflags.find( m => m.lang === c.language)
          ? langflags.find( m => m.lang === c.language).flag
          : c.language} [${c.name}](${c.url})`).join('\n')}\n...and ${voice_actors.length - 8} more!`,
        true
      )


    return await msg.edit(embed).catch(()=>null)
    ? null
    : await message.channel.send(embed).then(()=> null)

  }
}
