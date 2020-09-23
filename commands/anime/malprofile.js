require('moment-duration-format')
const { duration } = require('moment')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const {
  TextHelpers : {
    textTrunctuate
    , timeZoneConvert
  }
  , MongooseModels: {
    malProfileSchema
  }
  , ErrorTools: {
    jikanError
  }
} = require('../../helper')

module.exports = {
  name: 'malprofile'
  , aliases: [
    'mal-of'
    , 'malstat'
    , 'mal'
    , 'malof'
  ]
  , guildOnly: true
  , cooldown: {
    time: 10000
    , message: 'You are going to fast! Please slow down to avoid being rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , group: 'anime'
  , description: 'Get user stats from <:mal:722270009761595482> [MAL](https://myanimelist.net "MyAnimeList Homepage")'
  , examples: [
    'malprofile 545427431662682112'
    , 'malprofile @user'
    , 'malprofile set Username'
    , 'malprofile set NewUser -update'
  ]
  , parameters: [
    'userID'
  ]
  , run: async ( { config: { prefix } } , message, [ usermention, ...info ] ) => {

    if (!usermention || !usermention.startsWith('<@') && isNaN(usermention) && !['self','set'].includes(usermention.toLowerCase()))
    return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, Please mention the user or provide his discord ID. Type \`self\` instead to view own profile.`)

    if (!usermention.startsWith('<@') && usermention.includes(message.mentions.users.first())) usermention = message.mentions.users.first().id

    if (usermention.toLowerCase() === 'self') usermention = message.author.id

    if (usermention.toLowerCase() === 'set') {

      const database = await malProfileSchema.findOne({userID: message.author.id})

      if (database && !info[1] || !['-update','-u'].includes(info[1]))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, your account is already linked to MAL. If you wish to replace it, add a \`-update\` tag at the end of your command.`)

      const data = await fetch(`https://api.jikan.moe/v3/user/${encodeURI(info[0])}/profile`).then(res => res.json())

        if (data.status) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, ${data.status == 404 ? `User ${info[0]} doesn't exist on MAL` : jikanError(data.status)}`)

        if (['-update','-u'].includes(info[1])){

          database.MALUser = data.username
          database.MALId = data.user_id

          await database.save()
          return message.channel.send(`**${message.author.tag}**, your MAL list was successfully updated!`)

        }

      database = await new Profile({ userID: message.author.id, MALUser: data.username, MALId: data.user_id}).save()

      if (!database) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, I couldn't save your MAL Profile on my database, please try again later.`)

      return message.channel.send(`**${message.author.tag}**, your MAL list was successfully linked to **${data.username}**!`)

  }

  const valid = await message.guild.members.fetch(usermention)

  if (!valid) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, The provided user ID can't be found anywhere on this server`)

  const database = await malProfileSchema.findOne({userID: usermention}).catch(()=>{})

  if (!database) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, ${valid.id === message.author.id ? `seems like you haven't linked your profile yet. Link your profile by typing \`${prefix}malprofile set [mal username]\`` : ` **${valid.displayName}** haven't linked their profile yet.`}`)

  const data = await fetch(`https://api.jikan.moe/v3/user/${database.MALUser}/profile`).then(res => res.json())

    if (data.status) return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, ${data.status == 404 ? valid.id === message.author.id ? `could not find the user you linked your account to. If you renamed your MAL profile, please update it here using \`${prefix}malprofile set [new mal username] -update\`.` : `**${valid.displayName}**'s MAL account could not be found.` : jikanError(data.status)}`)

    const { username, about, gender, location, joined, last_online, image_url, url, anime_stats, manga_stats, favorites: { anime, manga, characters, people } } = data
    const total = anime_stats.episodes_watched + manga_stats.volumes_read

    return message.channel.send(new MessageEmbed()
      .setAuthor(`${username}'s Profile`, image_url, url)
      .setThumbnail(`https://i.imgur.com/${total > 19999 ? 'MzmmlUG' : total > 14999 ? 'phrKQJI' : total > 9999 ? '01NgPDw' : total > 4999 ? 'rabLZqh' : total > 999 ? 'dZ8bNQW' : total > 499 ? 'DKHajgw' : 'YGLefI9' }.png`)
      .setDescription(`${about ? textTrunctuate(about, 350, `...[Read More](${url})\n\n`) : ''}• **Gender**: ${gender}\n• **From** ${location}\n• **Joined MAL:** ${timeZoneConvert(joined).split(' ').splice(0,3).join(' ')}, *${duration(Date.now() - new Date(joined)).format('Y [year] M [months] D [days]')} ago.*\n• **Last Seen:** ${timeZoneConvert(last_online).split(' ').splice(0,3).join(' ')}, *${duration(Date.now() - new Date(last_online)).format('Y [year] M [month] D [days] H [hours] m [minutes]')} ago.*`)
      .addField('Anime Stats', `\u200B\u2000\u2000• **Days watched**: ${anime_stats.days_watched}\n\u2000\u2000• **Mean Score**: ${anime_stats.mean_score}\n\u2000\u2000• **Watching**: ${anime_stats.watching}\n\u2000\u2000• **Completed**: ${anime_stats.completed}\n\u2000\u2000• **On Hold**: ${anime_stats.on_hold}\n\u2000\u2000• **Dropped**: ${anime_stats.dropped}\n\u2000\u2000• **Plan to Watch**: ${anime_stats.plan_to_watch}\n\u2000\u2000• **Rewatched**: ${anime_stats.rewatched}\n\u2000\u2000• **Total Entries:** ${anime_stats.total_entries}\n\u2000\u2000• **Episodes Watched**: ${anime_stats.episodes_watched}`,true)
      .addField('Manga Stats',`\u200B\u2000\u2000• **Days read**: ${manga_stats.days_read}\n\u2000\u2000• **Mean Score**: ${manga_stats.mean_score}\n\u2000\u2000• **Reading**: ${manga_stats.reading}\n\u2000\u2000• **Completed**: ${manga_stats.completed}\n\u2000\u2000• **On Hold**: ${manga_stats.on_hold}\n\u2000\u2000• **Dropped**: ${manga_stats.dropped}\n\u2000\u2000• **Plan to Read**: ${manga_stats.plan_to_read}\n\u2000\u2000• **Reread**: ${manga_stats.reread}\n\u2000\u2000• **Total Entries:** ${manga_stats.total_entries}\n\u2000\u2000• **Volumes read**: ${manga_stats.volumes_read}`,true)
      .addField('Favorite Anime', anime.length ? `\u2000${anime.splice(0,5).map( a => `[${a.name}](${a.url})`).join(' • ')}${anime.length - 5 > 1 ? ` and ${anime.length - 5} more...` : ''}` : 'None Listed')
      .addField('Favorite Manga', manga.length ? `\u2000${manga.splice(0,5).map( a => `[${a.name}](${a.url})`).join(' • ')}${manga.length - 5 > 1 ? ` and ${manga.length - 5} more...` : ''}` : 'None Listed')
      .addField('Favorite Character',  characters.length ? `\u2000${characters.splice(0,5).map( a => `[${a.name}](${a.url})`).join(' • ')}${characters.length - 5 > 1 ? ` and ${characters.length - 5} more...` : ''}` : 'None Listed')
      .addField('Favorite People',  people.length ? `\u2000${people.splice(0,5).map( a => `[${a.name}](${a.url})`).join(' • ')}${people.length - 5 > 1 ? ` and ${people.length - 5} more...` : ''}` : 'None Listed')
      .setTimestamp()
      .setColor('GREY')
      .setFooter('MyAnimeList.net','https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png')
    )
  }
}
