const { safe, nsfw } = require('../../assets/json/tomoe.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "tomoe",
    aliases: [],
    guildOnly: true,
    ownerOnly: false,
    adminOnly: false,
    permissions: null,
    clientPermissions: ['ATTACH_FILES'],
    cooldown: null,
    group: "core",
    description: "Best Kouhai?",
    examples: [],
  	parameters: []
  },
  run: async (client, message) => {

    if (message.channel.nsfw) return message.channel.send( new MessageEmbed().setColor('GREY').setImage(nsfw[Math.ceil(Math.random() * (nsfw.length))]))

    return message.channel.send( new MessageEmbed().setColor('GREY').setImage(safe[Math.ceil(Math.random() * (safe.length))]))
  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}

/* updater


*/
