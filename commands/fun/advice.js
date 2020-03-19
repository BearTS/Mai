const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

fetch("https://api.adviceslip.com/advice")
    .then(res => res.json())
    .then(json => {
        const embed = new RichEmbed()
        .setDescription(json.slip.advice)
        .setColor(settings.colors.embedDefault);
        return message.channel.send({embed}).catch(console.error);
    }).catch(err => {
      const embed = new RichEmbed()
      .setDescription("OOPS! Sorry, seems like my API is not working")
      .setColor(settings.colors.embedDefault);
      return new Promise(async(resolve,reject)=>{
        var hook = await message.channel.createWebhook(`Mr. Advisor`,`https://i.imgur.com/vI2zfBA.png`)
        await hook.send(embed).catch(console.error);
        setTimeout(async function() {
            await hook.delete()
        }, 1000);
      })
    });

}

module.exports.help = {
  name: "advice",
  aliases: ["tips","advise"],
	group: 'fun',
	description: 'Generate a random useless advice',
	examples: ['advice','tips'],
	parameters: []
  }
