require('moment-duration-format')
const {
    AniListQuery
  , NextAirDate_Query: withQuery
  , NextAirDate_NoQuery: withoutQuery
  , TextHelpers: { textTrunctuate , joinArray: join , commatize }
} = require('../../helper.js')

const { duration } = require('moment')
const { MessageEmbed } = require('discord.js')

module.exports = {
  name: 'nextairdate'
  , aliases: [
    'nextairing'
    , 'nextair'
    , 'nextep'
    , 'nextepisode'
  ]
  , cooldown: {
    time: 10000
    , message: 'You are going too fast! Please slow down to avoid being rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , group: 'anime'
  , image: 'https://files.catbox.moe/3bphvj.gif'
  , description: 'Returns remaining time for the next episode of given anime. Returns this day\'s schedule, if no anime is specified'
  , examples: [
    'schedule aobuta'
    , 'nextairing seishun buta yarou'
    , 'nextair bunnygirl senpai'
  ]
  , parameters: [
    'search query'
  ]
  , run: async ( client, message, args ) => {

    const query = args.length
    ? args.join(' ')
    : null

    const res = await AniListQuery(
      query
      ? withQuery
      : withoutQuery
      , query
      ? {
        search: query,
        status: 'RELEASING'
      }
      : {}
    )


    if (
      res.errors
      && res.errors.some(
        ({ message }) => message !== 'Not Found.'
      )
    ) return message.channel.send(
      new MessageEmbed()
      .setColor('RED')
      .setAuthor('Response Error','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      .setDescription(
         `**${message.member.displayName}**, An unexpected error has occured!\n\n`
         `${res.errors.map(({ message }) => '• ' + message).join('\n')}`
        + `Please try again in a few minutes. This is usually caused by a server downtime.`
      )
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')
      .setFooter(`Airdate Query with AL | \©️${new Date().getFullYear()} Mai`)
    )


    if (
      res.errors
      && res.errors.some(
        ({ message }) => message === 'Not Found.'
      )
    ) return message.channel.send(
      new MessageEmbed()
      .setColor('RED')
      .setAuthor('None Found','https://cdn.discordapp.com/emojis/767062250279927818.png?v=1')
      .setDescription(
         `**${message.member.displayName}**, That anime may have already **Finished Airing**, `
         + `have **unknown next Airdate**, or that anime may have **never existed** at all!`
       )
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')
      .setFooter(`Airdate Query with AL | \©️${new Date().getFullYear()} Mai`)
    )

    const [ now, next, later ] = query
    ? [ res.data.Media ]
    : res.data.Page.media.filter(
      ({ nextAiringEpisode }) => nextAiringEpisode
    ).sort(
      (A, B) => A.nextAiringEpisode.timeUntilAiring - B.nextAiringEpisode.timeUntilAiring
    ).slice(0,3)


    const embed = new MessageEmbed()
    .setFooter(`Airdate Query with AL | \©️${new Date().getFullYear()} Mai`)

    if (query) {

      return message.channel.send(
        embed
        .setColor(now.coverImage.color)

        .setThumbnail(now.coverImage.large)

        .setFooter(`Airdate Query with AL | \©️${new Date().getFullYear()} Mai`)

        .setTitle(
            now.title.english
            ? now.title.english
            : now.title.romaji
              ? now.title.romaji
              : now.title.native
          , now.coverImage.large
          , now.siteUrl
        )

        .setDescription(
            `*${
              now.title.native
            }*\n*${
              now.title.romaji
            }*\n\n${
              now.nextAiringEpisode.timeUntilAiring
              ? `Episode **${
                now.episodes === now.nextAiringEpisode.episode
                ? `${now.nextAiringEpisode.episode} (Final Episode)`
                : now.nextAiringEpisode.episode
              }** of [${
                now.title.english
                ? now.title.english
                : now.title.romaji
                  ? now.title.romaji
                  : now.title.native
              }](${
                now.siteUrl
              }) will air in approximately **${
                duration(now.nextAiringEpisode.timeUntilAiring, 'seconds')
                .format('D [days] H [hours] m [minutes]')
              }**\n\n${now.id} | ${now.studios.edges[0].node.name} `
              : `Next episode airdate for [${
                now.title.english
                ? now.title.english
                : now.title.romaji
                  ? now.title.romaji
                  : now.title.native
              }](${
                now.siteUrl
              }) is currently unknown`
            }`
        )
      )

    } else {

      return message.channel.send(
        embed

        .setColor(now.coverImage.color)

        .setThumbnail(now.coverImage.large)

        .setAuthor(`Airs next: ${
          now.title.english
          ? now.title.english
          : now.title.romaji
            ? now.title.romaji
            : now.title.native
        }`
        , now.coverImage.large
        , now.siteUrl
        )

        .setDescription(`[${
          now.title.english
          ? now.title.english + ' • '
          : ''
        }${
          now.title.romaji
          ? now.title.romaji + ' • '
          : ''
        }${
          now.title.native
          ? now.title.native + ' • '
          : ''
        }](${
          now.siteUrl
        }) ${
          now.nextAiringEpisode.timeUntilAiring
          ? `\nEpisode **${
            now.nextAiringEpisode.episode === now.episodes
            ? `${now.nextAiringEpisode.episode} (Final Episode)`
            : `${now.nextAiringEpisode.episode}`
          }** airs in **${
            duration(now.nextAiringEpisode.timeUntilAiring, 'seconds')
            .format('D [days] H [hours] m [minutes]')
          }**`
          : 'Next Episode is currently **Unknown**'
        }`
        )

      .addField('Airs Later', `${
        next
        ? `**[${
          next.title.english
          ? next.title.english
          : next.title.romaji
            ? next.title.romaji
            : next.title.native
        }](${
          next.siteUrl
        })** ${
          next.nextAiringEpisode.timeUntilAiring
          ? `\nEpisode **${
            next.nextAiringEpisode.episode === next.episodes
            ? `${next.nextAiringEpisode.episode} (Final Episode)`
            : `${next.nextAiringEpisode.episode}`
          }** airs in **${
            duration(next.nextAiringEpisode.timeUntilAiring, 'seconds')
            .format('D [days] H [hours] m [minutes]')
          }**`
          : 'Next Episode is currently Unknown'
        }`
        : 'No Anime was found in the next 7 days'
      }`)

      .addField('Airs Later', `${
        later
        ? `**[${
          later.title.english
          ? later.title.english
          : later.title.romaji
            ? later.title.romaji
            : later.title.native
        }](${
          later.siteUrl
        })** ${
          later.nextAiringEpisode.timeUntilAiring
          ? `\nEpisode **${
            later.nextAiringEpisode.episode === later.episodes
            ? `${later.nextAiringEpisode.episode} (Final Episode)`
            : `${later.nextAiringEpisode.episode}`
          }** airs in **${
            duration(later.nextAiringEpisode.timeUntilAiring, 'seconds')
            .format('D [days] H [hours] m [minutes]')
          }**`
          : 'Next Episode is currently Unknown'
        }`
        : 'No Anime was found in the next 7 days'
      }`)
      )
    }
  }
}
