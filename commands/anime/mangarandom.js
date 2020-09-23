const { TextHelpers: { textTrunctuate, joinArray }, LocalDatabase: { mangaDB }} = require('../../helper')
const { MessageEmbed } = require('discord.js')
const { decode } = require('he')
const fm = {  MANGA: 'Manga', NOVEL: 'Light Novel', ONE_SHOT: 'One Shot Manga' }


module.exports = {
  name: 'mangarandom'
  , aliases: [
    'mangarand'
  ]
  , group: 'anime'
  , description: 'Generates a random manga recommendation. You can add `-discover` parameter to generate a handpicked recommendations for a user'
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
        } = mangaDB[Math.floor(Math.random() * mangaDB.length)]

        return message.channel.send(new MessageEmbed()

          .setAuthor(`${
              romaji
              ? romaji
              : native
                ? native
                : english
              } | ${
                fm[format]
              }`, null, `https://myanimelist.net/anime/${mal}`)

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

          .setColor(color)

          .setThumbnail(image)

          .addField('\u200b',
              description && description !== ' '
              ? textTrunctuate(decode(description), 1000, ` […Read More](https://myanimelist.net/anime/${mal})`)
              : '\u200b')

    )
  }
}
