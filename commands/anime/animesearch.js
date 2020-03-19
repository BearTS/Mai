const MAL = require('mal-scraper')
const {RichEmbed} = require('discord.js')
const settings = require('./../../botconfig.json')
const utility = require('./../../utils/majUtils.js')

module.exports.run = (bot,message,args) => {

  if (args.length === 0) return message.channel.send('Error: Please include a query to search with.').then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

  MAL.getResultsFromSearch(args.join(' ')).then(data => {
    if (!data) return message.channel.send(`No anime found for ${query}`).then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

    return new Promise(async(resolve,reject)=>{
      let n = 0;
      const embedder = (data) => {
      let embed = new RichEmbed()
      .setAuthor(`🔎 Search Results for ${args.join(' ')}`)
      .setDescription("Use `" + settings.prefix + "anime` to display full information about the anime.")
      .setColor(settings.colors.embedDefault)
      .setFooter(`Use ◀ ▶ to navigate. 🗒 for full list. ❌ to cancel | Result ${n+1} of ${data.length}.`)
      if (data[n].name){
        embed.setTitle(data[n].name)
      }
      if (data[n].url){
        embed.setURL(data[n].url)
      }
      if (data[n].image_url){
        embed.setThumbnail(data[n].image_url)
      }
      if (data[n].type){
        embed.addField(`Type`,data[n].type.toUpperCase(),true)
      }
      if (data[n].payload.aired){
        embed.addField(`Aired`,data[n].payload.aired,true)
      }
      if (data[n].payload.status){
        embed.addField(`Status`,data[n].payload.status,true)
      }
      if (data[n].payload.media_type){
        embed.addField(`Media Type`,data[n].payload.media_type,true)
      }
      if (data[n].payload.start_year){
        embed.addField(`Start Year`,data[n].payload.start_year,true)
      }
      if (data[n].payload.score){
        embed.addField(`Score`,data[n].payload.score,true)
        }
        return embed
      }

      const interactiveMessage = await message.channel.send(embedder(data));
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
              await interactiveMessage.edit(embedder(data))
          }
        } else if (r.emoji.name === "▶"){
          if (n<(data.length-1)){
            clearTimeout(timeout)
            n++;
            await interactiveMessage.edit(embedder(data))
          }
        } else if (r.emoji.name === "🗒"){
            clearTimeout(timeout)
            let c;
            let list = new RichEmbed().setColor(settings.colors.embedDefault)
            for (let c=0; c<data.length; c++){
              list.addField(`${c+1}. ${data[c].name}`,`Type: ${"["}${data[c].type ? data[c].type.toUpperCase(): 'Anime'}${"]"}(${data[c].url}) | Aired: ${data[c].payload.aired ? data[c].payload.aired : `Unknown`} | Status: ${data[c].payload.status ? data[c].payload.status : `Unknown`} | Score ${data[c].payload.score ? data[c].payload.score : `Unscored`}\n\n`)
          }
          list.setAuthor(`🔎 Displaying list of search results for ${args.join(' ')}`)
          .setFooter(`Full list mode. Use ◀ ▶ to navigate back. ❌ to cancel.`);
          await interactiveMessage.edit(list);
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
  name: 'anisearch',
  aliases: ['animanysearch','anilist'],
	group: 'anime',
	description: 'Searches for multiple animes pertaining to the search query. Maximum of 10 results.',
	examples: ['anisearch aobuta','animanysearch seishun buta yaro wa yumemiru shoujo','anilist seishun buta'],
	parameters: ['search query']
}
