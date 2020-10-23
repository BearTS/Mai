require('moment-duration-format')
const { duration } = require('moment')
const { Error: MongooseError } = require('mongoose')
const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { TextHelpers: text, MongooseModels: model, ErrorTools: error } = require('../../helper')

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
  , message: 'You are going too fast! Please slow down to avoid being rate-limited!'
 }
 , clientPermissions: [
  'EMBED_LINKS'
 ]
 , group: 'anime'
 , description: 'Get user stats from <:mal:722270009761595482> [MAL](https://myanimelist.net "MyAnimeList Homepage")'
 , examples: [
  'malprofile 545427431662682112'
  , 'malprofile @user'
  , 'malprofile Username -set'
  , 'malprofile NewUser -update'
 ]
 , parameters: [
  'userID'
 ]
 , run: async ( client , message, info ) => {

  const match = message.content.match(/\d{17,19}/);

  //check if a user is provided and it doesn't belong to the server
  //will cause false-positive for account names only having 17-19 digits
  if (match && await !message.guild.members.fetch(match[0]).catch(() => null))
  return message.channel.send(
    new MessageEmbed().setDescription(
        '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
      + 'The User you mentioned or the ID you provided doesn\'t seem to match any user in this server.'
      + '\n\nMake sure the suplied parameter is a valid user ID or a user mention.'
    ).setColor('RED')
  )

  //define member
  const member = match ? await message.guild.members.fetch(match[0]) : message.member

  //fetch the userdata and create a new one if userdata doesn't exist
  let data = await model.malProfileSchema.findOne({
    userID: member.id
  }).catch(() => null ) || await new model.malProfileSchema({
    userID: member.id
  }).save().catch(() => null )

  //check if mongoose didn't respond sucessfully
  if (!data || data instanceof MongooseError)
  return message.channel.send(
    new MessageEmbed().setDescription(
        '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
      + 'Unable to contact the database. Please try again later or report this incident to my developer.'
      + '\u2000\u2000\n\n\u200b'
    ).setColor('RED')
  )

  // Check if user has a linked account if modifiers were not present.
  if ((!data.MALUser || !data.MALId) && !['-set', '-u', '-update'].includes(info[info.length - 1])){
    if (member.id === message.author.id){
      return message.channel.send(
        new MessageEmbed().setDescription(
            '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
          + `**${message.member.displayName}**, No associated <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net/) account has been found in your account!`
          + '\n\nYou may inform them to link their MAL account to their profile instead.'
          + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
        ).setColor('RED')
      )
    } else {
      return message.channel.send(
        new MessageEmbed().setDescription(
            '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
          + `**${message.member.displayName}**, No associated <:mal:722270009761595482> [MyAnimeList](https://myanimelist.net/) account has been found in **${member.displayName}**'s account!`
          + '\n\nYou can set up one by providing your MAL username and attaching the `-set` modifier at the end.'
          + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
        ).setColor('RED')
      )
    }
  }

  //start of setup
  //checks if a modifier is provided
  if (['-set', '-u', '-update'].includes(info[info.length - 1])){
    if (info.length > 1 && member.id !== message.author.id)
      return message.channel.send(
        new MessageEmbed().setDescription(
            '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
          + `**${message.member.displayName}**, You are not authorized to \`update\` **${member.displayName}**(${member.user.tag})'s MAL account!`
          + '\n\nYou may inform them to link their MAL account to their profile instead.'
          + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
        ).setColor('RED')
      )

    // Checks if there is a username provided
    if (info.length === 1)
      return message.channel.send(
        new MessageEmbed().setDescription(
          '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
          + `**${message.member.displayName}**, Please include the **MAL username** you want your account to be linked to!`
          + `\n\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
        ).setColor('RED')
      )

    const modifier = info.pop()

    //Checks if there is an existing account in the database
    if (await model.malProfileSchema.findOne({
      userID: message.author.id !== member.id ? member.id : null ,
      MALUser: info.join(' ')
    }).catch(()=> null))
    return message.channel.send(
      new MessageEmbed().setDescription(
        '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
        + `**${message.member.displayName}**, The username you provided **${info.join(' ')}** has already been used!`
        + '\n\n**This rarely happens, but why does this happen anyway?**'
        + '\n\u2000\u2000• The username you provided has subtle difference between your account and this. Check your spelling.'
        + '\n\u2000\u2000• Your MAL account might have been linked by others unauthorizedly. [Report](https://support.mai-san.ml/)'
        + '\n\u2000\u2000• You just don\'t own this account in any way.'
        + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
      ).setColor('RED')
    )

    // Checks mismatch of modifiers
    if (data.MALUser && modifier === '-set' || !data.MALUser && ['-u', '-update'].includes(modifier))
    return message.channel.send(
      new MessageEmbed().setDescription(
        '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
        + `**${message.member.displayName}** ${data.MALUser ? 'You already have an existing MAL account linked in your account!' : 'You haven\'t set any account yet. Set account first before updating.'}`
        + '\n\n**Use the proper modifiers**\n`-set` - linking for the first time\n`-update` - for updating your account (for any changes in your MAL profile)'
        + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
      ).setColor('RED')
    )

    //Checks the validity of the account
    const account = await fetch(`https://api.jikan.moe/v3/user/${encodeURI(info[0])}/profile`).then(res => res.json().catch(() => {}))

   if (!account || account.status)
   return message.channel.send(
     new MessageEmbed().setDescription(
       '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
       + `**${message.member.displayName}**, ${account.status == 404 ? `User **${info.join(' ')}** doesn't exist on MAL.` : jikanError(account.status)}`
       + `\n\n${account.status == 404 ? 'Make sure your <:mal:722270009761595482> [MyanimeList](https://myanimelist.net/) account is not set to private.\n\n' : ''}`
       + '**Use the proper modifiers**\n`-set` linking for the first time\n`-update` for updating your account (for any changes in your MAL profile)'
       + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
     ).setColor('RED')
   )

   //link the MAL to discord profile
   data.MALUser = account.username
   data.MALId = account.user_id

   return data.save().then(() =>
   message.channel.send(
    new MessageEmbed().setDescription(
        '<a:animatedcheck:758316325025087500>\u2000\u2000|\u2000\u2000'
        + `Success! Your account is now linked to **${data.MALUser}**!
        \n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
      ).setColor('GREEN')
    )
   ).catch(() =>
   message.channel.send(
     new MessageEmbed().setDescription(
       `\u2000\u2000<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000Failed to save configuration to Mongo Client [Database Provider]. Please try again later.
     `).setColor('RED')
   ))
  }

  //end of setup
  //fetch the data from jikan
  let jikan = await fetch(`https://api.jikan.moe/v3/user/${data.MALUser}/profile`).then(res => res.json())

  //check if jikan did not respond successfully
  if (!jikan)
  return message.channel.send(
    new MessageEmbed().setDescription(
      '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
      + `**${message.member.displayName}*, MAL responded with an unknown error code. Please try again later.`
      + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
    ).setColor('RED')
  )

  //check if jikan's response correspond to an error code.
  if (jikan.status)
  return message.channel.send(
    new MessageEmbed().setDescription(
      '<:cancel:712586986216489011>\u2000\u2000|\u2000\u2000'
      + `**${message.member.displayName}**, ${
        account.status == 404
        ? member.id === message.author.id
          ? `could not find the user you linked your account to. If you renamed your MAL profile, please update it here using \`${prefix}malprofile [new mal username] -update\`.`
          : `**${member.displayName}**'s MAL account could not be found.`
        : jikanError(account.status)}`
      + `\n[Learn more](https://mai-san.ml/) about how we link your MAL and how we access and store it's data.`
    ).setColor('RED')
  )

  //unpack the data from jikan
  const { username, about, gender, location, joined, last_online, image_url, url, anime_stats, manga_stats, favorites: { anime, manga, characters, people } } = jikan
  const total = anime_stats.episodes_watched + manga_stats.volumes_read
  let anime_uncounted = 0
  let manga_uncounted = 0
  let chara_uncounted = 0
  let staff_uncounted = 0

  return message.channel.send(
    new MessageEmbed()
    .setAuthor(`${username}'s Profile`, image_url, url)
    .setThumbnail(`https://i.imgur.com/${total > 19999 ? 'MzmmlUG' : total > 14999 ? 'phrKQJI' : total > 9999 ? '01NgPDw' : total > 4999 ? 'rabLZqh' : total > 999 ? 'dZ8bNQW' : total > 499 ? 'DKHajgw' : 'YGLefI9' }.png`)
    .setDescription(
      `${about ? text.textTrunctuate(about, 350, `...[Read More](${url})`) : ''}
      \n• **Gender**: ${gender}
      • **From** ${location}
      • **Joined MAL:** ${text.timeZoneConvert(joined).split(' ').splice(0,3).join(' ')}, *${duration(Date.now() - new Date(joined)).format('Y [year] M [month and] D [day]')} ago.*
      • **Last Seen:** ${text.timeZoneConvert(last_online).split(' ').splice(0,3).join(' ')}, *${duration(Date.now() - new Date(last_online)).format('Y [year] M [month] D [day] H [hour and] m [minute]')} ago.*`
    )
    .addField(
      'Anime Stats',
      `\`\`\`fix
  • Days watched:${spacedRes(10, anime_stats.days_watched)}
  • Mean Score:${spacedRes(12, anime_stats.mean_score)}
  • Watching:${spacedRes(14, anime_stats.watching)}
  • Completed:${spacedRes(13, anime_stats.completed)}
  • On Hold:${spacedRes(15, anime_stats.on_hold)}
  • Dropped:${spacedRes(15, anime_stats.dropped)}
  • Plan to Watch:${spacedRes(9, anime_stats.plan_to_watch)}
  • Rewatched:${spacedRes(13, anime_stats.rewatched)}
  • Total Entries:${spacedRes(9, anime_stats.total_entries)}
  • Episodes Watched:${spacedRes(6, anime_stats.episodes_watched)}\`\`\``,
      true
    )
    .addField(
      'Manga Stats',
      `\`\`\`fix
  • Days read:${spacedRes(13, manga_stats.days_read)}
  • Mean Score:${spacedRes(12, manga_stats.mean_score)}
  • Reading:${spacedRes(15, manga_stats.reading)}
  • Completed:${spacedRes(13, manga_stats.completed)}
  • On Hold:${spacedRes(15, manga_stats.on_hold)}
  • Dropped:${spacedRes(15, manga_stats.dropped)}
  • Plan to Read:${spacedRes(10, manga_stats.plan_to_read)}
  • Reread:${spacedRes(16, manga_stats.reread)}
  • Total Entries:${spacedRes(9, manga_stats.total_entries)}
  • Volumes read:${spacedRes(10, manga_stats.volumes_read)}\`\`\``,
      true
    )
    .addField(
      'Favorite Anime',
      anime.length
      ? `${anime.map( a => `[${a.name}](${a.url.split('/').splice(0,5).join('/')})`)
           .reduce((acc, curr) => {
             if (acc.length + curr.length + 3 > 1000){
              anime_uncounted++
              return acc
            }
             acc = acc + ' • '
             return acc + curr
           })
         }${anime_uncounted ? `and ${anime_uncounted} more!` : ''}`
      : 'None Listed'
    )
    .addField(
      'Favorite Manga',
      manga.length
      ? `${manga.map( a => `[${a.name}](${a.url.split('/').splice(0,5).join('/')})`)
           .reduce((acc, curr) => {
             if (acc.length + curr.length + 3 > 1000){
              manga_uncounted++
              return acc
            }
             acc = acc + ' • '
             return acc + curr
           })
         }${manga_uncounted ? `and ${manga_uncounted} more!` : ''}`
      : 'None Listed'
    )
    .addField(
      'Favorite Character',
      characters.length
      ? `${characters.map( a => `[${a.name}](${a.url.split('/').splice(0,5).join('/')})`)
           .reduce((acc, curr) => {
             if (acc.length + curr.length + 3 > 1000){
              chara_uncounted++
              return acc
            }
             acc = acc + ' • '
             return acc + curr
           })
         }${chara_uncounted ? `and ${chara_uncounted} more!` : ''}`
      : 'None Listed'
    )
    .addField(
      'Favorite Staff',
      people.length
      ? `${people.map( a => `[${a.name}](${a.url.split('/').splice(0,5).join('/')})`)
           .reduce((acc, curr) => {
             if (acc.length + curr.length + 3 > 1000){
              staff_uncounted++
              return acc
            }
             acc = acc + ' • '
             return acc + curr
           })
         }${staff_uncounted ? `and ${staff_uncounted} more!` : ''}`
      : 'None Listed'
    ).setTimestamp()
    .setColor('GREY')
    .setFooter('MyAnimeList.net | ©️2020 Mai','https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png')
  )
 }
}

function spacedRes(max, val){
  return ' '.repeat(max - val.toString().length) + val
}
