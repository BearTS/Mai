const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { commatize, timeZoneConvert } = require('../../helper.js')

module.exports.run = async ( client, message, args ) => {

if (!args.length) args = ['seishun', 'buta', 'yarou']

let msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nSearching for manga titled **${args.join(' ')}** on MAL.\n\u200B`).setThumbnail('https://files.catbox.moe/op2978.gif'))

const data = await fetch(`https://api.jikan.moe/v3/search/manga?q=${encodeURI(args.join(' '))}&page=1`).then( res => res.json()).catch(()=>{})

const elapsed = new Date() - msg.createdAt

if (!data) try {
  return msg.edit(error(`Couldn't find **${args.join(' ')}** on MAL's Manga List`))
} catch (err) {
  return message.channel.send(error(`Couldn't find **${args.join(' ')}** on MAL's Manga List`))
}

if (data.error) try {
  return msg.edit(error(`Couldn't find **${args.join(' ')}** on MAL's Manga List`))
} catch (err) {
  return message.channel.send(error(`Couldn't find **${args.join(' ')}** on MAL's Manga List`))
}

const { results } = data

const manga = []

results.slice(0,10).forEach( res => {

  if (res === undefined) return

  manga.push( new MessageEmbed()
  .setAuthor(res.title, res.image_url, res.url)
  .setColor('GREY')
  .setDescription(res.synopsis)
  .setThumbnail(res.image_url)
  .addField('Type', res.type, true)
  .addField('Status', res.publishing ? 'Publishing' : 'Finished', true)
  .addField('Chapters', res.chapters, true)
  .addField('Members', commatize(res.members), true)
  .addField('Score', res.score, true)
  .addField('Volumes', res.volumes, true)
  .addField('Start Date', timeZoneConvert(res.start_date), true)
  .addField('End Date', res.end_date ? timeZoneConvert(res.end_date) : 'Unknown', true)
  .addField('\u200B','\u200B',true)
  )
})

try {
  msg.edit(manga[0].setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds • Page 1 of ${manga.length}`))
} catch (err) {
  msg = await message.channel.send(manga[0].setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds • Page 1 of ${manga.length}`))
}
const collector = msg.createReactionCollector( (reaction, user) => user.id === message.author.id)
const navigators = ['◀', '▶', '❌']

for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i])

let timeout = setTimeout(()=> collector.stop('timeout'), 90000)
let n = 0

collector.on('collect', async ( { emoji : { name } , users } ) => {

  switch(name){
    case '◀':
      if (n < 1) n = manga.length
      clearTimeout(timeout)
      n--
      await msg.edit(manga[n].setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds • Page ${n+1} of ${manga.length}`))
    break;
    case '▶':
      if (n === manga.length - 1) n = -1
      clearTimeout(timeout)
      n++
      await msg.edit(manga[n].setFooter(`MyAnimeList.net • Search duration ${(elapsed / 1000).toFixed(2)} seconds • Page ${n+1} of ${manga.length}`))
    break;
    case '❌':
      collector.stop('terminated')
    break;
  }

  await users.remove(message.author.id)

  timeout = setTimeout(() => collector.stop('timeout'), 90000)

})

collector.on('end', () => {
  msg.reactions.removeAll()
})

}

module.exports.config = {
  name: "manga",
  aliases: ['comic','manhwa','manhua'],
  cooldown: {
    time: 10,
    msg: 'Oops! You\'re going too fast!'
  },
  guildOnly:true,
	group: 'anime',
	description: 'Searches for a Manga / Manhwa / Manhua in MyAnimeList.net. Returns a maximum of 10 results',
	examples: ['anime aobuta','ani seishun buta yarou','as bunnygirl senpai'],
	parameters: ['search query']
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
