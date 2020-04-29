const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')
const { textTrunctuate, timeZoneConvert } = require('../../helper.js')
const week = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday']

module.exports.run = async (client, message, [ day ]) => {

if (!day || !week.includes(day.toLowerCase())) day = week[new Date().getDay()]

let res = await fetch(`https://api.jikan.moe/v3/schedule/${day}`).then(res => res.json()).catch(()=>{})

if (!res) return message.channel.send(error(`Fetching data failed.`))

res = res[day]

const schedule = []

res.forEach( data => {

  if (!data) return

  schedule.push( new MessageEmbed()
  .setAuthor(data.title, data.image_url , data.url)
  .setColor('GREY')
  .setDescription(`${data.score ? `Score: ${data.score}\n\n` : ''}${textTrunctuate(data.synopsis, 300)}`)
  .addField(`Type`,data.type, true)
  .addField(`Started`, timeZoneConvert(data.airing_start),true)
  .addField(`Source`,data.source, true)
  .addField(`Genres`,extract(data.genres),true)
  .addField(`Producers`,extract(data.producers),true)
  .addField(`Licensors`,data.licensors.length > 0 ? data.licensors.join(', ') : 'None Found.',true)
  .setThumbnail(data.image_url))
})

const msg = await message.channel.send(schedule[0].setFooter(`Page 1 of ${schedule.length}`))
const collector = msg.createReactionCollector( (reaction, user) => user.id === message.author.id)
const navigators = ['◀', '▶', '❌']

for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i])

let timeout = setTimeout(()=> collector.stop('timeout'), 90000)
let n = 0

collector.on('collect', async ( { emoji: { name } , users } ) => {

  switch(name){
    case '◀':
      if (n < 1) n = schedule.length
      clearTimeout(timeout)
      n--
      await msg.edit(schedule[n].setFooter(`Page ${n+1} of ${schedule.length}`))
    break;
    case '▶':
      if (n === schedule.length - 1) n = -1
      clearTimeout(timeout)
      n++
      await msg.edit(schedule[n].setFooter(`Page ${n+1} of ${schedule.length}`))
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
  name: "schedule",
  aliases: ['anitoday','airing'],
  cooldown: {
    time: 0,
    msg: '',
  },
  guildOnly: true,
	group: 'anime',
	description: 'Displays the list of currently airing anime for today\'s date or given weekday.',
	examples: ['schedule monday','airing'],
	parameters: ['search query']
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

function extract(data){
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
