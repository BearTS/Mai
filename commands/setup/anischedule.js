const { getAnnouncementEmbed, getFromNextDays, query } = require('../../utils/anischedule/utils.js')
const { getMediaId, promiseWhile, sendWatchingList } = require('../../utils/anischedule/helpers.js')
const watchlist = require('../../models/guildWatchlistSchema.js')
const { default : { prefix } } = require('../../settings.json')
const requireText = require('require-text')
const { magenta } = require('chalk')
const { MessageEmbed } = require('discord.js')
const allowedResponses = ['add','channel','clean','list', 'next', 'remove', 'setchannel']

module.exports = {
  config: {
    name: 'anisched',
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: true,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'setup',
    description: `Setup the airing-anime monitor on your server! Type \`${prefix}anisched help\` for a guide on how to set up one.`,
    examples: ['anisched help'],
    parameters: ['subcommands', 'queries']
  },
  run: async ( client, message, [ subcommand, ...queries ] ) => {

  if (!subcommand || subcommand.toLowerCase() === 'help') return help(message)

  if (!allowedResponses.includes(subcommand)) return message.channel.send(error(`[ANISCHEDULE_ERROR]: Invalid subcommand [${subcommand}]. To view available subcommands: type \`${prefix}anisched help\`.`))

  let data = await watchlist.findOne({guildID: message.guild.id}).catch(()=>{})

  if (!data) {

      if (subcommand !== 'setchannel' || !message.mentions.channels.size) return message.channel.send(error(`[ANISCHEDULE_ERROR]: No channel has been set for logging anime schedules. Please set by using \`${prefix}anisched setchannel [channel mention]\`.`))

      return data = await new watchlist({  guildID: message.guild.id , channelID: message.mentions.channels.first().id, data: []}).save()

    }

    switch(subcommand.toLowerCase()){
  //=============================================================================
      case 'add':
        if (!queries[0]) return message.channel.send(error(`[ANISCHEDULE_ERROR]: Missing URL. Please supply the Anilist / MAL url of the anime to add.`))

        const watchID = await getMediaId(queries[0])
        if (!watchID) return message.channel.send(error(`[ANISCHEDULE_ERROR]: Couldn't fetch Information from [${queries[0]}]. Make sure it is a valid Anilist / MAL url!`))
        if (data.data.includes(watchID)) return message.channel.send(error(`[ANISCHEDULE_ERROR]: [${queries[0]}] already exist on the list.`))

        data.data.push(watchID)
        data.save().then(()=>{
          return message.channel.send(success(`Successfully added ${queries[0]} to the list!`))
         }).catch(()=>{
          return message.channel.send(error(`[ANISCHEDULE_ERROR]: Failed to add ${queries[0]} to the list!`))
         })

      break;
  //=============================================================================
      case 'channel':

        const anc_ch = message.guild.channels.cache.get(data.channelID)
        if (!anc_ch) return message.channel.send(error(`[ANISCHEDULE_ERROR]: No channel has been set for logging anime schedules. Please set by using \`${prefix}anisched setchannel [channel mention]\`.`))
        if (!anc_ch.permissionsFor(message.guild.me).has('SEND_MESSAGES'))  return message.channel.send(error(`[ANISCHEDULE_ERROR]: Currently announcing anime releases in ${anc_ch}! However, I don't have the permission to send message there. Please set a new channel by using \`${prefix}anisched setchannel [channel mention]\`.`))
        message.channel.send(success(`Currently announcing anime releases in ${anc_ch}!`))

      break;
  //=============================================================================
      case 'clean':
        if ( !data.data || !data.data.length ) {
          return message.channel.send(error(`[ANISCHEDULE_ERROR]: List is currently empty!`))
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

          if (finished.length) {
            data.save().then(()=>{
              return message.channel.send(success(`Removed **${finished.length}** shows from the list.`))
            }).catch(() => {
              return message.channel.send(error(`[ANISCHEDULE_ERROR]: Failed to clear finished anime from the list!`))
            })
          } else {
            return message.channel.send(error(`[ANISCHEDULE_ERROR]: No finished anime were found from the list.`))
          }

        })

      break;
  //=============================================================================
      case 'list':
          if ( !data.data || !data.data.length ){
            return message.channel.send(error(`[ANISCHEDULE_ERROR]: List is currently empty!`))
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

              if (!description.length) return message.channel.send(error("[ANISCHEDULE_ERROR]: No currently airing shows are being announced."))
            })
          }

      break;
  //=============================================================================
      case 'next':
          if ( !data.data || !data.data.length ){
            return message.channel.send(error(`[ANISCHEDULE_ERROR]: List is currently empty!`))
          }

          query(requireText('../../utils/anischedule/query/Schedule.graphql',require), {page: 0, watched: data.data, nextDay: Math.round(getFromNextDays(7).getTime() / 1000)}).then( res => {
            if (res.errors){
              message.channel.send(error(`[ANISCHEDULE_ERROR]: An unexpected error has occured. If you're the bot owner, you can view the error log at the terminal / console. If not, please report this incident to the bot owner.`))
              return console.log(`${magenta('[Mai-Promise ERROR]')} :\n${JSON.stringify(res.errors)}`);
            }

            if (!res.data.Page.airingSchedules.length) {
              return message.channel.send(error(`[ANISCHEDULE_ERROR]: Couldn't find next airdate for all the anime on the list!`))
            }

            const anime = res.data.Page.airingSchedules[0]
            const embed = getAnnouncementEmbed(anime, new Date(anime.airingAt * 1000), true)
            message.channel.send(embed)
          })

      break;
  //=============================================================================
      case 'remove':
        if ( !data.data || !data.data.length ){
          return message.channel.send(error(`[ANISCHEDULE_ERROR]: There is nothing to remove. List is currently empty!`))
        }

        if (!queries[0]) return message.channel.send(error(`[ANISCHEDULE_ERROR]: Missing URL. Please supply the Anilist / MAL url of the anime to add.`))

        const watchId = await getMediaId(queries[0]);
        if (!watchId) return message.channel.send(error(`[ANISCHEDULE_ERROR]: Couldn't fetch Information from [${queries[0]}]. Make sure it is a valid Anilist / MAL url!`))
        if (!data.data.includes(watchId)) return message.channel.send(error(`[ANISCHEDULE_ERROR]: Unable to remove [${queries[0]}]. It does not exist on the list.`))


        data.data.splice(data.data.indexOf(watchId),1)
        data.save().then(()=>{
          return message.channel.send(success(`Successfully removed ${queries[0]} from the list!`))
         }).catch(()=>{
          return message.channel.send(error(`[ANISCHEDULE_ERROR]: Failed to remove ${queries[0]} from the list!`))
         })

      break;
  //=============================================================================
      case 'setchannel':
        if (!message.mentions.channels.size) return message.channel.send(`[ANISCHEDULE_ERROR]: Please mention a channel!`)
        if (!message.mentions.channels.first().permissionsFor(message.guild.me).has('SEND_MESSAGES')) return message.channel.send(`[ANISCHEDULE_ERROR]: Failed to set channel ${message.mentions.channels.first()} - I can't send messages on that channel!`)
        data.channelID = message.mentions.channels.first().id
        data.save().then(()=>{
          return message.channel.send(success(`Anime Announcement Channel successfully set to ${message.mentions.channels.first()}!`))
         }).catch(()=>{
          return message.channel.send(error(`[ANISCHEDULE_ERROR]: Failed to set announcement channel!`))
         })
      break;
      default:
      }
    }
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

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function success(str){
  return new MessageEmbed()
  .setColor('GREEN')
  .setDescription(`\u200B\n${str}\n\u200B`)
}
