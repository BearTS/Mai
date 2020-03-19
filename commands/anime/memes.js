const {RichEmbed} = require('discord.js')
const settings = require('./../../botconfig.json')
const utility = require('./../../utils/majUtils.js')
const fetch = require('node-fetch')
const subreddits = [
    "Animemes",
    "MemesOfAnime",
    "AnimeFunny"
]

module.exports.run = (bot,message,args) => {
  var randSubreddit = subreddits[Math.round(Math.random() * (subreddits.length - 1))];

fetch(`https://www.reddit.com/r/${randSubreddit}.json`).then(res => res.json()).then(data => {
  let info = []
  res = data.data.children.filter(m=>m.data.post_hint === 'image')
  res.forEach(post => {
    info.push({title:post.data.title,up:post.data.ups,downs:post.data.downs,link:`https://www.reddit.com${post.data.permalink}`,image:post.data.url})
  })

  reddit = info[Math.floor(Math.random()*(info.length-1))]

  if (!reddit) return message.channel.send(`An error occured while trying to get memes from r/${randSubreddit}`)

  const meme = new RichEmbed()
      .setFooter(`${utility.commatize(reddit.up)}👍 | ${utility.commatize(reddit.downs)}👎 || ${randSubreddit}`)
      .setColor(settings.colors.embedDefault)
      .setTitle(reddit.title)
      .setURL(reddit.link)
      .setImage(reddit.image).setTimestamp()

  return new Promise( async (resolve, reject) => {
    const sent = await message.channel.send(meme)
    let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
    for (let i = 0; i < reactions.length; i++) await sent.react(reactions[i]);
      })
})
}

module.exports.help = {
  name: 'animeme',
  aliases: ['ameme','animememe','animemes','animememes','amemes'],
	group: 'anime',
	description: 'Generate a random anime meme fetched from selected subreddits.',
	examples: ['animeme','ameme','animememe'],
	parameters: []
}
