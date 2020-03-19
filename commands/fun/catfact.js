const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

fetch("https://catfact.ninja/facts")
    .then(res => res.json())
    .then(json => {
        const embed = new RichEmbed()
        .setThumbnail(`https://static.ezgif.com/images/loadcat.gif`)
        .setDescription(json.data[0].fact)
      .setColor(settings.colors.embedDefault);
      return message.channel.send({embed}).catch(console.error);
    }).catch(err => {
      const embed = new RichEmbed()
      .setThumbnail(`https://static.ezgif.com/images/loadcat.gif`)
      .setDescription("OOPS! Sorry, seems like my API is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`Koneko-chan`,`https://static.ezgif.com/images/loadcat.gif`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    });

}

module.exports.help = {
  name: "catfacts",
  aliases: ["neko","cf","catfact"],
	group: 'fun',
	description: 'Generate a random useless cat facts',
	examples: ['neko','cf'],
	parameters: []
  }
