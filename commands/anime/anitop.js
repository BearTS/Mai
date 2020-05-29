const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { ordinalize, commatize, textTrunctuate } = require('../../helper.js')
const validTypes = ['airing','upcoming','tv','movie','ova','special']

module.exports = {
  config: {
    name: "anitop",
    aliases: ['topanime','bestanime'],
    guildOnly: false,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: {
      time: 30,
      msg: 'Oops! You are going to fast! Please slow down to avoid being rate-limited!'
    },
    group: 'anime',
    description: 'Searches for a top anime in [MyAnimeList.net](https://myanimelist.net "MyAnimeList Homepage"), or return a random one. Supports type. Valid types are `' + validTypes.join('`, `') + "`.",
  	examples: ['anitop [rank] [type]','topanime 5','bestanime 50 upcoming', 'anitop manhwa'],
  	parameters: ['Search Query']
  },
  run: async (client, message, [ rank, sub ]) => {

    if (!rank) rank = Math.floor(Math.random() * 49) + 1

    if (!sub && isNaN(rank) && validTypes.includes(rank.toLowerCase())) sub = rank

    if (isNaN(Number(rank)) || Number(rank) < 1 || Number(rank) > 50 ) rank = Math.floor(Math.random() * 49) + 1

    if (!sub || !validTypes.includes(sub)) sub = ''

    const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for Top Ranking Anime on MAL.\n\u200B`).setThumbnail('https://i.imgur.com/u6ROwvK.gif'))

    const res = await fetch(`https://api.jikan.moe/v3/top/anime/1/${sub}`).then(res => res.json()).catch(()=>{})

    if (!res) try {

      return msg.edit(error(`Fetching data failed. Please try again`))

    } catch (err) {

      return message.channel.send(error(`Fetching data failed. Please try again`))

    }

    const { top } = res

    const { mal_id } = top[rank-1]


    const data = await fetch(`https://api.jikan.moe/v3/anime/${mal_id}`).then(res => res.json()).catch(()=>{})

    const elapsed = new Date() - msg.createdAt

    if (!data) try {

      return msg.edit(error(`Fetching data failed.`))

    } catch (err) {

      return message.channel.send(error(`Fetching data failed.`))

    }

    const { url, image_url, title, title_japanese, type, source, episodes, status, airing, aired, duration, rating, score, scored_by, synopsis, producers, licensors, studios, genres } = data

    const embed = new MessageEmbed()
      .setAuthor(`#${ordinalize(rank)}. ${title} • ${title_japanese}`, null, url)
      .setThumbnail(image_url)
      .setColor('GREY')
      .setDescription(`${score ? `Score : **${score}**` : 'Not Scored'} ${type ? ` • **${type}** ` : `• **TV**`} ${duration && duration !== 'Unknown' ? `• Duration: ${duration}` : ''} ${episodes && episodes > 1 ? `• Episodes: **${episodes}**` :'' }\n\n${synopsis ? textTrunctuate(synopsis,500,`...[Read More](${url})`) : ''}`)
      .addField(`Aired`, aired.string, true)
      .addField(`Source`, source ? source : 'Unknown', true)
      .addField(`Genres`, hyperlink(genres), true)
      .addField('Producers',hyperlink(producers),true)
      .addField('Studios',hyperlink(studios),true)
      .addField('Licensors',hyperlink(licensors),true)
      .setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)

    try {

      msg.edit(embed)

    } catch (err) {

      message.channel.send(embed)

    }
  }
}

function hyperlink(data){
  if (data.length<1) return 'No Information.'
  let res = []
  let output;
  data.forEach(d => {
    res.push(`[${d.name}](${d.url})`)
  })
  if (res.length > 1){
  last = res.pop()
  output = res.join(", ")+`, and ${last}`
} else if (res.length === 1){
  output = res.toString()
}
return output
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
