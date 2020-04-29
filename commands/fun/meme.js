const { MessageEmbed } = require("discord.js")
const fetch = require('node-fetch')

module.exports.run = async ( client, message ) => {

const data = await fetch(`https://meme-api.herokuapp.com/gimme`).then(res => res.json())

if (!data) return message.channel.send(error(`Sorry, seems like i can't connect to memeAPI.`))

const { title, postLink, url, subreddit } = data

return message.channel.send(new MessageEmbed()
  .setAuthor(title, null, postLink)
  .setColor('GREY')
  .setImage(url)
  .setFooter(subreddit)
)

}

module.exports.config = {
  name: "meme",
  aliases: ["humorme"],
  cooldown:{
    time: 0,
    msg: ""
  },
  group: "fun",
  description: "Generate a random meme from a selected subreddit." ,
  examples: ['meme'],
  parameters: []
}

function error(err){
  return new MessageEmbed()
  .setDescription(`\u200B\n${err}\n\u200B`)
  .setColor('RED')
}
