const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

if (args.join('').split('').length<3) return message.channel.send(`Cannot query **${args.join(' ')}**. Query accepts minimum of 3 characters.`)

getSeiyuu(args.join(' ')).then(res => {
  if (res.err) return message.react('👎').then(()=>message.reply(res.err)).catch(console.error)

    storeResultsToEmbed(res).then(embeds => {
      message.channel.send(embeds[0]).then(async msg=>{
        if (embeds.length === 1) return;
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
  name: "seiyuu",
  aliases: ["va","voiceact"],
	group: 'anime',
	description: 'Searches for a voice avtress in MyAnimeList.net',
	examples: ['seiyuu rie takahashi','va amamiya sora','voiceact saori hayami'],
	parameters: ['search query']
  }

  function getSeiyuu(query){
    return new Promise((resolve,reject)=>{
      fetch(`https://api.jikan.moe/v3/search/people?q=${encodeURI(query)}&page=1`).then(res => res.json()).then(json => {
        if (json.error){
          resolve({err:`Couldn't find ${query} on Seiyuu List!`})
        } else if (json.results.length<1) {
          resolve({err:`Couldn't find ${query} on Seiyuu List!`})
        }else resolve(json.results)
      })
    })
  }

  function storeResultsToEmbed(data){
    return new Promise((resolve,reject)=>{
      embeds = []
      data.forEach(person=>{
        let n = new RichEmbed()
        .setColor(settings.colors.embedDefault)
        .setTitle(person.name)
        .setURL(person.url)
        .setImage(person.image_url)
        embeds.push(n)
      })
      for(let x=0;x<(embeds.length);x++){
        embeds[x].setFooter(`Page ${x+1} of ${(embeds.length > 10) ? 10 : embeds.length}`)
      }
      resolve(embeds)
    })
  }
