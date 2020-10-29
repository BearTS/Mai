const {
    Seiyuu
  , AniListQuery: query
  , TextHelpers: { textTrunctuate, joinArray }
} = require('../../helper.js')

const { MessageEmbed } = require('discord.js')
const { decode } = require('he')

const langflags = [
  { lang: 'Hungarian', flag: '🇭🇺' }, { lang: 'Japanese', flag: '🇯🇵' }
  , { lang: 'French' , flag: '🇫🇷' }, { lang: 'Russian' , flag:'🇷🇺' }
  , { lang: 'German', flag: '🇩🇪' }, { lang: 'English', flag: '🇺🇸' }
  , { lang: 'Italian', flag: '🇮🇹' }, { lang: 'Spanish', flag: '🇪🇸' }
  , { lang: 'Korean', flag: '🇰🇷' }, { lang: 'Chinese', flag: '🇨🇳' }
  , { lang: 'Brazilian', flag: '🇧🇷' }
  ]

module.exports = {
  name: 'seiyuu'
  , aliases: [
    'voice'
    , 'va'
  ]
  , cooldown: {
    time: 10000
    , msg: 'Oops! You are going to fast! Please slow down to avoid being rate-limited!'
  }
  , clientPermissions: [
    'EMBED_LINKS'
  ]
  , group: 'anime'
  , description: 'Search for seiyuu\'s on your favorite anime characters!'
  , examples: [
    'seiyuu Takahashi Rie'
    , 'voice Amamiya Sora'
  ]
  , parameters: [
    'search query'
  ]
  , run: async ( client, message, args) => {

    const search = args.length
    ? args.join(' ')
    : 'Seto Asami'

    let mainpage = await message.channel.send(
      new MessageEmbed()
      .setColor('YELLOW')
      .setDescription(`\u200B\nSearching for character named **${
        search
      }** on <:anilist:719460833838759967> [Anilist](https://anilist.co 'Anilist Homepage').\n\u200B`)
        .setThumbnail('https://i.imgur.com/u6ROwvK.gif')

      ).setFooter(`Seiyuu Query with AL | \©️${new Date().getFullYear()} Mai`);


    let res = await query(Seiyuu, { search })

    if (
      res.errors
      && res.errors.some(
        ({ message }) => message !== 'Not Found.'
      )
    ) {

      const errembed = new MessageEmbed()
      .setColor('RED')
      .setAuthor('Response Error','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
      .setDescription(
         `**${message.member.displayName}**, An unexpected error has occured!\n\n`
         `${res.errors.map(({ message }) => '• ' + message).join('\n')}`
        + `Please try again in a few minutes. This is usually caused by a server downtime.`
      )
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')
      .setFooter(`Seiyuu Query with AL | \©️${new Date().getFullYear()} Mai`)

      return await mainpage.edit(errembed).catch(()=>null)
      ? null
      : message.channel.send(errembed)
    }


    if (
      res.errors
      && res.errors.some(
        ({ message }) => message === 'Not Found.'
      )
    ){

      const noneembed = new MessageEmbed()
      .setColor('RED')
      .setAuthor('None Found','https://cdn.discordapp.com/emojis/712586986216489011.png?v=1')
      .setDescription(
         `**${message.member.displayName}**, No results were found for **${search}**!\n\n`
         + `If you believe this seiyuu exists, try the following methods:\n`
         + `• Try the alternative names (e.g. English, Native, Romaji).\n`
         + `• Try their nickname (what these seiyuu usually called as at work).\n`
         + `• Check the spelling. Perhaps you didn't get it right.`
       )
      .setThumbnail('https://i.imgur.com/qkBQB8V.png')
      .setFooter(`Seiyuu Query with AL | \©️${new Date().getFullYear()} Mai`)

      return await mainpage.edit(noneembed)
      ? null
      : message.channel.send(noneembed)

  }

  const elapsed = Date.now() - message.createdTimestamp

  res = res.data.Staff

  let ch = 0
  let an = 0

  const embed = new MessageEmbed()
  .setAuthor(
    res.name.full
    + res.name.native
    ? `• ${res.name.native}`
    : ''
    , null, res.siteUrl
  )
  .setThumbnail(res.image.large)
  .setColor('GREY')
  .setDescription(
    `${res.language
      ? langflags.find(f => f.lang.toLowerCase() === res.language.toLowerCase())
      : ''
    }\n\n${
      res.description
      ? textTrunctuate(decode(res.description), 1000, `...[Read More](${res.siteUrl})`)
      : ''
    }`
  )
  .addField(
    `${res.name.full} voiced these characters`,
    res.characters.nodes.length
    ? `${res.characters.nodes.map( c => `[${c.name.full}](${c.siteUrl.split('/').slice(0,5).join('/')})`)
    .reduce((acc,curr) => {
      if (acc.length + curr.length + 3 > 1000){
        ch++
        return acc
      }

      acc = acc + ' • '
      return acc + curr
    })
    }${ch ? `and ${ch} more!` : ''}`
    : 'None Found.'
  )
  .addField(
    `${res.name.full} is part of the staff of these anime`,
    res.staffMedia.nodes.length
    ? `${res.staffMedia.nodes.map( s => `[${s.title.romaji}](${s.siteUrl.split('/').slice(0,5).join('/')})`)
    .reduce((acc,curr) => {
      if (acc.length + curr.length + 3 > 1000){
        ch++
        return acc
      }

      acc = acc + ' • '
      return acc + curr
    })
    }${an ? `and ${an} more!` : ''}`
    : 'None Found.'
  )
  .setFooter(`Search duration: ${(elapsed / 1000).toFixed(2)} seconds\nSeiyuu Query with AL | \©️${new Date().getFullYear()} Mai`)

  return await mainpage.edit(embed).catch(()=>null)
  ? null
  : message.channel.send(embed).then(()=>null)

  }
}
