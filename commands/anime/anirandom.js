const {
    TextHelpers: {
      textTrunctuate
    , joinArray
  }
  , LocalDatabase: {
    animeDB
  }
} = require('../../helper')

const { MessageEmbed } = require('discord.js')
const { decode } = require('he')

const fm = {
    TV: 'TV'
  , TV_SHORT: 'TV Shorts'
  , MOVIE: 'Movie'
  , SPECIAL: 'Special'
  , ONA: 'ONA'
  , OVA: 'OVA'
  , MUSIC: 'Music'
}


module.exports = {
    name: 'anirandom'
  , aliases: [
      'anirand'
    , 'anirecommend'
  ]
  , group: 'anime'
  , description: 'Generates a random anime recommendation. Use `discover` command to generate a handpicked recommendations for a user'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameter: []
  , run: async ( client, message ) => {

      const {
          ids: {
            mal
          , anilist
        }
        , title: {
            romaji
          , native
          , english
        }
        , isAdult
        , format
        , startDate: {
            stringified
        }
        , episodes
        , duration
        , genres
        , studio
        , image
        , color
        , description
      } = animeDB[Math.floor(Math.random() * animeDB.length)]

      return message.channel.send(new MessageEmbed()
        .setAuthor(`${
            romaji
            ? romaji
              : native
              ? native
                : english
          } | ${
            fm[format]
          }`, null ,`https://myanimelist.net/anime/${mal}`)

        .setColor(color)

        .addField('Other titles',`**Japanese**: ${
            native
            ? native
            : 'None'
          }\n**Romanized**: ${
            romaji
            ? romaji
            : 'None'
          }\n**English**: ${
            english
            ? english
            : 'None'
          }`)

        .addField('Genres',
          `\u200b${joinArray(genres)}`)

        .addField('Started',
            stringified
            ? stringified
            : 'Unknown', true)

        .addField('Episodes',
            episodes
            ? episodes
            : 'Unknown', true)

        .addField('Duration',
            duration
            ? `${duration} minutes`
            : 'Unknown', true)

        .setFooter(studio
                  ? studio
                  : '\u200b')

        .setColor(color)

        .setThumbnail(image)

        .addField('\u200b',
            description && description !== ' '
            ? textTrunctuate(description.replace(/&#(\d+);/g, (str) => String.fromCharCode(str)), 1000, ` […Read More](https://myanimelist.net/anime/${mal})`)
            : '\u200b')

    )
  }
}
