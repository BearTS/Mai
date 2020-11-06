const { MessageEmbed, GuildEmoji } = require('discord.js');
const { decode } = require('he');

const months = [
  '', 'January', 'February', 'March',
  'April', 'May', 'June', 'July',
  'August', 'September', 'October',
  'November', 'December'
];

const defaultgenres = [
  'Action', 'Adventure', 'Comedy',
  'Drama', 'Sci-Fi', 'Mystery',
  'Supernatural', 'Fantasy', 'Sports',
  'Romance', 'Slice of Life', 'Horror',
  'Psychological', 'Thriller', 'Ecchi',
  'Mecha', 'Music', 'Mahou Shoujo'
];

const fm = {
    TV: 'TV', TV_SHORT: 'TV Shorts', MOVIE: 'Movie'
  , SPECIAL: 'Special', ONA: 'ONA', OVA: 'OVA'
  , MUSIC: 'Music', MANGA: 'Manga', NOVEL: 'Light Novel'
  , ONE_SHOT: 'One Shot Manga'
};

const {
  TextHelpers: { textTrunctuate, joinArray },
  LocalDatabase: { animeDB, mangaDB },
  Classes: { Paginate },
  AniListQuery: query
} = require('../../helper');

module.exports = {
  name: 'discover',
  aliases: [],
  guildOnly: true,
  group: 'anime',
  description: 'Generate a set of handpicked <Anime/Manga> recommendations for a user',
  clientPermissions: [
    'EMBED_LINKS',
    'USE_EXTERNAL_EMOJIS',
    'ADD_REACTIONS'
  ],
  examples: [
    'discover a',
    'discover manga'
  ],
  parameter: ['manga','anime'],
  run: async ( client, message, [category] ) => {

    if (!category || !['anime','manga','ani','a','m'].includes(category.toLowerCase()))
    return message.channel.send(
      new MessageEmbed().setDescription(
         `**${message.member.displayName}**, Please specify if it's \`ANIME\` or \`MANGA\`.`
      ).setColor('RED').setFooter(`Discover | \©️${new Date().getFullYear()} Mai`)
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')
      .setAuthor('Unrecognized Category!','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
    )

    let profile = {};

    const collection_name = ['a','anime','ani'].includes(category.toLowerCase())
    ? 'anidailyrec'
    : 'mangadailyrec'

    if (client.collections.exists(collection_name, message.author.id)){

      profile = client.collections.getFrom(collection_name, message.author.id)
      profile.timesviewed++

    } else {
      message.channel.startTyping()

      profile.selectedgenres = []
      profile.data = []
      profile.timesviewed = 1

      for (let i = 0; i < 5; i++)
      profile.selectedgenres.push(defaultgenres.splice(
        Math.floor(Math.random() * defaultgenres.length), 1)[0]
      )

      const db = collection_name === 'anidailyrec' ? animeDB : mangaDB;

      const ids = [];

      for (const genre of profile.selectedgenres){
        const selection = db.filter(media => media.genres.includes(genre) && !media.genres.includes('Hentai'))
        ids.push(selection[Math.floor(Math.random() * selection.length)].ids.al)
      }

      const { data, errors } = await query(`query ($ids: [Int]) { Page{ media(id_in: $ids){ siteUrl id idMal isAdult format startDate { year month day } episodes duration chapters volumes genres studios(isMain:true){ nodes{ name siteUrl } } coverImage{ large color } description title { romaji english native userPreferred } } } }`,{ ids })

      message.channel.stopTyping(true)

      // If errored due to ratelimit error
      if (errors && errors.some(x => x.status === 429))
      return message.channel.send(
        new MessageEmbed()
        .setAuthor('Oh no! Mai has been rate-limited', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(
          `**${message.member.displayName}**, please try again in a minute.\n\n`
          + `If this error occurs frequently, please contact **Sakurajimai#6742**.`
        ).setColor('RED')
        .setFooter(`Discover | \©️${new Date().getFullYear()} Mai`)
      );

      // If errored due to validation errors
      if (errors && errors.some(x => x.status === 400))
      return message.channel.send(
        new MessageEmbed()
        .setAuthor('Oops! A wild bug 🐛 appeared!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(
          `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`
          + `Please contact **Sakurajimai#6742** for a quick fix.\n`
          + `You can make an issue on the [repository](${client.config.github}) or [join](https://support.mai-san.ml/) Mai's dev server instead.`
        ).setColor('RED')
        .setFooter(`Discover | \©️${new Date().getFullYear()} Mai`)
      );

      // If errored due to other reasons
      if (errors)
      return message.channel.send(
        new MessageEmbed()
        .setAuthor('Oops! An unexpected error occured!', 'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
        .setDescription(
          `**${message.member.displayName}**, this error wasn't supposed to happen.\n\n`
          + `This might be an issue on Anilist's end. Please try again in a minute\n`
          + `If this doesn't resolve in few hours, you may contact **Sakurajimai#6742**`
          + `You can also make an issue on the [repository](${client.config.github}) or [join](https://support.mai-san.ml/) Mai's dev server instead.`
        ).setColor('RED')
        .setFooter(`Discover | \©️${new Date().getFullYear()} Mai`)
      );

      for (const id of ids){
        profile.data.push(data.Page.media.find(x => x.id === id))
      }

      client.collections.setTo(collection_name, message.author.id, profile)

    }

    const discoveryPages = new Paginate().add(
      new MessageEmbed()
       .setColor('GREY')
       .setTitle(`Get Random ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} Recommendations with your Discovery Queue!`)
       .setThumbnail(message.author.displayAvatarURL({format: 'png', dynamic: true}))
       .setDescription(
        `Your ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} Recommendations Discovery Queue is unique and totally random generated.`
        + `5 random genres out of 17 total genres are selected and random ${collection_name === 'anidailyrec' ? 'anime' : 'manga'} are picked out of those genres for you.`
        + `You get a different ${collection_name === 'anidailyrec' ? 'anime' : 'manga'} recommendations daily so don\'t miss the chance to discover every day.`)
      .addField('\u200b',`${profile.selectedgenres.map(g => `\\🟢 ${g}`).join('\n')}`)
      .addField( profile.timesviewed > 1 ? `Times viewed today:\n${profile.timesviewed + 1}` : '\u200b', '\u200b' )
      .addField('\u200b', 'Start Your Queue by clicking <:next:767062244034084865> below!!')
      .setFooter(`Discover ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} | \©️${new Date().getFullYear()} Mai`)
    )

    let index = 0

    for (const info of profile.data){
      discoveryPages.add(
        new MessageEmbed()
        .setColor(info.coverImage.color || 'GREY')
        .setAuthor(
          `[${profile.selectedgenres[index]}] ${textTrunctuate(info.title.romaji || info.title.english || info.title.native)}`
          + ` | ${fm[info.format]}`, null, info.siteUrl
        )
        .setDescription((info.studios.nodes || []).slice(0,1).map( x => `[${x.name}](${x.siteUrl})`).join(''))
        .addField(
          'Other Titles',
          `**Native**: ${ info.title.native || 'None' }\n`
          + `**Romanized**: ${ info.title.romaji || 'None' }\n`
          + `**English**: ${ info.title.english || 'None' }`
        )
        .addField('Genres', (info.genres || ['','']).reduce((acc, curr, i) => {
          if (!acc || !curr) return ''

          if (info.genres.length === 2) return `${acc} and ${curr}.`

          if (i === info.genres.length - 1) return `${acc}, and ${curr}.`

          return `${acc}, ${curr}`
        }) || '\u200b')
        .addField('Started', `\u200b${months[info.startDate.month || 0]} ${info.startDate.day || ''} ${info.startDate.year}`, true)
        .addField(collection_name === 'anidailyrec' ? 'Episodes' : 'Chapters', info.episodes || info.chapters || 'Unknown.', true)
        .addField(collection_name === 'anidailyrec' ? 'Duration (in minutes)' : 'Volumes', info.duration || info.volumes || 'Unknown.', true)
        .addField('\u200b', `\u200b${textTrunctuate(decode((info.description || '').replace(/<br><br>/g,'\n')), 1000, ` […Read More](https://myanimelist.net/anime/${info.idMal})`)}`)
        .setThumbnail(info.coverImage.large)
        .setFooter(`Discover ${collection_name === 'anidailyrec' ? 'Anime' : 'Manga'} | \©️${new Date().getFullYear()} Mai`)
      )
      index++
    }

    const discoveryPrompt = await message.channel.send(discoveryPages.currentPage)
    const next = client.emojis.cache.get('767062244034084865') || '▶'
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
