const {
  TextHelpers: { textTrunctuate, joinArray }
  , LocalDatabase: { mangaDB }
} = require('../../helper')

const { MessageEmbed } = require('discord.js')
const { decode } = require('he')

const fm = {
  MANGA: 'Manga'
  , NOVEL: 'Light Novel'
  , ONE_SHOT: 'One Shot Manga'
}


module.exports = {
  name: 'mangarandom'
  , aliases: [
    'mangarand'
  ]
  , group: 'anime'
  , description: 'Generates a random manga recommendation. Recommends a Hentai if used on a nsfw channel.'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'mangarandom'
  ]
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
          , chapters
          , volumes
          , genres
          , image
          , color
          , description
        } = message.channel.nsfw
        ? mangaDB.filter(a => a.isAdult)[Math.floor(Math.random() * mangaDB.filter(a => a.isAdult).length)]
        : mangaDB.filter(a => !a.isAdult)[Math.floor(Math.random() * mangaDB.filter(a => !a.isAdult).length)]

        return message.channel.send(new MessageEmbed()

          .setAuthor(`${
              romaji
              ? textTrunctuate(romaji)
              : native
                ? textTrunctuate(native)
                : textTrunctuate(english)
              } | ${
                fm[format]
              }`, null, `https://myanimelist.net/manga/${mal}`)

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

          .addField('Genres', `\u200b${joinArray(genres)}`)

          .addField('Started',
              stringified
              ? stringified
              : 'Unknown', true)

          .addField('chapters',
              chapters
              ? chapters
              : 'Unknown', true)

          .addField('volumes',
              volumes
              ? volumes
              : 'Unknown', true)

          .setFooter(`Random Recommendations | \©️${new Date().getFullYear()} Mai`)


          .setThumbnail(image)

          .addField('\u200b',
              description && description !== ' '
              ? textTrunctuate(decode(description), 1000, ` […Read More](https://myanimelist.net/manga/${mal})`)
              : '\u200b')

    )
  }
}
