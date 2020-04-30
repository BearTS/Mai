const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const moment = require('moment')

module.exports.run = async ( client, message, args ) => {

  if (args.length < 1) {
       q = `{ Page { media(type: ANIME status: RELEASING sort: POPULARITY_DESC) { title { romaji english native } nextAiringEpisode { episode timeUntilAiring } id siteUrl coverImage { large color } studios(isMain: true) { edges { isMain node { name } } } } } }`
   } else {
       q = `query ($search: String, $status: MediaStatus) { Media(type:ANIME status:$status search:$search) { title { romaji english native } nextAiringEpisode { episode timeUntilAiring } id siteUrl coverImage { large color } studios(isMain: true) { edges { isMain node { name } } } } }`
  }

  let msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nFetching Air date information from [Anilist](https://anilist.co)\n\u200B`).setThumbnail('https://files.catbox.moe/op2978.gif'))

  let { data } = await query( q , args.length < 1 ? null : { search : args.join(' '), status: 'RELEASING' }).catch(()=>{})

  if (data.Page) {
    data = getAnime(data.Page.media)
  }

  try {
    return msg.edit(embed(data))
  } catch (err) {
    return  message.channel.send(embed(data))
  }

}

module.exports.config = {
  name: "nextairdate",
  aliases: ['nextairing','nextair','nextep','nextepisode'],
  cooldown: {
    time: 0,
    msg: ''
  },
  guildOnly: true,
	group: 'anime',
	description: 'Returns remaining time for the next episode of given anime. Returns this day\'s schedule, if no anime is specified',
	examples: ['schedule aobuta','nextairing seishun buta yarou','nextair bunnygirl senpai'],
	parameters: ['search query']
}

function query(query,variables){
  return fetch("https://graphql.anilist.co", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      query,
      variables
    })
  }).then(res => res.json())
}

function getAnime(media){
  const [ a, b, c ] = media.filter( a => a.nextAiringEpisode && a.nextAiringEpisode.timeUntilAiring < 86400)
    .sort( (a,b) => a.nextAiringEpisode.timeUntilAiring - b.nextAiringEpisode.timeUntilAiring)
  return { multi: true, data: [a, b, c] }
}

function embed(data){

  let response = new MessageEmbed()

  if (data.multi) {

    list = data.data

    list.forEach( anime => {

      if (anime === undefined) return

      if (!anime.nextAiringEpisode){
        anime.nextAiringEpisode.episode = 0,
        anime.nextAiringEpisode.timeUntilAiring = false
      }
    })

    const [now, next, later ] = list

    function checkContinuing(data){
      if (data.nextAiringEpisode.timeUntilAiring) return true
      return false
    }

    function put(data){
      return checkContinuing(data) ? `\nEpisode: **${data.nextAiringEpisode.episode}**\nAirs in: **${moment.duration(data.nextAiringEpisode.timeUntilAiring, 'seconds').format('D [days] H [hours] m [minutes]')}**` : `Next Episode us currently Unknown.`
    }

    if (!now) return response.setDescription(`\u200B\nThere are currently no airing anime in the next 24 hours.\n\u200B`).setColor('RED')

    return response
    .setAuthor(`Airs next: ${now.title.english ? now.title.english : now.title.romaji}`,now.coverImage.large, now.siteUrl)
    .setDescription(`[${now.title.english ? now.title.english + ' • ' : ''} ${now.title.romaji} • ${now.title.native}](${now.siteUrl}) ${put(now)}`)
    .addField(`\u200B`,`Airs later: ${ next ? `**[${next.title.english}](${next.siteUrl})**\n[${next.title.english} • ${next.title.romaji} • ${next.title.native}](${next.siteUrl}) ${put(next)}` : `No anime found in the next 24 hours!`}`)
    .addField(`\u200B`,`Airs later: ${ later ? `**[${later.title.english}](${later.siteUrl})**\n[${later.title.english} • ${later.title.romaji} • ${later.title.native}](${later.siteUrl}) ${put(later)}` : `No anime found in the next 24 hours!`}`)
    .setColor(now.coverImage.color)
    .setThumbnail(now.coverImage.large)

  } else {

    if (!data.Media) {

      return response.setColor('RED').setDescription(`\u200B\nYare Yare.. Either that has already finished airing, has it's next airdate has tagged unknown, or that anime doesn't exist.\n\u200B`)

    } else if (!data.Media.nextAiringEpisode){
      data.Media.nextAiringEpisode = {
        episode: 0,
        timeUntilAiring: false
      }
    }

    const { Media : { title: { romaji, english, native }, nextAiringEpisode: { episode, timeUntilAiring }, id, siteUrl, coverImage: { large, color }, studios: edges } } = data

    const unknown = `Next episode airdate for [${english}](${siteUrl}) is currently unknown.`
    const continuing = `Episode ${episode} of [${english}](${siteUrl}) will air in approximately **${moment.duration(timeUntilAiring, 'seconds').format('D [days] H [hours] m [minutes]')}**`

    return response
    .setAuthor(english, large, siteUrl)
    .setDescription(`\n*${native}*\n*${romaji}*\n\n${timeUntilAiring ? continuing : unknown}\n\u200B`)
    .setThumbnail(large)
    .setFooter(` | ${id} | ${edges.edges[0].node.name}`)
    .setColor(color)
  }
}
