//-------------------Module Imports------------------------//

require('moment-duration-format');
const { duration } = require('moment');
const { MessageEmbed } = require('discord.js')
const guildWatchlistSchema = require('../models/guildWatchlistSchema')
const query = require('./AniList Query')
const schedule = require('require-text')('../assets/graphql/Schedule.graphql', require)
let queuedNotifications = [];

//---------------------Function Exports---------------------//

module.exports = (client) => {
  handleSchedules(
      client
    , Math.round(getFromNextDays().getTime() / 1000)
  )

  return setInterval(
    () => handleSchedules(
        client
      , Math.round(getFromNextDays().getTime() / 1000)
    )
    , 24 * 60 * 60 * 1000
  )
};

function getFromNextDays(days = 1){
  return new Date(
      new Date().getTime()
    + ( 24 * 60 * 60 * 1000 * days )
  )
};

function getAllWatched(){
  return new Promise( async resolve => {
    const watched = []

    const watchlist = await guildWatchlistSchema
      .find({})
        .catch(()=> resolve(null))

    resolve([...new Set(watchlist.flatMap(
        guild => guild.data
      ))
    ])
  })
};

async function handleSchedules( client, nextDay, page ){

  const watched = await getAllWatched()

  if (!watched) return console.log(
      'Couldn\'t Connect to Database... '
    + 'Disabling Anisched Feature...'
  )

  const res = await query(
      schedule
    , { page, watched, nextDay }
  )

  if (res.errors) return console.log(
      'An Error Occured while Executing the AniSched Feature:\n'
    + '================================================\n'
    + res.errors.map( error => error.message).join('\n')
    + '================================================\n'
  )

  for ( const e of res.data.Page.airingSchedules){

    const date = new Date(e.airingAt * 1000)
    if (queuedNotifications.includes(e.id)) return

    console.log(
        'Scheduling announcement for Episode '
      + e.episode
      + ' of '
      + e.media.title.romaji
      + ' in '
      + duration(e.timeUntilAiring, 'seconds')
        .format('D [days] H [hours] m [minutes] s [seconds]')
    )

    queuedNotifications.push(e.id)

    setTimeout(
      () => makeAnnouncement(
          client
        , e
        , date
      )
      , e.timeUntilAiring * 1000
    )
  }

  if (res.data.Page.pageInfo.hasNextPage)
  handleSchedules(
      client
    , nextDay
    , res.data.Page.pageInfo.currentPage + 1
  )
};

async function makeAnnouncement( client, entry, date, upNext = false){

  queuedNotifications = queuedNotifications.filter( q => q !== entry.id)
  const embed = getAnnouncementEmbed(entry, date, upNext)


  const watchlist = await guildWatchlistSchema
    .find({})
      .catch(()=> null)

  if (!watchlist) return console.log(
      'Couldn\'t connect to Database... '
    , 'Disabling Anisched Feature...'
  )

  for ( const g of watchlist){

    if (
      !g
      ||  !g.data
      ||  !g.data.length
      ||  !g.data.includes(entry.media.id)
    ) continue

    const channel = client.channels.cache.get(g.channelID)

    if (
      !channel
      ||  !channel.permissionsFor(channel.guild.me)
            .has(['SEND_MESSAGES','EMBED_LINKS'])
    ) return console.log(
        `Announcement for ${entry.media.title.romaji} failed in ${
          channel
            ? channel.guild.name
              + ' because of missing \'SEND_MESSAGES\' and/or \'EMBED_LINKS\' permission.'
            : g.channelID
              + ' because such channel doesn\'t exist!'
        }`
    )

    console.log(
        'Announcing episode '
      + entry.media.title.romaji
      + ' to '
      + channel.guild.name
      + ' @ '
      + channel.id
    )

    await channel.send(embed)
      .catch( err => console.log(
          'Announcement for '
        + entry.media.title.romaji
        + ' in '
        + channel.guild.name
        + ': '
        + err.name
      ))
  }
};

function getAnnouncementEmbed(entry, date, upNext = false){

  const sites = [
      'Amazon'
    , 'Animelab'
    , 'AnimeLab'
    , 'Crunchyroll'
    , 'Funimation'
    , 'Hidive'
    , 'Hulu'
    , 'Netflix'
    , 'Viz'
  ]
  return new MessageEmbed()
    .setColor(
      entry.media.coverImage.color
      ? parseInt(entry.media.coverImage.color.substr(1), 16)
      : 'GREY'
    )

    .setThumbnail(entry.media.coverImage.large)
    .setAuthor('Mai Airing Anime Announcement')
    .setTimestamp(date)

    .setDescription(
        `Episode ** ${
          entry.episode
        } ** of **[ ${
          entry.media.title.romaji
        }](${
          entry.media.siteUrl
        })**${
          entry.media.episodes === entry.episode
          ? ' **(Final Episode)**'
          : ''
        } has just aired.${
          entry.media.externalLinks
            &&  entry.media.externalLinks.filter(
              ({ site }) => sites.includes(site)
            ).length

            ? `\n\nWatch: ${
              entry.media.externalLinks.map(
                ({site, url}) => sites.includes(site)
                ? `[${site}](${url})`
                : null
              ).filter(
                el => el
              ).join(' • ')
            }`

            : ''
        }${
          entry.media.externalLinks
          &&  entry.media.externalLinks.filter(
            ({ site }) => !sites.includes(site)
          ).length

          ? `\n\nVisit: ${
            entry.media.externalLinks
              .map(
                ({ site, url }) => !sites.includes(site)
                ? `[${site}](${url})`
                : null
              ).filter(
                el => el
              ).join(' • ')
          }`

          : ''

        }\n\nIt may take some time to appear on the above service(s)`
    )

    .setFooter(
      `${
        entry.media.format
        ? `•  Format:  ${
          {
              TV: 'TV'
            , TV_SHORT: 'TV Shorts'
            , MOVIE:  'Movie'
            , SPECIAL:  'Special'
            , ONA:  'ONA'
            , OVA:  'OVA'
            , MUSIC:  'Music'
          }[entry.media.format]
        }  `

        : ''
      }${
         entry.media.duration

         ? `•  Duration:  ${
           duration(entry.media.duration * 60, 'seconds')
             .format('H [hr] m [minute]')
         }  `

         : ''
      }${
        entry.media.studios
        &&  entry.media.studios.edges.length

        ? `•  Studio:  ${
          entry.media.studios.edges[0].node.name
        }`

        : ''
      }`
    )
};
