const settings = require('./../../botconfig.json')
const {RichEmbed} = require('discord.js')
const utility = require('./../../utils/majUtils.js')
const fetch = require('node-fetch')
const langflags = [{lang:'Japanese',flag:'🇯🇵'},{lang:'French',flag:'🇫🇷'},{lang:'Russian',flag:'🇷🇺'},{lang:'German',flag:'🇩🇪'},{lang:'English',flag:'🇺🇸'},{lang:'Italian',flag:'🇮🇹'},{lang:'Spanish',flag:'🇪🇸'},{lang:'Korean',flag:'🇰🇷'},{lang:'Chinese',flag:'🇨🇳'},{lang:'Brazilian',flag:'🇧🇷'}]

module.exports.run = (bot,message,args) => {

if (args.length<1) return message.react('👎').then(()=>message.reply(`Please include the name of the character to search`)).catch(console.error)

getcharacter(args.join(' ')).then(res => {
  if (res.err) return message.react('👎').then(()=>message.reply(res.err)).catch(console.error)

  getData(res.id).then(data => {
    if (data.err) return message.react('👎').then(()=>message.reply(data.err)).catch(console.error)

    embedAllData(res,data).then(embed => {
      return new Promise( async (resolve, reject) => {
        const sent = await message.channel.send(embed)
        let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
        for (let i = 0; i < reactions.length; i++) await sent.react(reactions[i]);
        })
      })
    })
  })
}


module.exports.help = {
  name: 'character',
  aliases: ['anichar','char','c'],
	group: 'anime',
	description: 'Searches for a character in MyAnimeList.net',
	examples: ['character mai sakurajima','anichar Mai Sakurajima','char Mai-san','c mai'],
	parameters: ['search query']
}

function getcharacter(query){
  return new Promise((resolve,reject)=>{
    fetch(`https://api.jikan.moe/v3/search/character?q=${encodeURI(query)}&page=1`).then(res => res.json()).then(json => {
      if (json.error){
        resolve({err:`Couldn't find ${query} on Anime Character List!`})
      } else if (json.results.length<1) {
        resolve({err:`Couldn't find ${query} on Anime Character List!`})
      }else resolve({id:json.results[0].mal_id,name:json.results[0].name,altNames:json.results[0].alternative_names})
    });
  })
}

function getData(id){
  return new Promise((resolve,reject)=>{
    fetch(`https://api.jikan.moe/v3/character/${id}`).then(res => res.json()).then(json => {
    if (json.error) resolve({err:`The server replied with a bad response.`})
    resolve({
      characterURL: json.url,
      name_kanji: json.name_kanji,
      description: json.about,
      imageURL: json.image_url,
      anime: json.animeography,
      manga: json.mangaography,
      va: json.voice_actors
    })
  })
})
}

function embedAllData(res,data){
return new Promise((resolve,reject)=>{
hyperlink(data.anime).then(anime => {
  hyperlink(data.manga).then(manga => {
    linkSeiyuu(data.va).then(seiyuu => {
      const embed = new RichEmbed()
      .setTitle(`${res.name}  •  ${data.name_kanji}`)
      .setURL(data.characterURL)
      .setThumbnail(data.imageURL)
      .addField(`Description`,utility.textTrunctuate(data.description.replace(/\\n/g,''),600))
      .addField(`Anime Appearance`, utility.textTrunctuate(anime,600))
      .addField(`Manga Appearance`, utility.textTrunctuate(manga,600))
      .addField(`Seiyuu`,utility.textTrunctuate(seiyuu,600))
      .setTimestamp()
      .setColor(settings.colors.embedDefault)
      if (res.altNames.length>1){
      embed.setDescription(`Also known as *${res.altNames.join(', ')}*.`)
        }
      resolve(embed)
        })
      })
    })
  })
}

function hyperlink(animeography){
return new Promise((resolve,reject)=>{
  if (animeography.length<1) resolve('None')
  let data = []
  animeography.forEach(anime => {
    data.push(`[${anime.name}](${anime.url}) as ${anime.role}`)
  })
  let output = ''
  data.forEach(dataset => {
    output += `• ${dataset}\n`
  })
    resolve(output)
  })
}

function linkSeiyuu(seiyuu){
  return new Promise((resolve,reject)=>{
    if (seiyuu.length<1) resolve('None')
    let data = []
    seiyuu.forEach(seiyuus => {
      data.push(`${langflags.find(m => m.lang === seiyuus.language) ? langflags.find(m => m.lang === seiyuus.language).flag : ''} - [${seiyuus.name}](${seiyuus.url}) *(${seiyuus.language})*`)
    })
    let output = ''
    data.forEach(dataset => {
      output += `• ${dataset}\n`
    })
    resolve(output)
  })
}
