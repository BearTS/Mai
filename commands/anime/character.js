const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const {
  TextHelpers : {
    textTrunctuate
  }
} = require('../../helper.js')
const langflags = [
    {
      lang: 'Hungarian'
    , flag: '🇭🇺'
    }
  , {
      lang: 'Japanese'
    , flag: '🇯🇵'
    }
  , {
      lang: 'French'
    , flag: '🇫🇷'
    }
  , {
      lang: 'Russian'
    , flag:'🇷🇺'
    }
  , {
      lang: 'German'
    , flag: '🇩🇪'
    }
  , {
      lang: 'English'
    , flag: '🇺🇸'
    }
  , {
      lang: 'Italian'
    , flag: '🇮🇹'
    }
  , {
      lang: 'Spanish'
    , flag: '🇪🇸'
    }
  , {
      lang: 'Korean'
    , flag: '🇰🇷'
    }
  , {
      lang: 'Chinese'
    , flag: '🇨🇳'
    }
  , {
      lang: 'Brazilian'
    , flag: '🇧🇷'
    }
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
  , description: 'Searches for a character in <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net "Homepage")'
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

    const msg = await message.channel
                        .send(new MessageEmbed()
                              .setColor('YELLOW')
                              .setDescription(`Searching for character named **${query}** on <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage').`)
                              .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
                        )

    let data = await fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`)
                          .then( res => res.json())

    let errmsg = new MessageEmbed()
                      .setColor('RED')
                      .setDescription(`\u200b\n\n\u2000\u2000<:cancel:712586986216489011> | ${
                            data.status == 404
                            ? `No results found for **${query}**`
                            : data.status == 429
                              ? `I am being rate-limited in <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage'). Please try again Later`
                              : [500,503].includes(data.status)
                                ? `Could not access <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage'). The site might be currently down at the moment`
                                  : `An undocumented error occured! <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage') responded with HTTP error code ${
                                    data.status
                                  }`}.\n\n\u200b`)
                      .setThumbnail('https://i.imgur.com/qkBQB8V.png')

    if (!data || data.error){
      data = data
            ? data
            : {}

      return await msg.edit(errmsg).catch(()=>null)
                   ? null
                   : await message.channel.send(errmsg).then(()=> null)
    }


    const { results : [ { mal_id } ] } = data

    let res = await fetch(`https://api.jikan.moe/v3/character/${mal_id}`)
                      .then( res => res.json()).catch(()=>null)

    errmsg.setDescription(`\u200b\n\n\u2000\u2000<:cancel:712586986216489011> | ${
            data.status == 404
            ? `No results found for **${query}**`
            : data.status == 429
              ? `I am being rate-limited in <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage'). Please try again Later`
              : [500,503].includes(data.status)
                ? `Could not access <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage'). The site might be currently down at the moment`
                : `An undocumented error occured! <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage') responded with HTTP error code ${
                  data.status
                }`}.\n\n\u200b`)


    if (!res || res.error){
      res = res
            ? res
            : {}
      return await msg.edit(errmsg).catch(()=>null)
                   ? null
                   : await message.channel.send(errmsg).then(()=>null)
    }

    const { url, name, name_kanji,
            about, image_url, animeography,
            mangaography, voice_actors } = res

    const elapsed = Date.now() - msg.createdAt

    const embed = new MessageEmbed()
    .setAuthor(`${name}${name_kanji ? ` • ${name_kanji}` : ''}`, null, url)

    .setThumbnail(image_url)

    .setColor('GREY')

    .setDescription(textTrunctuate(about.replace(/\\n/g,''),500,`... [Read More](${url})`))

    .addField('Anime Appearances', animeography.length < 4
                                   ? animeography.map(c => `• [${c.name}](${c.url}) as ${c.role}`).join('\n')
                                   : `${animeography.slice(0,3).map(c => `• [${c.name}](${c.url}) as ${c.role}`).join('\n')}\n...and ${animeography.length - 3} more!`)

    .addField('Manga Appearances', mangaography.length < 4
                                   ? mangaography.map(c => `• [${c.name}](${c.url}) as ${c.role}`).join('\n')
                                   : `${mangaography.slice(0,3).map(c => `• [${c.name}](${c.url}) as ${c.role}`).join('\n')}\n...and ${mangaography.length - 3} more!`)

    .addField(`Seiyuu`, voice_actors.length < 4
                        ? voice_actors.map(c => `• ${langflags.find( m => m.lang === c.language)
                                                   ? langflags.find( m => m.lang === c.language).flag
                                                   : c.language} [${c.name}](${c.url})` ).join('\n')
                        : voice_actors.slice(0,3).map(c => `• ${langflags.find( m => m.lang === c.language)
                                                            ? langflags.find( m => m.lang === c.language).flag
                                                            : c.language} [${c.name}](${c.url})` ).join('\n')
                        , true)

    .setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)

    if (voice_actors.length > 3)
      embed.addField(`\u200B`, voice_actors.length < 7
                               ? voice_actors.slice(3).map(c => `• ${langflags.find( m => m.lang === c.language)
                                                                 ? langflags.find( m => m.lang === c.language).flag
                                                                 : c.language} [${c.name}](${c.url})`).join('\n')
                               : voice_actors.slice(3,6).map(c => `• ${langflags.find( m => m.lang === c.language)
                                                                       ? langflags.find( m => m.lang === c.language).flag
                                                                       : c.language} [${c.name}](${c.url})`).join('\n')
                        , true)

    if (voice_actors.length > 6)
      embed.addField(`\u200B`, voice_actors.length < 10
                               ? voice_actors.slice(6).map(c => `• ${langflags.find( m => m.lang === c.language)
                                                                     ? langflags.find( m => m.lang === c.language).flag
                                                                     : c.language} [${c.name}](${c.url})` ).join('\n')
                               : `${voice_actors.slice(6,8).map(c => `• ${langflags.find( m => m.lang === c.language)
                                                                     ? langflags.find( m => m.lang === c.language).flag
                                                                     : c.language} [${c.name}](${c.url})`).join('\n')}\n...and ${voice_actors.length - 8} more!`
                        ,true)


    return await msg.edit(embed).catch(()=>null)
                 ? null
                 : await message.channel.send(embed).then(()=> null)

  }
}
