const {
    TextHelpers: { textTrunctuate, joinArray }
  , LocalDatabase: { animeDB, mangaDB }
  , Classes: { Paginate }
} = require('../../helper')
const { MessageEmbed, GuildEmoji } = require('discord.js')
const { decode } = require('he')

module.exports = {
    name: 'discover'
  , aliases: []
  , guildOnly: true
  , group: 'anime'
  , description: 'Generate a set of handpicked <Anime/Manga> recommendations for a user'
  , clientPermissions: [
    'EMBED_LINKS'
    , 'USE_EXTERNAL_EMOJIS'
    , 'ADD_REACTIONS'
  ]
  , examples: [
      'discover a'
    , 'discover manga'
  ]
  , parameter: ['manga','anime']
  , run: async ( client, message, [category] ) => {

    if (!category || !['a','anime','ani','m','manga','b'].includes(category.toLowerCase()))
    return message.channel.send(
      new MessageEmbed().setDescription(
         `**${message.member.displayName}**, Please specify if it's \`ANIME\` or \`MANGA\`.`
      ).setColor('RED').setFooter(`Discover | \©️${new Date().getFullYear()} Mai`)
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')
      .setAuthor('Unrecognized Category!','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
    )

    const defaultgenres = [
      'Action', 'Adventure', 'Comedy',
      'Drama', 'Sci-Fi', 'Mystery',
      'Supernatural', 'Fantasy', 'Sports',
      'Romance', 'Slice of Life', 'Horror',
      'Psychological', 'Thriller', 'Ecchi',
      'Mecha', 'Music', 'Mahou Shoujo'
    ]
    const fm = {
        TV: 'TV', TV_SHORT: 'TV Shorts', MOVIE: 'Movie'
      , SPECIAL: 'Special', ONA: 'ONA', OVA: 'OVA'
      , MUSIC: 'Music', MANGA: 'Manga', NOVEL: 'Light Novel'
      , ONE_SHOT: 'One Shot Manga'
    }

    let profile = {};

    const collection_name = ['a','anime','ani'].includes(category.toLowerCase())
    ? 'anidailyrec'
    : 'mangadailyrec'

    if (client.collections.exists(collection_name, message.author.id)){

      profile = client.collections.getFrom(collection_name, message.author.id)
      profile.timesviewed++

    } else {

      profile.selectedgenres = []
      profile.data = []
      profile.timesviewed = 1

      for (let i = 0; i < 5; i++)
      profile.selectedgenres.push(defaultgenres.splice(
        Math.floor(Math.random() * defaultgenres.length), 1)[0]
      )

      const db = collection_name === 'anidailyrec' ? animeDB : mangaDB

      for (const genre of profile.selectedgenres){
        const selection = db.filter(media => media.genres.includes(genre) && !media.genres.includes('Hentai'))
        profile.data.push(selection[Math.floor(Math.random() * selection.length)])
      }

      client.collections.setTo(collection_name, message.author.id, profile)

    }

    const discoveryPages = new Paginate().add(
      new MessageEmbed()
       .setColor('GREY')
       .setTitle(
        `Get Random ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} Recommendations with your Discovery Queue!`
      )
      .setThumbnail(
        message.author.displayAvatarURL({format: 'png', dynamic: true})
      )
      .setDescription(
        `Your ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} Recommendations Discovery Queue is unique and totally random generated.`
        + `5 random genres out of 17 total genres are selected and random ${collection_name === 'anidailyrec' ? 'anime' : 'manga'} are picked out of those genres for you.`
        + `You get a different ${collection_name === 'anidailyrec' ? 'anime' : 'manga'} recommendations daily so don\'t miss the chance to discover every day.`
      )
      .addField(
        '\u200b',
        `${profile.selectedgenres.map(g => `\\🟢 ${g}`).join('\n')}`
      )
      .addField(
        profile.timesviewed > 1
        ? `Times viewed today:\n${profile.timesviewed + 1}`
        : '\u200b',
        '\u200b'
      )
      .addField('\u200b', 'Start Your Queue by clicking <:next:712581873628348476> below!!')
      .setFooter(`Discover ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} | \©️${new Date().getFullYear()} Mai`)
    )


    let index = 0

    for (const info of profile.data){
      discoveryPages.add(
        new MessageEmbed()
        .setAuthor(
          `Today's pick for ${profile.selectedgenres[index]}: ${
            info.title.romaji
            ? info.title.romaji
            : info.title.native
            ? info.title.native
            : info.title.english
        } | ${fm[info.format]}`, null, `https://myanimelist.net/anime/${info.ids.mal}`
        )
        .setDescription(info.studio || '')
        .setColor(info.color ? info.color : 'GREY')
        .addField(
          'Other Titles',
          `**Japanese**: ${ info.title.native || 'None' }\n`
          + `**Romanized**: ${ info.title.romaji || 'None' }\n`
          + `**English**: ${ info.title.english || 'None' }`
        )
        .addField(
          'Genres',
          `${info.genres.reduce((acc, curr, index) => {
            if (index === info.genres.length - 1)
            return acc + ' and ' + curr

            return acc + ', ' + curr
          })}.`
        )
        .addField('Started', info.startDate.stringified || 'Unknown.', true)
        .addField(collection_name === 'anidailyrec' ? 'Episodes' : 'Chapters', info.episodes || info.chapters || 'Unknown.', true)
        .addField(collection_name === 'anidailyrec' ? 'Duration (in minutes)' : 'Volumes', info.duration || info.volumes || 'Unknown.', true)
        .addField(
          '\u200b',
          info.description && info.description !== ' '
          ? textTrunctuate(decode(info.description), 1000, ` […Read More](https://myanimelist.net/anime/${info.ids.mal})`)
          : 'None'
        )
        .setThumbnail(info.image)
        .setFooter(`Discover ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} | \©️${new Date().getFullYear()} Mai`)
      )
      index++
    }

    const discoveryPrompt = await message.channel.send(discoveryPages.currentPage)
    const next = client.emojis.cache.get('712581873628348476') || '▶'
    const collector = discoveryPrompt.createReactionCollector( (reaction, user) => user.id === message.author.id)
    await discoveryPrompt.react(next)
    let timeout = setTimeout(()=> collector.stop(), 90000)

    collector.on('collect', async ({emoji, users}) => {
      if (next === emoji.name || (next instanceof GuildEmoji && emoji.name === next.name))
      await discoveryPrompt.edit(discoveryPages.next())

      if (discoveryPages.currentIndex === discoveryPages.size - 1)
      return collector.stop()

      await users.remove(message.author.id)
      timeout.refresh()
    })

    collector.on('end', () => discoveryPrompt.reactions.removeAll())

    return;

  }
}
