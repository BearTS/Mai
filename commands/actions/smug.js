const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch')
const baseURI = 'https://rra.ram.moe/i/r?type=smug'
const uri = 'https://rra.ram.moe'

module.exports.run = async (bot, message, args) => {

  fetch(baseURI).then(res=>res.json()).then(json => {
      let embed = new RichEmbed().setColor(settings.colors.embedDefault)
				 .setImage(uri+json.path)
				.setDescription(`${message.member} smugs.`)
				return message.channel.send(embed)
			})
    }

  module.exports.help = {
  name: "smug",
	aliases: [],
	group: 'action',
	description: 'the epitome of arguments: smug anime girls.',
	examples: ['smug'],
	parameters: []
    }
