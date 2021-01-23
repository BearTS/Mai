const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  name: 'reddit',
  aliases: ['rdt','subreddit','redd.it','fetchreddit'],
  guildOnly: true,
  cooldown: {
    time: 10000,
    msg: "Accessing Reddit has been rate limited to 1 use per user per 10 seconds"
  },
  group: "utility",
  description: 'Fetch a random image from the supplied subreddit',
  examples: ['reddit anime'],
  parameters: [],
  run: async ( client, message, [ subreddit ]) => {

    if (!subreddit) return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, Please supply the name of the subreddit to fetch`)

    const prompt = await message.channel.send(new MessageEmbed().setColor('YELLOW').setDescription(`\u200B\nFetching information from <:reddit:767062345422864394> **[r/${subreddit}](https://reddit.com/r/${subreddit})**. Please Wait.\n\u200B`).setThumbnail('https://i.imgur.com/u6ROwvK.gif'))

    let res = await fetch(`https://reddit.com/r/${subreddit}.json`).then(res => res.json()).catch(()=>null)

    if (!res || !res.data || !res.data.children || !res.data.children.length)
      try {
        return prompt.edit(new MessageEmbed().setColor('RED').setDescription(`\u200b\n<:cancel:767062250279927818> | ${message.author},That's an invalid/non-existent <:reddit:767062345422864394> subreddit.\n\u200b`))
      } catch {
        return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`\u200b\n<:cancel:767062250279927818> | ${message.author}, Please supply the name of the <:reddit:767062345422864394> subreddit to fetch\n\u200b`))
      }

    res = res.data.children.filter(m => m.data.post_hint === 'image')

    if (!res.length)
    try {
      return prompt.edit(new MessageEmbed().setColor('RED').setDescription(`\u200b\n<:cancel:767062250279927818> | ${message.author}, The <:reddit:767062345422864394> subreddit doesn't have any image posts\n\u200b`))
    } catch {
      return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`\u200b\n<:cancel:767062250279927818> | ${message.author},  The <:reddit:767062345422864394> subreddit doesn't have any image posts\n\u200b`))
    }

    if (!message.channel.nsfw) {
      res = res.filter(m => !m.data.over_18)
      if (!res.length)
      try {
        return prompt.edit(new MessageEmbed().setColor('RED').setDescription(`\u200b\n<:cancel:767062250279927818> | ${message.author}, Seems like you entered a nsfw subreddit in a sfw channel. Please move to nsfw channel while using this subreddit\n\u200b`))
      } catch {
        return message.channel.send(new MessageEmbed().setColor('RED').setDescription(`\u200b\n<:cancel:767062250279927818> | ${message.author},  Seems like you entered a nsfw subreddit in a sfw channel. Please move to nsfw channel while using this subreddit.\n\u200b`))
      }
    }

    const { data : { title, url, permalink, created_utc }  } = res[Math.floor(Math.random() * (res.length-1))]

    const embed = new MessageEmbed()
    .setAuthor(title, null, `https://www.reddit.com${permalink}`)
    .setColor('GREY')
    .setImage(url)
    .setTimestamp(created_utc * 1000)
    .setFooter(`Reddit | \©️${new Date().getFullYear()} Mai`)

    try {
      return prompt.edit(embed)
    } catch {
      return message.channel.send(embed)
    }
  }
}
