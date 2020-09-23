const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { TextHelpers: { textTrunctuate }} = require('../../helper')

module.exports = {
  name: 'lyrics',
  aliases: [],
  group: 'utility',
  description: 'Searches for lyric info about a song from GeniusLyrics',
  examples: ['lyrics Fukashigi No Karte'],
  parameters: ['Search Query'],
  run: async (client, message, args) => {

    if (!args.length) args = [['Fukashigi no Carte'],['Kimi no Sei']][Math.floor(Math.random() * 2)]

    const data = await fetch(`https://some-random-api.ml/lyrics?title=${encodeURI(args.join(' '))}`).then(res => res.json())

    if (data.error) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I couldn't find the lyrics for ${args.join(' ')}!`)

    const { title, author, lyrics, thumbnail, links } = data

    message.channel.send( new MessageEmbed()
      .setAuthor(`${title}\n${author}`, null, links.genius)
      .setThumbnail(thumbnail.genius)
      .setDescription(lyrics.length < 2000 ? lyrics : `The lyrics exceeded the max character of 2000. **[Click here](${links.genius})** to view the lyrics in your browser instead.`)
      .setColor('GREY')
    )
  }
}
