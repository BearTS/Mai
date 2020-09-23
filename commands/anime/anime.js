const { getInfoFromName } = require('mal-scraper')
const { MessageEmbed } = require('discord.js')
const { TextHelpers: { textTrunctuate, joinArray } } = require('../../helper')

module.exports = {
    name: 'anime'
  , aliases: [
      'ani'
    , 'as'
    , 'anisearch'
  ]
  , cooldown: {
      time: 10000
    , message: 'You are going too fast. Please slow down to avoid getting rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , group: 'anime'
  , image: 'https://files.catbox.moe/2xqq69.gif'
  , description: 'Searches for a specific anime in <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net "Homepage")'
  , examples: [
      'anime'
    , 'anime aobuta'
    , 'ani seishun buta yarou'
    , 'as bunnygirl senpai'
  ]
  , parameters: ['Search Query']
  , run: async ( client, message, args ) => {

    const query = args.length
                  ? args.join(' ')
                  : 'Seishun Buta Yarou'


    const embed = new MessageEmbed()
              .setColor('YELLOW')
              .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
              .setDescription(`Searching for Anime titled **${
                query
              }** on <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'Homepage').`)


    const msg = await message.channel.send(embed)


    const data = await new Promise((resolve,reject) => {

                    const timer = setTimeout(() => reject('TIMEOUT'), 10000)

                    getInfoFromName(query)
                      .then(res => resolve(res))
                          .catch((err)=> reject(err))

                        }).catch((err)=> err !== 'TIMEOUT' ? null : err)


    const errmsg = embed
                  .setColor('RED')
                  .setDescription(`\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000${
                      !data
                      ? `No results found for **${query}**`
                      : '[<:mal:722270009761595482> MyAnimeList](https://myanimelist.net) took too long to respond.'
                    }.\u2000\u2000\n\n\u200b`)
                  .setThumbnail('https://i.imgur.com/qkBQB8V.png')


    if (!data || data === 'TIMEOUT') return await msg.edit(errmsg).catch(()=>null)
                        ? null
                        : await message.channel.send(errmsg).then(()=> null)


    const elapsed = Date.now() - msg.createdAt

    const {
        title
      , url
      , englishTitle
      , picture
      , synopsis
      , type
      , aired
      , status
      , episodes
      , source
      , rating
      , score
      , ranked
      , popularity
      , genres
      , producers
      , studios
    } = data

     embed.setColor('GREY')

          .setAuthor(`${
              englishTitle
              ? textTrunctuate(englishTitle, 200)
              : textTrunctuate(title, 200)
            } | ${
              type && type.length < 200
              ? type
              : 'showType Unavailable'
            }`, picture
                ? picture
                : 'https://myanimelist.net/images/icon.svg', url)

          .setDescription(`Score: ${score} ${
              ranked && Number(ranked.slice(1)) < 150
              ? '| Ranked '+ ranked
              : ''
            } ${
              popularity
              ? '| Popularity : '+popularity
              : ''
            }\n\n${
              synopsis && synopsis.length
              ? textTrunctuate(synopsis, 1000, `... [Read More](${url})`)
              : 'No Synopsis'
            }`)

          .addField(`<:info:719474069053112371>  Information`, `•\u2000\**Japanese Name:** [${title}](${url})\n\•\u2000\**Age Rating:** ${
              rating && rating.length
              ? rating
              : 'Unrated'
            }\n•\u2000\**Source:** ${
              source && source.length
              ? source
              : 'N/A'
            }`,true)

          .addField(`\u200B`,`•\u2000\**Genres:** ${
              genres && genres.length
              ? joinArray(genres)
              : ''
            }\n•\u2000\**Producers:** ${
              producers && producers.length
              ? joinArray(producers)
              : ''
            }\n•\u2000\**Studios:** ${
              studios && studios.length
              ? joinArray(studios)
              : ''
            }`,true)

          .addField(`<:stats:719473222466142248>  Status`,`•\u2000\**Episodes:** ${
              episodes
            }\n•\u2000\**Start Date:** ${
              aired
            }\n\•\u2000\**Status:** ${
              status
            }`)

          .setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)

          .setThumbnail(
            picture
            ? picture
            : null
          );


    return await msg.edit(embed).catch(()=> null)
           ? null
           : await message.channel.send(embed).then(()=> null);

  }
}
