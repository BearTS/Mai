const { safe } = require('../../assets/json/shoko.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "shoko",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: ['ATTACH_FILES'],
    cooldown: null,
    group: "core",
    description: "Cuteness overload",
    examples: [],
  	parameters: []
  },
  run: async (client, message) => {

    if (message.channel.nsfw) return message.channel.send(error(`Stop right there! You shameless swine! ~ Someone please report ${message.author} to the FBI for Lewding Shouko-chan.`))

    return message.channel.send( new MessageEmbed().setColor('GREY').setImage(safe[Math.ceil(Math.random() * (safe.length))]))

  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
