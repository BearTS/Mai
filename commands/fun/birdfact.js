const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

fetch("https://some-random-api.ml/facts/bird")
    .then(res => res.json())
    .then(json => {
        const embed = new RichEmbed()
        .setThumbnail(`https://i.imgur.com/arkxS3f.gif`)
        .setDescription(json.fact.toString())
      .setColor(settings.colors.embedDefault);
      return message.channel.send({embed}).catch(console.error);
    }).catch(err => {
      const embed = new RichEmbed()
      .setThumbnail(`https://i.imgur.com/arkxS3f.gif`)
      .setDescription("OOPS! Sorry, seems like my API is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`Tori-chan`,`https://i.imgur.com/arkxS3f.gif`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    });

}

module.exports.help = {
  name: "birdfacts",
  aliases: ["tori","bf","birdfact"],
	group: 'fun',
	description: 'Generate a random useless bird facts',
	examples: ['birdfacts','tori'],
	parameters: []
  }
