const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
const { TextHelpers: { textTrunctuate }} = require('../../helper')
const { pointright, pointleft, cancel } = require('../../emojis')

module.exports = {
  name: 'lyrics',
  aliases: [],
  group: 'utility',
  description: 'Searches for lyric info about a song from GeniusLyrics',
  examples: ['lyrics Fukashigi No Karte'],
  parameters: ['Search Query'],
  run: async (client, message, args) => {
    if (args.length === 0) return message.channel.send('Error: Please include a query to search with.').then(message => { setTimeout(() => { if (!message.deleted) return message.delete() }, 10000) })

    fetch(`https://some-random-api.ml/lyrics?title=${args.join('+')}`)
      .then(res => res.json())
      .then(json => {
        return new Promise(async (resolve, reject) => {
          let n = 0;
          let newLyricsArray = [];
          const lyricsArray = json.lyrics.split('\n\n')
          for (let i = 0; i < (lyricsArray.length); i = i + 2) {
            newLyricsArray.push(lyricsArray[i] + "\n\n" + (lyricsArray[i + 1] ? lyricsArray[i + 1] : "."))
          }
          const embedder = (newLyricsArray) => {
            const embed = new MessageEmbed()
              .setTitle(json.title)
              .setThumbnail(json.thumbnail.genius)
              .setURL(json.links.genius)
              .setAuthor(json.author)
              .setDescription(textTrunctuate(newLyricsArray[n], 2000))
              .setColor('RANDOM')
              .setFooter(`Use ◀ ▶ to switch pages. ❌ to cancel. Page ${n + 1} of ${newLyricsArray.length} | Powered by GeniusLyrics.com`)
            return embed
          }

          const msg = await message.channel.send(embedder(newLyricsArray)).catch( () => message.react("👎") )
          if (!msg) return

          const left = pointleft(client)
          const right = pointright(client)
          const terminate = cancel(client)
          const collector = msg.createReactionCollector( (reaction ,user) => user.id === message.author.id )

          const navigators = [ left, right, terminate ]
          for (let i = 0; i < navigators.length; i++) await msg.react(navigators[i]);

          let timeout = setTimeout(()=> collector.stop('timeout'), 120000)
          let i = 0

          collector.on('collect', async ( { emoji: { name } , users } ) => {

          switch(name){
            case left.name ? left.name : left:
              if (!(n<1))
              clearTimeout(timeout)
              n--
              await msg.edit(embedder(newLyricsArray))
            break;
            case right.name ? right.name : right:
              if (n<(newLyricsArray.length-1))
              clearTimeout(timeout)
              n++
              await msg.edit(embedder(newLyricsArray))
            break;
            case terminate.name ? terminate.name : terminate:
              collector.stop('terminated')
            break;
          }

          await users.remove(message.author.id)

          timeout = setTimeout(()=> collector.stop('timeout'), 120000)

        })

        collector.on('end', ()=>{

          msg.reactions.removeAll()
        })
      })
    }).catch(err => {
        const embed = new MessageEmbed()
          .setThumbnail(`http://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png`)
          .setDescription("Oops! Sorry, seems like the API is not working")
          .setColor('RANDOM');
        return new Promise(async (resolve, reject) => {
          var hook = await message.channel.createWebhook(`Genius Lyrics`, `http://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png`)
          await hook.send(embed).catch(console.error);
          setTimeout(async function() {
            await hook.delete()
          }, 1000);
        })
      });

  }
}
