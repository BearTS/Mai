const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { textTrunctuate } = require('../../helper.js')

module.exports.run = async ( client, message, args ) => {

if (!args.length) args = ['mai','sakurajima']

const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for character named **${args.join(' ')}** on MAL.\n\u200B`).setThumbnail('https://files.catbox.moe/op2978.gif'))

const data = await fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(args.join(' '))}&page=1`).then( res => res.json()).catch(()=>{})

if (!data) return msg.edit(error(`Couldn't find **${args.join(' ')}** on MAL's Character List`))

if (data.error) return msg.edit(error(data.error))

const { results : [ { mal_id }] } = data

const res = await fetch(`https://api.jikan.moe/v3/character/${mal_id}`).then( res => res.json()).catch(()=>{})

if (!res) return msg.edit(error(`Couldn't find **${args.join(' ')}** on MAL's Character List`))

if (res.error) return msg.edit(error(data.error))

const { url, name, name_kanji, about, image_url, animeography, mangaography, voice_actors } = res

const elapsed = new Date() - msg.createdAt
const anime = hyperlink(animeography)
const manga = hyperlink(mangaography)
const seiyuu = seiyuify(voice_actors)

const embed = new MessageEmbed()
  .setAuthor(`${name} • ${name_kanji}`, null, url)
  .setThumbnail(image_url)
  .setColor('GREY')
  .setDescription(textTrunctuate(about.replace(/\\n/g,''),500,`... [Read More](${url})`))
  .addField('Anime Appearances',anime.length < 4 ? anime.join('\n') : `${anime.slice(0,3).join('\n')}\n...and ${anime.length - 3} more!`)
  .addField('Manga Appearances', manga.length < 4 ? manga.join('\n') : `${manga.slice(0,3).join('\n')}\n...and ${manga.length - 3} more!`)
  .addField(`Seiyuu`, seiyuu.length < 4 ? seiyuu.join('\n') : seiyuu.slice(0,3).join('\n'), true)
  .setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds`)
if (seiyuu.length > 3) embed.addField(`\u200B`, seiyuu.length < 7 ? seiyuu.slice(3).join('\n') : seiyuu.slice(3,6).join('\n'), true)
if (seiyuu.length > 6) embed.addField(`\u200B`, seiyuu.length < 10 ? seiyuu.slice(6).join('\n') : `${seiyuu.slice(6,8).join('\n')}\n...and ${seiyuu.length - 8} more!`,true)


msg.edit(embed)

}

module.exports.config = {
  name: "character",
  aliases: ['anichar','char','c'],
  cooldown: {
    time: 10,
    msg: 'Oops! You\'re going too fast!'
  },
  guildOnly: true,
	group: 'anime',
	description: 'Searches for a character in [MyAnimeList.net](https://myanimelist.net).',
	examples: ['character mai sakurajima','anichar Mai Sakurajima','char Mai-san','c mai'],
	parameters: ['search query']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function hyperlink(data){

  if (!data) return [`None`]

  if (!data.length) return [`None`]
  let res = []
  data.forEach( piece => {
    res.push(`• [${piece.name}](${piece.url}) as ${piece.role}`)
  })
  return res
}

function seiyuify(data){
  const langflags = [{lang:'Hungarian',flag:'🇭🇺'},{lang:'Japanese',flag:'🇯🇵'},{lang:'French',flag:'🇫🇷'},{lang:'Russian',flag:'🇷🇺'},{lang:'German',flag:'🇩🇪'},{lang:'English',flag:'🇺🇸'},{lang:'Italian',flag:'🇮🇹'},{lang:'Spanish',flag:'🇪🇸'},{lang:'Korean',flag:'🇰🇷'},{lang:'Chinese',flag:'🇨🇳'},{lang:'Brazilian',flag:'🇧🇷'}]
  if (!data.length) return ['none']
  let res = []
  data.forEach( seiyuu => {
    res.push(`${langflags.find( m => m.lang === seiyuu.language) ? langflags.find( m => m.lang === seiyuu.language).flag : seiyuu.language } - [${seiyuu.name}](${seiyuu.url})`)
  })
  return res
}
