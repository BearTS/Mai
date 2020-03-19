const settings = require('./../../botconfig.json')
const {RichEmbed} = require('discord.js')
const utils = require('./../../utils/majUtils.js')
const fetch = require('node-fetch')

module.exports.run = (bot,message,args) => {
  if (args.length<1) return message.react('👎').then(()=>message.reply(`Please include the name of the character to search`)).catch(console.error)

  getManga(args.join(' ')).then(res=>{
    if (res.err) return message.react('👎').then(()=>message.reply(res.err)).catch(console.error)

    storeResultsToEmbed(res).then(embeds =>{

      message.channel.send(embeds[0]).then(async (msg) => {
        const collector = await msg.createReactionCollector((reaction, user) => user.id === message.author.id)
        let reactions = ['◀', '▶', '❌'];
        for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);

        let timeout = setTimeout(function() {
            return collector.stop('timeout');
        }, 120000);

        let n = 0;

        collector.on('collect', async(r)=>{
          if (r.emoji.name === '◀') {
              if (n<1){
                n = ((embeds.length > 10) ? 10 : embeds.length)
              }
            clearTimeout(timeout)
            n--;
            await msg.edit(embeds[n])
          } else if (r.emoji.name === "▶"){
            if (n>((embeds.length > 10) ? 8 : (embeds.length-2))) {
              n = -1
            }
            clearTimeout(timeout)
            n++;
            await msg.edit(embeds[n])
          } else if (r.emoji.name === "❌"){
            collector.stop('terminated')
          }

          await r.remove(message.author.id); //Delete user reaction

          timeout = setTimeout(function() {
              collector.stop('timeout');
          }, 120000);

        })

        collector.on('end', async(collected,reason)=>{
          msg.clearReactions()
          if (reason==='timeout'){
            return
          } else if (reason==='terminated') {
            return
          }
        })
      })
    })
  })
}

module.exports.help = {
  name: 'manga',
  aliases: ["animanga",'searchmanga'],
	group: 'anime',
	description: 'Searches for a Manga in MyAnimeList.net. Returns a maximum of 10 results',
	examples: ['manga gotoubun no hanayome','animanga quintissential quintuplets','searchmanga gotoubun'],
	parameters: ['search query']
}

function getManga(query){
  return new Promise((resolve,reject)=>{
    fetch(`https://api.jikan.moe/v3/search/manga?q=${encodeURI(query)}&page=1`).then(res => res.json()).then(json => {
      if (json.error){
        resolve({err:`Couldn't find ${query} on Manga List!`})
      } else if (json.results.length<1) {
        resolve({err:`Couldn't find ${query} on Manga List!`})
      }else resolve(json.results)
    })
  })
}


function storeResultsToEmbed(data){
  return new Promise((resolve,reject)=>{
    embeds = []
    data.forEach(obj=>{
      let n = new RichEmbed()
      .setTitle(obj.title)
      .setURL(obj.url)
      .setColor(settings.colors.embedDefault)
      .setImage(obj.image_url)
      .setDescription(obj.synopsis)
      .addField('Type',obj.type,true)
      .addField('Status',(obj.publishing) ? 'Publishing' : 'Finished',true)
      .addField('Chapters',obj.chapters,true)
      .addField('Members',utils.commatize(obj.members),true)
      .addField('Score',obj.score,true)
      .addField('Volumes',obj.volumes,true)
      .addField('Start Date',utils.timeZoneConvert(obj.start_date),true)
      .addField('End Date',utils.timeZoneConvert(obj.end_date),true)
      embeds.push(n)
    })
    for(let x=0;x<(embeds.length-1);x++){
      embeds[x].setFooter(`Page ${x+1} of ${(embeds.length > 10) ? 10 : embeds.length}`)
    }
    resolve(embeds)
  })
}
