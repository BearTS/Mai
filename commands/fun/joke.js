const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch')

module.exports.run = async (bot, message, args) => {
  fetch('https://sv443.net/jokeapi/v2/joke/Programming,Miscellaneous?blacklistFlags=nsfw,religious,political,racist,sexist')
    .then(res => res.json())
    .then(json => {
      if (json.type==='single'){
      const embed = new RichEmbed()
      .setAuthor(`${json.category} joke (${json.type})`)
      .setDescription(json.joke)
      .setColor(settings.colors.embedDefault)
      .setThumbnail('https://i.imgur.com/KOZUjcc.gif')
      message.channel.send(embed).then(async msg=>{
        let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
        for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);
      })
    }
      else if (json.type==='twopart'){
        const embed = new RichEmbed()
        .setAuthor(`${json.category} joke (${json.type})`)
        .setDescription(`${json.setup}\n\n||${json.delivery}||`)
        .setColor(settings.colors.embedDefault)
        .setThumbnail('https://i.imgur.com/KOZUjcc.gif')
        message.channel.send(embed).then(async msg=>{
          let reactions = ['👍', '👎', '😂', '😮', '😡', '❌'];
          for (let i = 0; i < reactions.length; i++) await msg.react(reactions[i]);
        })
      }
    }).catch(()=>{
      const embed = new RichEmbed()
      .setDescription(`OOPS! Sorry, the jokeAPI is currently down.`)
      .setColor(settings.colors.embedDefault)
      .setThumbnail('https://i.imgur.com/DUZOVQT.gif')
      message.channel.send(embed)
    })
}

module.exports.help = {
  name: "joke",
  aliases: ["haha"],
  group: 'fun',
  description: 'Generate a random joke from jokeAPI',
  examples: ['joke','haha'],
  parameters: ['category']
}
