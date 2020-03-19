const jikanjs  = require('jikanjs');
const {RichEmbed} = require('discord.js')
const settings = require('./../../botconfig.json')
const utility = require('./../../utils/majUtils.js')

module.exports.run = (bot,message,args) => {
  let today = new Date();
  let i = today.getDay();
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  let current = day[i]

  jikanjs.loadSchedule().then(response => {
    if (!response) return message.channel.send(`Internal Server Error. Try again later`).then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

    return new Promise(async(resolve,reject)=>{
      let n = 0;
      const embedder = (data) => {
        let embed = new RichEmbed()
        .setAuthor(`Top ${n+1} Anime Airing for today.`)
        .setDescription("Use `" + settings.prefix + "anime` to display full information about the anime.")
        .setColor(settings.colors.embedDefault)
        .setFooter(`Use ◀ ▶ to navigate. 🗒 for full list. ❌ to cancel | Result ${n+1} of ${data.length}.`)
        if (data[n].title){
          embed.setTitle(data[n].title)
        }
        if (data[n].url){
          embed.setURL(data[n].url)
        }
        if (data[n].image_url){
          embed.setThumbnail(data[n].image_url)
        }
        if (data[n].type){
          embed.addField(`Type`,data[n].type,true)
        }
        if (data[n].airing_start){
          embed.addField(`Aired`,utility.timeZoneConvert(data[n].airing_start),true)
        }
        if (data[n].episodes){
          embed.addField(`Episodes`,data[n].episodes, true)
        }
        if (data[n].genres){
          let genres = []
          for (let z = 0;z<data[n].genres.length;z++){
            genres.push(`[${data[n].genres[z].name}](${data[n].genres[z].url})`)
          }
          embed.addField('Genres',genres.join(', ')+'.',true)
        }
        if (data[n].source){
          embed.addField('Source',data[n].source,true)
        }
        if (data[n].producers){
          let producers = []
          for (let z = 0; z<data[n].producers.length;z++){
            producers.push(`[${data[n].producers[z].name}](${data[n].producers[z].url})`)
          }
          embed.addField(`Producers`,producers.join(', ')+'.',true)
        }
        if (data[n].score){
          embed.addField('Score',data[n].score,true)
        }
        return embed
      }

      const interactiveMessage = await message.channel.send(embedder(response[current]));
      const collector = await interactiveMessage.createReactionCollector((reaction, user) => user.id === message.author.id);
      let reactions = ['◀', '▶', '🗒', '❌'];
      for (let i = 0; i < reactions.length; i++) await interactiveMessage.react(reactions[i]);

      let timeout = setTimeout(function() {
          return collector.stop('timeout');
      }, 120000);

      collector.on('collect', async(r)=>{
        if (r.emoji.name === '◀') {
            if (!(n<1)){
              clearTimeout(timeout)
              n--;
              await interactiveMessage.edit(embedder(response[current]))
          }
        } else if (r.emoji.name === "▶"){
          if (n<(response[current].length-1)){
            clearTimeout(timeout)
            n++;
            await interactiveMessage.edit(embedder(response[current]))
          }
        } else if (r.emoji.name === "🗒"){
            clearTimeout(timeout)
            let embed = new RichEmbed()
            .setColor(settings.colors.embedDefault)
            .setAuthor(`Here are the top 10 airing anime for today`)
            .setDescription(`${today.getDate()} / ${today.getMonth()} / ${today.getFullYear()} - ${days[i]}`)

            const limiter = () => {
              if (response[current].length<10){
                return response[current.length]
              } else return 9
            }
            for (let x = 0 ; x<limiter(); x++){
              if (response[current][x].title){
                if (response[current][x].synopsis){
                  embed.addField(`${x+1}. ${response[current][x].title}`,`*${utility.textTrunctuate(response[current][x].synopsis,200)}*\nSource: ${response[current][x].source} | 📈 Score: ${response[current][x].score} | [MAL](${response[current][x].url})`)
                } else embed.addField(`${x+1}. ${response[current][x].title}`,`Missing Informaion (No Data on synopsis)`)
              } else {
                if (response[current][x].synopsis){
                  embed.addField(`${x+1}. Missing Title (No Data on Title)`,`*${utility.textTrunctuate(response[current][x].synopsis,200)}*\nSource: ${response[current][x].source} | 📈 Score: ${response[current][x].score} | [MAL](${response[current][x].url})`)
                } else {
                  embed.addField(`${x+1}. Error (Missing Data)`,`The Anime data on this slot cannot be fetched. This is an API problem, try again later.`)
                }
              }
            }
            await interactiveMessage.edit(embed)

        } else if (r.emoji.name === "❌"){
          collector.stop('terminated')
        }

        await r.remove(message.author.id); //Delete user reaction
        timeout = setTimeout(function() {
            collector.stop('timeout');
        }, 120000);

      })

      collector.on('end', async(collected,reason)=>{
        interactiveMessage.clearReactions()
        if (reason==='timeout'){
          return resolve(interactiveMessage.edit(`Search Timed-out!`))
        } else if (reason==='terminated') {
          return resolve(interactiveMessage.edit(`Search Terminated!`))
        }
      })
    })
  })
}

module.exports.help = {
  name: 'anitoday',
  aliases: ['animetoday','at','schedule','airing'],
	group: 'anime',
	description: 'Returns the currently airing anime for today.',
	examples: ['anitoday','at'],
	parameters: []
}
