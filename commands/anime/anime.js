const { getInfoFromName } = require('mal-scraper')
const { MessageEmbed } = require('discord.js')
const { textTrunctuate } = require('../../helper.js')

module.exports.run = async ( client, message, args ) => {

  if (!args.length) args = ['seishun','buta','yarou']

  const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for anime titled **${args.join(' ')}** on MAL.\n\u200B`).setThumbnail('https://files.catbox.moe/op2978.gif'))

  const data = await getInfoFromName(args.join(' '))

  if (!data) return msg.edit( new MessageEmbed().setColor('RED').setDescription(`\u200B\nError: No anime found for **${args.join(' ')}**\u200B\n`))

  const elapsed = new Date() - msg.createdAt

  let genres = data.genres && data.genres.length ? joinArray(data.genres) : '\u200B'
  let producers = data.producers && data.producers.length ? joinArray(data.producers) : '\u200B'
  let studios = data.studios && data.producers.length ? joinArray(data.studios) : '\u200B'

  const title = data.title ? data.title : 'Untitled'
  const url = data.url ? data.url : null
  const desc = data.englishTitle ? data.englishTitle : title
  const image = data.picture ? data.picture : null
  const syn = data.synopsis ? data.synopsis: 'N/A'
  const type = data.type.length ? data.type : "showType Unavailable."
  const aired = data.aired.length ? data.aired : "N/A"
  const status = data.status.length ? data.status : "N/A"
  const episodes = data.episodes.length ? data.episodes : "N/A"
  const source = data.source.length ? data.source : "N/A"
  const rating = data.rating.length  ? data.rating : "N/A"
  const score = data.score
  const rank = data.ranked && Number(data.ranked.split('#').slice(1)) < 150 ? data.ranked : null
  const popularity = data.popularity && rank ? data.popularity : null

  const embed = new MessageEmbed()
    .setColor('GREY')
    .setAuthor(`${desc} | ${type}`, image ? image : 'https://myanimelist.net/images/icon.svg', url)
    .setDescription(`Score: ${score} ${rank ? '| Ranked '+rank : ''} ${popularity ? '| Popularity : '+popularity:''}\n\n${textTrunctuate(syn,1000,`... [Read More](${url})`)}`)
    .addField(`Information`, `•\u2000\**Japanese Name:** [${title}](${url})\n\•\u2000\**Age Rating:** ${rating}\n•\u2000\**Source:** ${source}`,true)
    .addField(`\u200B`,`•\u2000\**Genres:** ${genres}\n•\u2000\**Producers:** ${producers}\n•\u2000\**Studios:** ${studios}`,true)
    .addField(`Status`,`•\u2000\**Episodes:** ${episodes}\n•\u2000\**Start Date:** ${aired}\n\•\u2000\**Status:** ${status}`)
    .setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)
    if (image) embed.setThumbnail(image)

  try {
    msg.edit(embed)
  } catch (err) {
    message.channel.send(embed)
  }
}

module.exports.config = {
  name: "anime",
  aliases: ['ani','as'],
  cooldown: {
    time: 10,
    msg: 'Oops! You\'re going too fast!'
  },
  guildOnly: true,
	group: 'anime',
	description: 'Searches for a specific anime in [MyAnimeList.net](https://myanimelist.net)',
	examples: ['anime aobuta','ani seishun buta yarou','as bunnygirl senpai'],
	parameters: ['search query']
}

function joinArray(array){

  if (!array.length) return `${array.toString()}.`

  if (array.length < 3) return `${array.join(' and ')}.`

  const last = array.pop()

  const res = `${array.join(', ')}, and ${last}.`

  return res
}
