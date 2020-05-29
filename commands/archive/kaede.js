const { safe } = require('../../assets/json/kaede.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "kaede",
    aliases: ['bestimouto','bestlittlesister'],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: ['ATTACH_FILES'],
    cooldown: null,
    group: "core",
    description: "Kaede is the best imouto and there's no denying it!",
    examples: [],
  	parameters: []
  },
  run: async (client, message) => {

    if (message.channel.nsfw) return message.channel.send(error(`Stop right there! You shameless swine! ~ Someone please report ${message.author} to the FBI for Lewding Kaede-chan.`))

    return message.channel.send( new MessageEmbed().setColor('GREY').setImage(safe[Math.ceil(Math.random() * (safe.length))]))

  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
