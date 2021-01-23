const fetch = require('node-fetch')
const { MessageEmbed, GuildEmoji } = require('discord.js')
const { TextHelpers: { textTrunctuate }, Classes: { Paginate: page }} = require('../../helper')

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

    if (data.error) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, I couldn't find the lyrics for ${args.join(' ')}!`)

    const { title, author, lyrics, thumbnail, links } = data

    if (lyrics.length < 2000)
    return message.channel.send( new MessageEmbed()
      .setAuthor(`${title}\n${author}`, null, links.genius)
      .setThumbnail(thumbnail.genius)
      .setDescription(lyrics)
      .setColor('GREY')
    )


    const lyrics_array = lyrics.split('\n')
    let n = 0
    const lyrics_subarray = ['']

    for (const line of lyrics_array){
      if (lyrics_subarray[n].length + line.length < 2000){
        lyrics_subarray[n] = lyrics_subarray[n] + line + '\n'
      } else {
        n++
        lyrics_subarray.push(line)
      }
    }

    const pages = new page()

    for (const element of lyrics_subarray){
      pages.add( new MessageEmbed()
        .setAuthor(`${title}\n${author}`, null, links.genius)
        .setThumbnail(thumbnail.genius)
        .setDescription(element)
        .setColor('GREY')
        .setFooter(`Page ${pages.size === null ? 1 : pages.size + 1} of ${lyrics_subarray.length}`)
      )
    }

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

    })

    collector.on('end', async () => await msg.reactions.removeAll().catch(()=>null) ? null : null)

  }
}
