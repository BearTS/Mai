const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')
const {
    MongooseModels: {
      guildWatchlistSchema
  }
  , AniListQuery: query
} = require('../../helper')

module.exports = {
  name: 'unwatch',
  aliases: ['anischedremove', 'anischedunwatch'],
  guildOnly: true,
  adminOnly: true,
  group: 'setup',
  description: ['Removes a watched anime from your watchlist'],
  examples: ['unwatch https://myanimelist.net/anime/37450/Seishun_Buta_Yarou_wa_Bunny_Girl_Senpai_no_Yume_wo_Minai'],
  parameters: ['Anilist or MAL entry link'],
  run: async ( client, message, args ) => {

    if (client.guildsettings.profiles.get(message.guild.id).suggestChannel === null)
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
        new MessageEmbed().setColor('RED')
          .setDescription(
            '\u200b\n\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
          + 'Unable to contact the database. Please try again later or report this incident to my developer.'
          + '\u2000\u2000\n\n\u200b'
        )
      )

    if (!args.length)
    return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You need to provide the anime link(s) to unwatch for.`)

    let mal = (/(?<=myanimelist\.net\/anime\/)(.\d*)/gi).test(args.join(' '))
            ? args.join(' ').match(/(?<=myanimelist\.net\/anime\/)(.\d*)/gi)[0]
            : null
    let al  = (/(?<=anilist\.co\/anime\/)(.\d*)/gi).test(args.join(' '))
            ? args.join(' ').match(/(?<=anilist\.co\/anime\/)(.\d*)/gi)[0]
            : null

    if (!mal && !al)
        return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, You need to provide the anime link(s) to unwatch for.`)

        const info = mal
                ? await query('query ($Id: Int) {Media(idMal: $Id, type: ANIME) {id title { romaji english native } status coverImage { large color} nextAiringEpisode { episode timeUntilAiring}}}', { Id: mal })
                  .then(res => {
                    if (res.errors) return res
                    return res.data.Media
                  })
                : await query('query ($watched: Int) { Media(id: $watched, type: ANIME) {id title { romaji english native } status coverImage{ large color } nextAiringEpisode{ episode timeUntilAiring}}}',{ watched:al })
                  .then(res => {
                    if (res.errors) return res
                    return res.data.Media
                  })

    if (info.errors && info.errors[0].status !== 404)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Couldn't contact Anilist.co. Please try again in a minute.`)

    if (info.errors && info.errors[0].status === 404)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, The link you provided does not match any anime.`)

    if (!info)
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, The link you provided does not match any anime.`)

    if (!profile.data.includes(info.id))
      return message.channel.send(
        new MessageEmbed()
        .setColor('RED')
        .setThumbnail(info.coverImage.large)
        .setDescription(
         '\u200b\n\u2000\u2000<:cancel:712586986216489011>|\u2000\u2000'
        + `The anime **${
         info.title.romaji
         ? info.title.romaji
           : info.title.english
           ? info.title.english
             : info.title.native
         }** is currently not on your watchlist. \n[Use \`watch\` to watch for it instead. Note that finished airing anime cannot be added.]\u2000\u2000\n\u200b`
       )
     )

    profile.data.splice(profile.data.indexOf(info.id), 1)

    return profile.save()
      .then(()=> {
        return message.channel.send(
          new MessageEmbed()
            .setColor(info.coverImage.color)
            .setThumbnail(info.coverImage.large)
            .setDescription(`Successfully removed **${
                info.title.romaji
                ? info.title.romaji
                : info.title.english
                  ? info.title.english
                  : info.title.native
              }**!`)
        )
      })
        .catch((err)=> message.channel.send(`<:cancel:712586986216489011> | ${message.author}, There was a problem saving your configuration. Please retry again in a minute. If you keep getting this message, contact my developer through the \`feedback\` command.`)
    )


  }
}
