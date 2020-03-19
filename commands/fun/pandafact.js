const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

fetch("https://some-random-api.ml/facts/panda")
    .then(res => res.json())
    .then(json => {
        const embed = new RichEmbed()
        .setThumbnail(`https://i.imgur.com/QUF4VQX.gif`)
        .setDescription(json.fact.toString())
      .setColor(settings.colors.embedDefault);
      return message.channel.send({embed}).catch(console.error);
    }).catch(err => {
      const embed = new RichEmbed()
      .setThumbnail(`https://i.imgur.com/QUF4VQX.gif`)
      .setDescription("OOPS! Sorry, seems like my API is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`Tori-chan`,`https://i.imgur.com/QUF4VQX.gif`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    });

}

module.exports.help = {
  name: "pandafacts",
  aliases: ["pf","pandafact"],
	group: 'fun',
	description: 'Generate a random useless panda facts',
	examples: ['pf','pandafact'],
	parameters: []
  }
