const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports.run = async (client, message, [subreddit] ) => {

  if (!subreddit) return message.channel.send(error(`Please supply the subreddit.`))

  const msg = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nFetching information from **[r/${subreddit}](https://reddit.com/r/${subreddit})**. Please Wait.\n\u200B`))

  const data = await fetch(`https://reddit.com/r/${subreddit}.json`).then(res => res.json()).catch(()=>{})

  if (!data) {
    try {
      return msg.edit(error(`Couldn't find https://reddit.com/r/${subreddit}. Please enter a valid subreddit.`))
    } catch (err) {
      return message.channel.send(error(`Couldn't find https://reddit.com/r/${subreddit}. Please enter a valid subreddit.`))
    }
  }

  if (!data.data) try {
        return msg.edit(error(`Couldn't find images on https://reddit.com/r/${subreddit}.`))
      } catch (err) {
        return message.channel.send(error(`Couldn't find images on https://reddit.com/r/${subreddit}.`))
      }

  const { data : { children } } = data

  let res = children.filter( m => m.data.post_hint === 'image')

  if (!res.length) {
    try {
      return msg.edit(error(`There are no images found in this subreddit.`))
    } catch (err) {
      return message.channel.send(error(`There are no images found in this subreddit.`))
    }
  }

  if (!message.channel.nsfw) res = res.filter( m => !m.data.over_18)

  if (!res.length) {
    try {
      return msg.edit(error(`Seems like you entered a nsfw subreddit in a sfw channel. Please move to nsfw channel while using this subreddit.`))
    } catch (err) {
      return message.channel.send(error(`Seems like you entered a nsfw subreddit in a sfw channel. Please move to nsfw channel while using this subreddit.`))
    }
  }
  const { data : { title, url, permalink, created_utc }  } = res[Math.floor(Math.random() * (res.length-1))]

  const embed = new MessageEmbed()
  .setAuthor(title, null, `https://www.reddit.com${permalink}`)
  .setColor('GREY')
  .setImage(url)
  .setTimestamp(created_utc * 1000)

try {
  return msg.edit(embed)
} catch (err) {
  return message.channel.send(embed)
}

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
