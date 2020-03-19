const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');
const utility = require('./../../utils/majUtils.js')

module.exports.run = async (bot, message, args) => {

  if (args.length === 0) return message.channel.send('Error: Please include a query to search with.').then(message => {setTimeout(()=>{if (!message.deleted) return message.delete()},10000)})

fetch(`https://some-random-api.ml/lyrics?title=${args.join('+')}`)
    .then(res => res.json())
    .then(json => {
      return new Promise(async(resolve,reject)=>{
        let n = 0;
        let newLyricsArray = [];
        const lyricsArray = json.lyrics.split('\n\n')
        for (let i=0;i<(lyricsArray.length);i=i+2){
          newLyricsArray.push(lyricsArray[i]+"\n\n"+(lyricsArray[i+1]?lyricsArray[i+1]:"."))
        }
        const embedder = (newLyricsArray) => {
        const embed = new RichEmbed()
        .setTitle(json.title)
        .setThumbnail(json.thumbnail.genius)
        .setURL(json.links.genius)
        .setAuthor(json.author)
        .setDescription(utility.textTrunctuate(newLyricsArray[n],2000))
        .setColor(settings.colors.embedDefault)
        .setFooter(`Use ◀ ▶ to switch pages. ❌ to cancel. Page ${n+1} of ${newLyricsArray.length} | Powered by GeniusLyrics.com`)
        return embed
      }

      const interactiveMessage = await message.channel.send(embedder(newLyricsArray))
      const collector = await interactiveMessage.createReactionCollector((reaction, user) => user.id === message.author.id);
      let reactions = ['◀', '▶', '❌'];
      for (let i = 0; i < reactions.length; i++) await interactiveMessage.react(reactions[i]);

      let timeout = setTimeout(function() {
          return collector.stop('timeout');
      }, 120000);

      collector.on('collect', async(r)=>{
        if (r.emoji.name === '◀') {
            if (!(n<1)){
              clearTimeout(timeout)
              n--;
              await interactiveMessage.edit(embedder(newLyricsArray))
          }
        } else if (r.emoji.name === "▶"){
          if (n<(newLyricsArray.length-1)){
            clearTimeout(timeout)
            n++;
            await interactiveMessage.edit(embedder(newLyricsArray))
          }
        }  else if (r.emoji.name === "❌"){
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
          return resolve(interactiveMessage.edit(`Timed-out! Can no longer switch between pages.`))
        } else if (reason==='terminated') {
          return resolve(interactiveMessage.edit(`Terminated! Can no longer switch between pages.`))
          }
        })
      })
    }).catch(err => {
      const embed = new RichEmbed()
      .setThumbnail(`http://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png`)
      .setDescription("OOPS! Sorry, seems like my API is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`GeniusLyrics`,`http://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    });

}

module.exports.help = {
  name: "lyrics",
  aliases: ["getlyrics","song"],
	group: 'music',
	description: 'Get the lyrics from the queried song.',
	examples: ['lyrics Gotoubun no Kimochi'],
	parameters: ['query']
  }
