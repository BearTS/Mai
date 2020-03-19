const {RichEmbed} = require("discord.js");
const settings = require('./../../botconfig.json');
const actions = require('./../../assets/json/actions.json')

module.exports.run = (bot,message,args) => {

  let embed = new RichEmbed()
    .setColor(settings.colors.embedDefault)
    .setImage(`https://i.imgur.com/${actions.disgust[Math.floor(Math.random()*(actions.disgust.length-1))]}.gif`)
    return message.channel.send(embed)
}

module.exports.help = {
  name: "disgust",
  alias: ["eww","yuck"],
	group: 'action',
	description: 'Absolutely **disgusting**, now which one of you likes handholding?',
	examples: ['disgust @MaiSakurajima MaiSakurajima','eww MaiSakurajima','yuck @MaiSakurajima'],
	parameters: ['mention', 'name']
}
