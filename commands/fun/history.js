const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch');

module.exports.run = async (bot, message, args) => {

fetch("http://history.muffinlabs.com/date")
    .then(res => res.json())
    .then(json => {
      var i = Math.floor(Math.random() * (json.data.Events.length - 1));
      const embed = new RichEmbed()
      .setDescription(`[${(json.date) ? json.date : `Today`}](${json.url ? json.url : `https://placeholder.com`})\n\nYear:**${json.data.Events[i].year}**\n\n${json.data.Events[i].text}`)
      .setImage(json.url)
      .setColor(settings.colors.embedDefault)
      .setFooter(`History Today`);
      return message.channel.send({embed}).catch(console.error);
    })
    .catch(()=>{
      message.channel.send(`Sorry, historyAPI is currently not working!`)
    })
  }



  module.exports.help = {
    name: "today",
    aliases: ["history","historynow","historytoday","hist"],
  	group: 'fun',
  	description: 'Generate a random history on this particular day',
  	examples: ['today','historynow'],
  	parameters: []
  }
