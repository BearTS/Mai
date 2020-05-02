const { getAnnouncementEmbed, getFromNextDays, query } = require('../../utils/anischedule/utils.js')
const { getMediaId, promiseWhile, sendWatchingList } = require('../../utils/anischedule/helpers.js')
const watchlist = require('../../models/guildWatchlistSchema.js')
const { default : { prefix } } = require('../../settings.json')
const requireText = require('require-text')
const { magenta } = require('chalk')
const { MessageEmbed } = require('discord.js')
const allowedResponses = ['add','channel','clean','list', 'next', 'remove', 'setchannel']

module.exports.run = ( client, message, args ) => {

if (!args.length || args[0].toLowerCase() === 'help') return help(message)

if (!allowedResponses.includes(args[0])) return message.react("👎");

watchlist.findOne({guildID: message.guild.id}, async (err, data) => {

  if (err) return console.log(`${magenta('[Mai-Promise ERROR]')} : Unable to connect to MongoDB.`)

  if (!data) {

    if (args[0] !== 'setchannel' || !message.mentions.channels.size) return message.reply(`No channel has been set for logging anime schedules. Please set by using \`${prefix}anisched setchannel [channel mention]\`.`)

    return data = await new watchlist({  guildID: message.guild.id , channelID: message.mentions.channels.first().id, data: []}).save()

  }

  switch(args[0].toLowerCase()){
//=============================================================================
    case 'add':
      if (!args[1]) return message.react("👎");

      const watchID = await getMediaId(args[1])
      if (!watchID || data.data.includes(watchID)){
        return message.react("👎")
      }

      data.data.push(watchID)
      data.save().then(()=>{ message.react('👍') }).catch(()=>{ message.react("👎") })

    break;
//=============================================================================
    case 'channel':
      message.channel.send(`Currently announcing anime releases in ${message.guild.channels.cache.get(data.channelID)}!`)
    break;
//=============================================================================
    case 'clean':
      if ( !data.data || !data.data.length ) {
        return message.react("👎")
      }

      function handlePage(page = 0) {
        return query(requireText('../../utils/anischedule/query/Watching.graphql',require), {watched: data.data, page}).then( res => {
          return res;
        })
      }

      let finished;

      return handlePage().then( res => res.data.Page).then(res => promiseWhile(res, val => {
        finished = val.media.filter( e => e.status === 'FINISHED').map( e => e.id)
        return val.pageInfo.hasNextPage
      }, val => handlePage(val.pageInfo.currentPage + 1).then(res => res.data.Page))).then(()=>{

        data.data = data.data.filter( e => !finished.includes(e));

        if (finished.length > 0) {
          data.save().then(()=>{
            message.channel.send(`Removed **${finished.length}** shows from the list.`);
            message.react("👍")
          }).catch(() => {
            message.react("👎");
          })
        } else {
          message.react("👎");
        }

      })

    break;
//=============================================================================
    case 'list':
        if ( !data.data || !data.data.length ){
          return message.react("👎")
        }
        handleWatchingPage(0)

        function handleWatchingPage(page) {
          query(requireText("../../utils/anischedule/query/Watching.graphql",require), {watched: data.data, page}).then(res => {
            let description = ''
            res.data.Page.media.forEach( m => {
              if (m.status !== 'RELEASING') return

              const nextLine = `\n- [${m.title.romaji}](${m.siteUrl}) (\`${m.id}\`)`
              if (1000 - description.length < nextLine.length){
                sendWatchingList(description, message.channel)
                description = ''
              }

              description += nextLine
            })

            if (description.length !== 0) sendWatchingList(description,message.channel)

            if (res.data.Page.pageInfo.hasNextPage){
              handleWatchingPage(res.data.Page.pageInfo.currentPage + 1)
              return
            }

            if (!description.length) return message.channel.send("No currently airing shows are being announced.")
          })
        }

    break;
//=============================================================================
    case 'next':
        if ( !data.data || !data.data.length ){
          return message.react("👎")
        }

        query(requireText('../../utils/anischedule/query/Schedule.graphql',require), {page: 0, watched: data.data, nextDay: Math.round(getFromNextDays(7).getTime() / 1000)}).then( res => {
          if (res.errors){
            return console.log(`${magenta('[Mai-Promise ERROR]')} :\n${JSON.stringify(res.errors)}`);
          }

          if (!res.data.Page.airingSchedules.length) {
            return message.react("👎")
          }

          const anime = res.data.Page.airingSchedules[0]
          const embed = getAnnouncementEmbed(anime, new Date(anime.airingAt * 1000), true)
          message.channel.send(embed)
        })

    break;
//=============================================================================
    case 'remove':
      if ( !data.data || !data.data.length ){
        return message.react("🤷")
      }

      if (!args[1]) return message.react("👎");

      const watchId = await getMediaId(args[1]);
      if (!watchId || !data.data.includes(watchId)){
        return message.react("👎");
      }

      data.data.splice(data.data.indexOf(watchId),1)
      data.save().then(()=>{ message.react('👍') }).catch(()=>{ message.react("👎") })

    break;
//=============================================================================
    case 'setchannel':
      if (!message.mentions.channels.size) return message.reply(`Please mention a channel.`)
      if (!message.mentions.channels.first().permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.reply(`I can't send messages on that channel!`)
      data.channelID = message.mentions.channels.first().id
      data.save().then(()=>{ message.react('👍') }).catch(()=>{ message.react("👎") })

    break;
    default:
    }
  })
}

module.exports.config = {
  name: 'anisched',
  aliases: [],
  group: 'setup',
  guildOnly: true,
  description: `Setup the airing-anime monitor on your server! Type \`${prefix}anisched help\` for a guide on how to set up one.`,
  examples: ['anisched help'],
  parameters: ['subcommands', 'queries'],
  modOnly: true
}

function help(message){
  message.channel.send( new MessageEmbed().setTitle('Anischedule Help [Additional Commands List]')
    .setAuthor(message.client.user.username +" | AniSchedule", message.client.user.avatarURL, "https://anilist.co")
    .setColor(3092790)
    .setDescription("Anischedule is an extension command inspired by [TehNut](https://github.com/TehNut)\nSupport him at [GitHub](https://github.com/TehNut/AniSchedule) | [Anilist](https://anilist.co/user/TehNut/)\n\nUsage of the commands are `" + prefix + "anisched [subcommand] [parameter <if required>]`\n\n\u200B**Subcommand List**")
    .setFooter("Visit TehNut's Github page for information on source code.")
    .addFields(
      {name: 'add', value: 'Adds a new anime to watch for new episodes of. You may provide an AniList entry link or a MyAnimeList link.', inline: false},
      {name: 'channel', value: 'Return the currently selected anime announcement channel.', inline: false},
      {name: 'clean', value: 'Purges any completed shows from this channel\'s watch list.', inline: false},
      {name: 'help', value: 'Prints out all available sub-commands with a short description.', inline: false},
      {name: 'list', value: 'Prints a list of all anime names being watched that are still currently airing.', inline: false},
      {name: 'next', value: 'Displays the next anime to air (in the next 7 days) that the currently selected channel is watching.', inline: false},
      {name: 'remove', value: 'Removes an anime from the list. You may provide an AniList entry link or a MyAnimeList link.', inline: false},
      {name: 'setchannel', value: 'Set the announcement channel for airing announcements on the server', inline: false}
    )
)
}
