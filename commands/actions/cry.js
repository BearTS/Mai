const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const actions = require('./../../assets/json/actions.json')


module.exports.run = async (bot, message, args) => {


let embed = new RichEmbed().setColor(settings.colors.embedDefault)
				.setImage(`https://i.imgur.com/${actions.cry[Math.floor(Math.random()*(actions.cry.length-1))]}.gif`)
				.setDescription(`${message.member} started crying! `)
				return message.channel.send(embed)
			}

  module.exports.help = {
  name: "cry",
	aliases: ['sob','waa'],
	group: 'action',
	description: 'UWAA~',
	examples: ['cry'],
	parameters: []
  }
