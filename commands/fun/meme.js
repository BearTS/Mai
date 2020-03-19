const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch')

module.exports.run = (bot, message, args) => {
  fetch('https://meme-api.herokuapp.com/gimme')
    .then(res => res.json())
    .then(json => {
        const embed = new RichEmbed()
        .setDescription(`[${json.title}](${json.postLink})`)
        .setColor(settings.colors.embedDefault)
        .setImage(json.url)
        .setFooter(json.subreddit)
        message.channel.send(embed).then(async msg=>{
          let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
          for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);
        })
    }).catch(()=>{
      const embed = new RichEmbed()
      .setDescription(`ERROR: HUMOR MODULE NOT FOUND.`)
      .setColor(settings.colors.embedDefault)
      .setThumbnail('https://i.imgur.com/DUZOVQT.gif')
      message.channel.send(embed)
    })


}

module.exports.help = {
	name: "meme",
  aliases:[],
  group: 'fun',
  description: 'Generate a random meme from a selected subreddit.',
  examples: ['meme'],
  parameters: []
}
