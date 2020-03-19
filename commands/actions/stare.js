const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const fetch = require('node-fetch')
const baseURI = 'https://rra.ram.moe/i/r?type=stare'
const uri = 'https://rra.ram.moe'

module.exports.run = async (bot, message, args) => {

  if (message.mentions.users.size<1) return message.channel.send(`Having fun staring on nothing?`)
  if (message.mentions.users.first().id === message.client.user.id) return message.channel.send(`Am I really that attractive?`)
  if (message.mentions.users.first().id === message.author.id) return message.channel.send(`Impossible, you can't stare on yourself!`)

  fetch(baseURI).then(res=>res.json()).then(json => {
      let embed = new RichEmbed().setColor(settings.colors.embedDefault)
				 .setImage(uri+json.path)
				.setDescription(`${message.member} on ${message.mentions.users.first()}: Staaaaaaaare~`)
				return message.channel.send(embed)
			})
    }

  module.exports.help = {
  name: "stare",
	aliases: ["glare"],
  group: 'action',
  description: 'Stares at the user you mentioned!',
  examples: ['stare @MaiSakurajima MaiSakurajima','glare MaiSakurajima','stare @MaiSakurajima'],
  parameters: ['mention', 'name']
    }
