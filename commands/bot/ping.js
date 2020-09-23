const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { duration } = require('moment')
require('moment-duration-format')

module.exports = {
  name: 'ping'
  , aliases: []
  , group: 'bot'
  , description: 'Give the bot\'s various ping'
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , examples: [
    'ping'
  ]
  , parameters: []
  , run: async ( client, message ) => {

    if (!client.config.pings.hasOwnProperty('lastUpdatedAt'))
      return message.channel.send(`<:cancel:712586986216489011> | ${message.author}, The Ping Manager is not ready yet. Please try again in a second.`)

    const prompt = await message.channel.send('Pinging...')

    const DAPI = client.ws.ping.toFixed()
    const msg = (prompt.createdTimestamp - message.createdTimestamp).toFixed()
    let now = Date.now()

    let { jikan, anilist, reddit,
          jisho, steam, time_is,
          urban, lastUpdatedAt } = client.config.pings

    const responses = () => {
      return [
        'I-It\'s not like I wanted to say pong or anything...',
        'Pong...',
        'Woo! A secret command!',
        'Ping! ...I mean **pong!**',
        'Does anyone even use this?',
        'At your service!',
        'Testing, testing, 1, 2, 3!'
      ][Math.floor(Math.random() * 6)]
    }

    const colors = (num) => {
      num = parseInt(num)
      if (isNaN(num)) return `<:emptybar:729246652577218611><:emptybar:729246652577218611><:emptybar:729246652577218611><:emptybar:729246652577218611><:emptybar:729246652577218611>`
      const emojis = [ '<:lvl2bar:729245297968021566>', '<:lvl3bar:729245573647171645>', '<:lvl4bar:729245984864862228>', '<:level5bar:729246357445017664>' ]
      const limits = [1500,1000,500,250]
      const array = [ '<:lvl1bar:729245097027305542>' ]
      for ( const limit of limits ) array.push(num < limit ? emojis[limits.indexOf(limit)] : '<:emptybar:729246652577218611>')
      return array.join('')
    }

    const embed = new MessageEmbed()
      .setColor('GREY')
      .setAuthor('Ping Information\n', client.user.displayAvatarURL())
      .setDescription('Do not click on the hyperlink. Hover them to view more information.')
      .addFields([
        {
          name: 'Discord',
          inline: true,
          value: `╭═[**Client Heartbeat**](https://discord.com/ 'DAPI (Discord Application Programming Interface) client ping that determines the delay between the incoming and outgoing of data within discord.')\n${colors(DAPI)}\n╰═══\u2000\u2000\u2000\` ${DAPI} ms\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `╭═[**Message Roundtrip**](https://discord.com/ 'DAPI (Discord Application Programming Interface) message latency displays the difference of time in milliseconds between receiving and sending of messages within discord')\n${colors(msg)}\n╰═══\u2000\u2000\u2000\` ${msg} ms\``},
        {
          name: '\u200b',
          inline: true,
          value: `----`},
        {
          name: 'Anime',
          inline: true,
          value: `╭═[**Jikan Latency**](https://discord.com/ 'Jikan latency displays the average amount of time it takes to fetch data from MyAnimeList.net')\n${
              colors(jikan)
            }\n╰═══\u2000\u2000\u2000\` ${
              jikan
              ? jikan + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `╭═[**AniList Latency**](https://discord.com/ 'Anilist latency displays the average amount of time it takes to fetch data from Anilist.co')\n${
              colors(anilist)
            }\n╰═══\u2000\u2000\u2000\` ${
              anilist
              ? anilist + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `╭═[**Reddit Latency**](https://discord.com/ 'Reddit latency displays the time delay between sending requests and receiving data to and from reddit, respectively.')\n${
              colors(reddit)
            }\n╰═══\u2000\u2000\u2000\` ${
              reddit
              ? reddit + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: 'Others',
          inline: true,
          value: `╭═[**Jisho Latency**](https://discord.com/ 'Jisho latency displays the amout of time it takes to make a full round of sending-and-receiveing of data from them.')\n${
              colors(jisho)
            }\n╰═══\u2000\u2000\u2000\` ${
              jisho
              ? jisho + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `╭═[**Steam Latency**](https://discord.com/ 'Steam latency displays the amount of time it takes to request and receive an information from the STEAM API')\n${
              colors(steam)
            }\n╰═══\u2000\u2000\u2000\` ${
              steam
              ? steam + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `╭═[**Time.is Latency**](https://discord.com/ 'Time.is latency shows the time it takes to make a full request to the Time.is API')\n${
              colors(time_is)
            }\n╰═══\u2000\u2000\u2000\` ${
              time_is
              ? time_is + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `╭═[**Urban Latency**](https://discord.com/ 'Urban latency shows the time it takes to make a full request to the Urban Dictionary API.')\n${
              colors(urban)
            }\n╰═══\u2000\u2000\u2000\` ${
              urban
              ? urban + ' ms'
              : 'Unavailable'
            }\``
        },
        {
          name: '\u200b',
          inline: true,
          value: `\u200b\n*“${responses()}”*`
        }
      ])
      .setFooter(`*Pings are reevaluated once every 5 minutes. Time until next update: ${
          (lastUpdatedAt.getTime() + (60 * 5 * 1000)) > Date.now()
          ? (duration(lastUpdatedAt.getTime() + (60 * 5 * 1000) - Date.now(),'milliseconds').format('m [minutes] s [seconds]'))
          : 'Updating...'}` ,'https://cdn.discordapp.com/emojis/729380844611043438')

      return await prompt.edit('',embed).catch(()=> null)
                   ? null
                   : await message.channel.send(embed).then(()=> null)
  }
}
