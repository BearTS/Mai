const {
  MongooseModels: {
    guildWatchlistSchema
  }
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
  , description: 'Removes a watched anime from your watchlist'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'unwatch https://myanimelist.net/anime/37450/Seishun_Buta_Yarou_wa_Bunny_Girl_Senpai_no_Yume_wo_Minai'
    , 'unwatch 37450'
  ]
  , parameters: ['Anilist or MAL entry link']
  , run: async (client, message) => {

    if (client.guildsettings.profiles.get(message.guild.id).featuredChannels.anisched === null)
    return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Anischedule Feature has been disabled in this server.`)

    let profile = await guildWatchlistSchema.findOne({
      guildID: message.guild.id
    }).catch(err => err)

    if (!profile)
      profile = await new guildWatchlistSchema({
        guildID: message.guild.id
      }).catch(err => err)

    if (profile instanceof MongooseError)
      return message.channel.send(
      )

    if (!profile.data || !profile.data.length)
      return message.channel.send(
        new MessageEmbed().setColor('RED')
          .setDescription(
            '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
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
        return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Unable to contact Anilist.co. Please try again later.`)

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
    )

    for (const embed of embeds){
      await message.channel.send(embed)
    }

    return null
  }
}
