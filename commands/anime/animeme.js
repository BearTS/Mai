const { MessageEmbed, Collection } = require('discord.js')
const fetch = require('node-fetch')
const { commatize } = require('../../helper.js')

module.exports = {
  config: {
    name: 'animeme',
    aliases: ['ameme','animememe','animemes','animememes','amemes'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: null,
    cooldown: null,
    group: 'anime',
    description: 'Generate an anime meme fetched from selected subreddits. Include `reload` parameter to reload meme cache. Memes generated are in order by default, add `r`, `random`, or `randomize` to randomize meme.',
    examples: ['animeme reload','ameme random','animememe'],
    parameters: ['Reload tag','Randomization tag']
  },
  run:  async (client, message, [ parameter ]) => {

    if (!client.memes.get(message.guild.id)){
      client.memes.set(message.guild.id, new Collection())
    }

    const memes = client.memes.get(message.guild.id)

    if (!memes.size) await reloadMeme(memes, message)

    if (parameter === 'reload') {

      await reloadMeme(memes, message)
      if (!memes.size) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('Could not fetch memes from reddit! Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))
      const data = memes.first()
      memes.delete(data.title)
      return message.channel.send(embedMeme(data))

    } else if (parameter && (parameter.toLowerCase() === 'r' || parameter.toLowerCase() === 'random' || parameter.toLowerCase() === 'randomize')) {

      const data = memes.random()

      memes.delete(data.title)
      return message.channel.send(embedMeme(data))

    } else {

      const data = memes.first()
      memes.delete(data.title)
      if (!memes.size) await reloadMeme(memes, message)
      return message.channel.send(embedMeme(data))

    }
  }
}


async function reloadMeme(memes,message){

  if (memes.size){
    memes.clear()
  }

  const data = await fetch(`https://www.reddit.com/r/goodanimemes.json`).then(res => res.json()).catch(()=>{})

  if (!data) return message.channel.send( new MessageEmbed().setColor('RED').setDescription('Could not fetch memes from reddit! Please report this to the bot owner. The API might be down or there might be changes on the API itself.'))

  const { data : { children } } = data

  const info = []

  children.filter( m => m.data.post_hint === 'image').forEach( post => info.push({title:post.data.title,up:post.data.ups,downs:post.data.downs,link:`https://www.reddit.com${post.data.permalink}`,image:post.data.url,timestamp:post.data.created_utc * 1000}))

  info.forEach( meme => {
    memes.set(meme.title,meme)
  })

}

function embedMeme(reddit){

  const meme = new MessageEmbed()
      .setFooter(`${commatize(reddit.up)}👍 | ${commatize(reddit.downs)}👎 || Animeme`)
      .setColor('GREY')
      .setTitle(reddit.title)
      .setURL(reddit.link)
      .setImage(reddit.image)
      .setTimestamp(reddit.timestamp)

  return meme

}
