const { MessageEmbed, GuildEmoji } = require('discord.js')
const fetch = require('node-fetch')
const weekdays = [
  'sunday'
  , 'monday'
  , 'tuesday'
  , 'wednesday'
  , 'thursday'
  , 'friday'
  , 'saturday'
]
const {
  ErrorTools: {
    jikanError
  }
  , TextHelpers:  {
    textTrunctuate
    , timeZoneConvert
  }
  , Classes: {
    Paginate
  }
} = require('../../helper')

module.exports = {
  name: 'schedule'
  , aliases: [
    'anitoday'
    , 'airinglist'
    , 'airing'
  ]
  , guildOnly: true
  , cooldown: {
    time: 60000
    , message: 'You are going to fast! Please slow down to avoid being rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
    , 'ADD_REACTIONS'
    , 'USE_EXTERNAL_EMOJIS'
  ]
  , group: 'anime'
  , description: 'Displays the list of currently airing anime for today\'s date or given weekday.'
  , examples: [
    'schedule monday'
    , 'airinglist'
  ]
  , parameters: []
  , run: async (client, message, [ day ]) => {

    if (!day || weekdays.includes(day))
      day = weekdays[new Date().getDay()]

    const embed = new MessageEmbed()
                  .setColor('YELLOW')
                  .setThumbnail('https://i.imgur.com/u6ROwvK.gif')
                  .setDescription(`\u200B\n Fetching **${day}** anime schedules from <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net 'MyAnimeList Homepage').\n\u200B`)

    let msg = await message.channel.send(embed)

    let res = await fetch(`https://api.jikan.moe/v3/schedule/${day}`)
                      .then(res => res.json())

      if (!res || res.error){
        res = res
              ? res
              : {}
        embed.setColor('RED')
             .setThumbnail(null)
             .setDescription(`\u200b\n\u2000\u2000<:cancel:712586986216489011> | ${
               jikanError(res.status)
             }\n\u200b`)

        return await msg.edit(embed).catch(()=>null)
               ? null
               : await message.channel.send(embed).then(()=>null)
      }


      const elapsed = Date.now() - message.createdTimestamp

      const pages = new Paginate()

      for ( const { title, image_url, url, score, synopsis, type, airing_start, source, genres, producers, licensors } of res[day] ){
        await pages.add( new MessageEmbed()
          .setColor('GREY')

          .setThumbnail(image_url)

          .setDescription(`${
              score
              ? `Score: ${score}\n\n`
              : ''}${textTrunctuate(synopsis,300,`...[Read More](${url})`)}`)

          .setAuthor(title, image_url, url)

          .addField('Type', type, true)

          .addField('Started', timeZoneConvert(airing_start), true)

          .addField('Source', source, true)

          .addField('Genres', `\u200b${genres.map( ({ name, url }) => `[${name}](${url})`).join(' • ')}`, true)

          .addField('Producers', `\u200b${producers.map( ({ name, url }) => `[${name}](${url})`).join(' • ')}`, true)

          .addField('Licensors',
              licensors.length
              ? licensors.join(' • ')
              : 'None', true)

          .setFooter(`MyAnimeList.net • Search Duration: ${(elapsed / 1000).toFixed(2)} seconds • Page ${pages.size} of ${res[day].length}`))
      }

      msg = await msg.edit(pages.currentPage).catch(()=>null)
            ? msg
            : await message.channel.send(pages.currentPage)

      if (pages.size === 1) return

      const prev = client.emojis.cache.get('712581829286166579') || '◀'
      const next = client.emojis.cache.get('712581873628348476') || '▶'
      const terminate = client.emojis.cache.get('712586986216489011') || '❌'

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

    collector.on('end', async () => await msg.reactions.removeAll().catch(()=>null) ? null : null)

  }
}
