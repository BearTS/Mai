const MALJS = require('maljs')
const {RichEmbed} = require('discord.js')
const settings = require('./../../botconfig.json')
const utility = require('./../../utils/majutils.js')
const fetch = require('node-fetch')

module.exports.run = (bot,message,args) => {

getIndexer(args.join('')).then(picker=>{
  if (picker.err) message.reply(picker.err)

  MALJS.getTopAnime().then((res)=>{
    if (!res) return message.channel.send(`The server responded with an empty data. This could be a problem with the API.`)

    fetch(`https://api.jikan.moe/v3/anime/${res[picker.picker-1].id}`).then(res => res.json()).then(data => {
      hyperlink(data.producers).then(producers => {
        hyperlink(data.licensors).then(licensors => {
          hyperlink(data.studios).then(studios => {
            hyperlink(data.genres).then(genres => {


              let embed = new RichEmbed()
              .setTitle(`${utility.ordinalize(picker.picker)}: ${data.title} • ${data.title_japanese}`)
              .setURL(data.url)
              .setImage(data.image_url)
              .setColor(settings.colors.embedDefault)
              .setDescription(utility.textTrunctuate(`${data.title_english ? data.title_english : ''}\n**${data.type ? data.type : 'TV'}**  •  *${data.rating ? data.rating : 'Unrated'}*   •   **${data.duration ? data.duration : 'Mixed'} ${data.episodes ? `with ${data.episodes} episodes.`:''}**\n\n${data.synopsis ? data.synopsis.replace('[Written by MAL Rewrite]','') : ''}`,2000))
              .addField('Aired',data.aired.string,true)
              .addField('Source',data.source ? data.source : 'Unknown',true)
              .addField('Genres',genres,true)
              .addField('Producers',producers,true)
              .addField('Studios',studios,true)
              .addField('Licensors',licensors,true)
              .addField('Opening Themes',data.opening_themes.length>0 ? data.opening_themes.join('\n') : 'None')
              .addField('Ending Themes',data.ending_themes.length>0 ? data.ending_themes.join('\n') : 'None')
              .setFooter(`Scored ${data.score} by ${utility.commatize(data.scored_by)} users.`)

              return new Promise( async (resolve, reject) => {
                const sent = await message.channel.send(embed)
                let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
                for (let i = 0; i < reactions.length; i++) await sent.react(reactions[i]);
              })
            })
          })
        })
      })
      })
    })
  })
}

module.exports.help = {
  name: "anitop",
  aliases: ['topanime','bestanime'],
	group: 'anime',
	description: 'Searches for a top anime in MyAnimeList.net, or return a random one.',
	examples: ['anitop','topanime 5','bestanime 50'],
	parameters: ['rank']
}

function getIndexer(index){
  return new Promise((resolve,reject)=>{
    if (index==='') resolve({picker:Math.floor(Math.random()*49),err:false})
    if (isNaN(Number(index))){
      resolve({picker:Math.floor(Math.random()*49),err:`**${index}** is not a valid number. Randomizing instead....`})
    } else if (Number(index)<1){
      resolve({picker:Math.floor(Math.random()*49),err:`The number provided must be greater than 1. Randomizing instead....`})
    } else if (Number(index)>50){
        resolve({picker:Math.floor(Math.random()*49),err:`The number provided must not be more than 50. Randomizing instead....`})
    } else resolve({picker:Number(index),err:false})
  })
}

function hyperlink(data){
  return new Promise((resolve,reject)=>{
    if (data.length === 0) resolve('None')
    let array = []
    data.forEach(dataset =>{
      array.push(`[${dataset.name}](${dataset.url})`)
    })
    let output = ''
    if (array.length > 1){
      last = array.pop()
      output = `${array.join(', ')}, and ${last}.`
    } else {
      output = `${array.toString()}.`
    }
    resolve(output)
  })
}
