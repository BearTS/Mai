const {
    TextHelpers: {
      textTrunctuate
    , joinArray
  }
  , LocalDatabase: {
      animeDB
    , mangaDB
  }
  , Classes: {
      Paginate
  }
} = require('../../helper')
const { MessageEmbed, GuildEmoji } = require('discord.js')
const { decode } = require('he')
const fm = {
    TV: 'TV'
  , TV_SHORT: 'TV Shorts'
  , MOVIE: 'Movie'
  , SPECIAL: 'Special'
  , ONA: 'ONA'
  , OVA: 'OVA'
  , MUSIC: 'Music'
  , MANGA: 'Manga'
  , NOVEL: 'Light Novel'
  , ONE_SHOT: 'One Shot Manga'
}

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
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, please specify if it is an \`ANIME\` or \`MANGA\``)

    if (['a','anime','ani'].includes(category.toLowerCase())) {
        let data = []
        let selectedgenres = []
        let timesviewed;

        if (client.collections.exists('anidailyrec', message.author.id)){
          profile = client.collections.getFrom('anidailyrec', message.author.id)
          profile.timesviewed++
          data = profile.data
          selectedgenres = profile.selectedgenres
          timesviewed = profile.timesviewed
        } else {
          let defaultgenres = ['Action','Adventure','Comedy','Drama','Sci-Fi','Mystery','Supernatural','Fantasy','Sports','Romance','Slice of Life','Horror','Psychological','Thriller','Ecchi','Mecha','Music','Mahou Shoujo']
          for (let i = 0; i < 5; i++) selectedgenres.push(defaultgenres.splice(Math.floor(Math.random() * (defaultgenres.length)),1)[0])

          for (const genre of selectedgenres) {
            const selection = animeDB.filter(({ genres }) => genres.includes(genre) && !genres.includes('Hentai'))
            data.push(selection[(Math.floor(Math.random()*selection.length))])
          }
          let timesviewed = 0
          client.collections.setTo('anidailyrec', message.author.id, { data, selectedgenres, timesviewed })
        }

        const discoveryPages = new Paginate().add(new MessageEmbed().setColor('GREY')
            .setTitle('Get Random Anime Recommendations with your Discovery Queue!')
            .setThumbnail(message.author.displayAvatarURL())
            .setDescription('Your Anime Recommendations Discovery Queue is unique and totally random generated. 5 random genres out of 17 total genres are selected and random anime are picked out of those genres for you. You get a different anime recommendation per day so don\'t miss the chance to discover every day.')
            .addField('\u200b','\u2000'+client.collections.getFrom('anidailyrec', message.author.id).selectedgenres.map( el=> `\\🟢 ${el}`).join('\n'))
            .addField(timesviewed > 0 ? `Times viewed today:\n${timesviewed + 1}` : '\u200b','\u200b')
            .addField('\u200b','Start Your Queue by clicking <:next:712581873628348476> below!!')
          )
        let o = 0
        for (const { ids: { mal, anilist }, title: { romaji, native, english }, isAdult, format, startDate: { stringified }, episodes, duration, genres, studio, image, color, description } of data){
          discoveryPages.add(new MessageEmbed()
            .setAuthor(`Today's pick for ${selectedgenres[o]}: ${romaji ? romaji : native ? native : english} | ${fm[format]}`,null,`https://myanimelist.net/anime/${mal}`)
            .setColor(color ? color : 'GREY')
            .addField('Other titles',`**Japanese**: ${native ? native : 'None'}\n**Romanized**: ${romaji ? romaji : 'None'}\n**English**: ${english ? english : 'None'}`)
            .addField('Genres', `\u200b${joinArray(genres)}`)
            .addField('Started', stringified ? stringified : 'Unknown', true)
            .addField('Episodes', episodes ? episodes : 'Unknown', true)
            .addField('Duration', duration ?`${duration} minutes`: 'Unknown', true)
            .setFooter(studio ? studio : '\u200b')
            .setColor(color)
            .setThumbnail(image)
            .addField('\u200b', description && description !== ' ' ? textTrunctuate(decode(description), 1000, ` […Read More](https://myanimelist.net/anime/${mal})`) : '\u200b'))
            o++
        }

      const discoveryPrompt = await message.channel.send(discoveryPages.currentPage)
      const next = client.emojis.cache.get('712581873628348476') || '▶'
      const collector = discoveryPrompt.createReactionCollector( (reaction, user) => user.id === message.author.id)
      await discoveryPrompt.react(next)
      let timeout = setTimeout(()=> collector.stop(), 90000)


      collector.on('collect', async ({ emoji: { name }, users }) => {
        if ((next instanceof GuildEmoji && name === next.name) || next === name){
          await discoveryPrompt.edit(discoveryPages.next())
          if (discoveryPages.currentIndex == discoveryPages.size-1) return collector.stop()
        }
        await users.remove(message.author.id)
        timeout.refresh()
      })

      collector.on('end', () => discoveryPrompt.reactions.removeAll())

    } else {
      let data = []
      let selectedgenres = []
      let timesviewed;

      if (client.collections.exists('mangadailyrec', message.author.id)){
        profile = client.collections.getFrom('mangadailyrec', message.author.id)
        profile.timesviewed++
        data = profile.data
        selectedgenres = profile.selectedgenres
        timesviewed = profile.timesviewed
      } else {
        let defaultgenres = ['Action','Adventure','Comedy','Drama','Sci-Fi','Mystery','Supernatural','Fantasy','Sports','Romance','Slice of Life','Horror','Psychological','Thriller','Ecchi','Mecha','Music','Mahou Shoujo']
        for (let i = 0; i < 5; i++) selectedgenres.push(defaultgenres.splice(Math.floor(Math.random() * (defaultgenres.length)),1)[0])

        for (const genre of selectedgenres) {
          const selection = mangaDB.filter(({ genres }) => genres.includes(genre) && !genres.includes('Hentai'))
          data.push(selection[(Math.floor(Math.random()*selection.length))])
        }
        let timesviewed = 0
        client.collections.setTo('mangadailyrec', message.author.id, { data, selectedgenres, timesviewed })
      }

      const discoveryPages = new Paginate().add(new MessageEmbed().setColor('GREY')
          .setTitle('Get Random Manga Recommendations with your Discovery Queue!')
          .setThumbnail(message.author.displayAvatarURL())
          .setDescription('Your Manga Recommendations Discovery Queue is unique and totally random generated. 5 random genres out of 17 total genres are selected and random manga/novel/one-shot are picked out of those genres for you. You get a different manga recommendation per day so don\'t miss the chance to discover every day.')
          .addField('\u200b','\u2000'+client.collections.getFrom('mangadailyrec', message.author.id).selectedgenres.map( el=> `\\🟢 ${el}`).join('\n'))
          .addField(timesviewed > 0 ? `Times viewed today:\n${timesviewed + 1}` : '\u200b','\u200b')
          .addField('\u200b','Start Your Queue by clicking <:next:712581873628348476> below!!')
        )
      let o = 0
      for (const { ids: { mal, anilist }, title: { romaji, native, english }, isAdult, format, startDate: { stringified }, chapters, volumes, genres, image, color, description } of data){
        discoveryPages.add(new MessageEmbed()
          .setAuthor(`Today's pick for ${selectedgenres[o]}: ${romaji ? romaji : native ? native : english} | ${fm[format]}`,null,`https://myanimelist.net/manga/${mal}`)
          .setColor(color)
          .addField('Other titles',`**Japanese**: ${native ? native : 'None'}\n**Romanized**: ${romaji ? romaji : 'None'}\n**English**: ${english ? english : 'None'}`)
          .addField('Genres', `\u200b${joinArray(genres)}`)
          .addField('Started', stringified ? stringified : 'Unknown', true)
          .addField('Chapters', chapters ? chapters : 'Unknown', true)
          .addField('Volumes', volumes ? volumes : 'Unknown', true)
          .setColor(color)
          .setThumbnail(image)
          .addField('\u200b', description && description !== ' ' ? textTrunctuate(decode(description), 1000, ` […Read More](https://myanimelist.net/manga/${mal})`) : '\u200b'))
          o++
      }

    const discoveryPrompt = await message.channel.send(discoveryPages.currentPage)
    const next = client.emojis.cache.get('712581873628348476') || '▶'
    const collector = discoveryPrompt.createReactionCollector( (reaction, user) => user.id === message.author.id)
    await discoveryPrompt.react(next)
    let timeout = setTimeout(()=> collector.stop(), 90000)


    collector.on('collect', async ({ emoji: { name }, users }) => {
      if ((next instanceof GuildEmoji && name === next.name) || next === name){
        await discoveryPrompt.edit(discoveryPages.next())
        if (discoveryPages.currentIndex == discoveryPages.size-1) return collector.stop()
      }
      await users.remove(message.author.id)
      timeout.refresh()
    })


    collector.on('end', () => discoveryPrompt.reactions.removeAll())

    }
    return
  }
}
