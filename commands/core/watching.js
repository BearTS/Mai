const {
  MongooseModels: { guildWatchlistSchema }
  , AniListQuery: query
  , Watching: watching
  } = require('../../helper')

const { Error: MongooseError } = require('mongoose')
const requireText = require('require-text')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'watching'
  , aliases: [
    'watchlist'
    , 'list'
  ]
  , guildOnly: true
  , group: 'core'
  , description: 'View list of currently watching anime.'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: []
  , parameters: ['Anilist or MAL entry link']
  , run: async (client, message) => {

    if (client.guildsettings.profiles.get(message.guild.id).featuredChannels.anisched === null)
    return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Anischedule Feature has been disabled in this server.`)

    let profile = await guildWatchlistSchema.findOne({
      guildID: message.guild.id
    }).catch(err => err)

    if (!profile)
      profile = await new guildWatchlistSchema({
        guildID: message.guild.id
      }).save().catch(()=>null)

    if (profile instanceof MongooseError)
      return message.channel.send(
      )

    if (!profile || !profile.data || !profile.data.length)
      return message.channel.send(
        new MessageEmbed().setColor('RED')
          .setDescription(
            '\u200b\n\n\u2000\u2000<:cancel:767062250279927818>|\u2000\u2000'
          + message.author.tag
          + ', The server\'s current watchlist is empty. You may add anime to watch by using `watch` command.'
          + '\u2000\u2000\n\n\u200b'
        )
      )

    const entries = []

    const embeds = []

    await handleWatchingPage(0)

    async function handleWatchingPage(page){

      const res = await query(watching, {
        watched: profile.data,
        page
      }).catch((err)=> err)

      if (!res || res.errors)
        return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Unable to contact Anilist.co. Please try again later.`)

      for (const media of res.data.Page.media){
        if (media.status === 'RELEASING'){
          entries.push(`\`[ ${media.id} ]\` **[${media.title.romaji}](${media.siteUrl})**`)
        }
      }

      if (res.data.Page.pageInfo.hasNextPage){
        handleWatchingPage(res.data.Page.pageInfo.currentPage + 1)
        return
      }

      return

    }

    let description = '\u200b'

    for (const entry of entries){
      if (2000 - description.length < entry.length) {

        embeds.push( new MessageEmbed()
        .setTitle('Current Announcements')
        .setColor('GREY')
        .setDescription(description)
        .setFooter(`Anischedule (Watchlist) | \©️${new Date().getFullYear()} Mai`)
      )

      description = '\u200b'

      } else {
        description += `\n\u2000•\u2000${entry}\n`
      }
    }

    embeds.push(
      new MessageEmbed()
        .setColor('GREY')
        .setTitle('Current Announcements')
        .setDescription(description)
        .setFooter(`Anischedule (Watchlist) | \©️${new Date().getFullYear()} Mai`)
    )

    for (const embed of embeds){
      await message.channel.send(embed)
    }

    return null
  }
}
