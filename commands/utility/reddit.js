const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async (client, message, [subreddit] ) => {

  if (!subreddit) return message.channel.send(error(`Please supply the subreddit.`))

  const data = await fetch(`https://reddit.com/r/${subreddit}.json`).then(res => res.json()).catch(()=>{})

  if (!data) return message.channel.send(error(`Please enter a valid subreddit.`))

  if (!data.data) return message.channel.send(error(`Please enter a valid subreddit.`))

  const { data : { children } } = data

  let res = children.filter( m => m.data.post_hint === 'image')

  if (!res.length) return message.channel.send(error(`There are no image found in this subreddit.`))

  if (!message.channel.nsfw) res = res.filter( m => !m.data.over_18)

  if (!res.length) return message.channel.send(error(`Seems like you entered a nsfw subreddit in a sfw channel. Please move to nsfw channel while using this subreddit.`))

  const { data : { title, url, permalink, created_utc }  } = res[Math.floor(Math.random() * (res.length-1))]

  return message.channel.send(new MessageEmbed()
  .setAuthor(title, null, `https://www.reddit.com${permalink}`)
  .setColor('GREY')
  .setImage(url)
  .setTimestamp(created_utc * 1000)
)

}

module.exports.config = {
  name: 'reddit',
  aliases: ['rdt','subreddit','fetchreddit'],
  cooldown: {
    time: 0,
    msg: ""
  },
	group: 'anime',
  guildOnly: true,
	description: 'Fetch a random image from the supplied subreddit',
	examples: ['reddit anime'],
	parameters: []
}

function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
