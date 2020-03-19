const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

fetch("https://dog-api.kinduff.com/api/facts")
    .then(res => res.json())
    .then(json => {
        const embed = new RichEmbed()
        .setThumbnail(`https://i.imgur.com/iDhLFct.gif`)
        .setDescription(json.facts.toString())
      .setColor(settings.colors.embedDefault);
      return message.channel.send({embed}).catch(console.error);
    }).catch(err => {
      const embed = new RichEmbed()
      .setThumbnail(`https://i.imgur.com/iDhLFct.gif`)
      .setDescription("OOPS! Sorry, seems like my API is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`Inu-chan`,`https://i.imgur.com/iDhLFct.gif`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    });

}

module.exports.help = {
  name: "dogfacts",
  aliases: ["inu","df","dogfact"],
	group: 'fun',
	description: 'Generate a random useless dog facts',
	examples: ['dogfacts','inu'],
	parameters: []
  }
