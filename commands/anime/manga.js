const fetch = require('node-fetch')
const Pages = require('../../struct/Paginate')
const { MessageEmbed, GuildEmoji } = require('discord.js')
const {
    TextHelpers: {
      commatize
    , timeZoneConvert
    }
  , ErrorTools: {
      jikanError
    }
  } = require('../../helper')

module.exports = {
  name: "manga"
  , aliases: [
    'comic'
    , 'manhwa'
    , 'manhua'
  ]
  , guildOnly: true
  , cooldown: {
    time: 10000
    , message: 'Oops! You are going too fast! Please slow down to avoid being rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
    , 'USE_EXTERNAL_EMOJIS'
    , 'ADD_REACTIONS'
  ]
  , group: 'anime'
  , image: 'https://files.catbox.moe/1im628.gif'
  , description: 'Searches for a Manga / Manhwa / Manhua in <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net.co "Homepage").'
  , examples: [
    'manga aobuta'
    , 'comic seishun buta yarou'
  ]
  , parameters: [
    'search query'
  ]
  , run: async (client, message, args) => {

    const query = args.length
    ? args.join(' ')
    : 'Seishun Buta Yarou Series'

    const embed = new MessageEmbed()
    .setColor('YELLOW')
    .setDescription(`Searching for manga titled **${
      query
    }** on <:mal:767062339177676800> [MyAnimeList](https://myanimelist.net 'Homepage').`)
    .setThumbnail('https://i.imgur.com/u6ROwvK.gif')

    let msg = await message.channel.send(embed)

    const data = await fetch(`https://api.jikan.moe/v3/search/manga?q=${encodeURI(query)}&page=1`)
      .then( res => res.json())

      embed.setColor('RED')
      .setAuthor(
        !data.error && !data.results.length
        ? 'None Found'
        : 'Response Error'
        ,'https://cdn.discordapp.com/emojis/767062250279927818.png?v=1'
      )
      .setDescription(
        !data.error && !data.results.length
        ? `**${message.member.displayName}**, No results were found for **${query}**!\n\n`
        + `If you believe this manga exists, try the following methods:\n`
        + `• Try the alternative names (e.g. English, Native, Romaji).\n`
        + `• Include the volume number (if it exists).\n`
        : jikanError( data ? data.status : null)
      )


    if (!data || data.error || !data.results.length)
      return await msg.edit(embed).catch(()=> null)
      ? null
      : await message.channel.send(embed).then(()=> null)

    const elapsed = Date.now() - message.createdAt

    const pages = new Pages()

    for (const res of data.results.slice(0,10)) {
      pages.add( new MessageEmbed()
        .setAuthor(res.title, res.image_url, res.url)
        .setColor('GREY')
        .setDescription(res.synopsis)
        .setThumbnail(res.image_url)
        .spliceFields(0,8)
        .addField('Type', res.type, true)
        .addField('Status', res.publishing ? 'Publishing' : 'Finished', true)
        .addField('Chapters', res.chapters, true)
        .addField('Members', commatize(res.members), true)
        .addField('Score', res.score, true)
        .addField('Volumes', res.volumes, true)
        .addField('Start Date', timeZoneConvert(res.start_date), true)
        .addField('End Date', res.end_date ? timeZoneConvert(res.end_date) : 'Unknown', true)
        .addField('\u200B','\u200B',true)
        .setFooter(`Search duration: ${(elapsed / 1000).toFixed(2)} seconds\u2000\u2000•\u2000\u2000Page ${pages.size + 1} of ${data.results.slice(0,10).length}\u2000\u2000•\u2000\u2000Manga Query with MAL | \©️${new Date().getFullYear()} Mai`)
      )
    }

    msg = await msg.edit(pages.firstPage).catch(()=>null)
    ? msg
    : await message.channel.send(pages.firstPage)

    if (pages.size === 1) return

    const prev = client.emojis.cache.get('767062237722050561') || '◀'
    const next = client.emojis.cache.get('767062244034084865') || '▶'
    const terminate = client.emojis.cache.get('767062250279927818') || '❌'

    const collector = msg.createReactionCollector( (reaction, user) => user.id === message.author.id)
    const navigators = [ prev, next, terminate ]

    for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i])

    let timeout = setTimeout(()=> collector.stop(), 90000)

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

  collector.on('end', async () => await msg.reactions.removeAll().catch(()=>null) ? null : null )

  }
}
