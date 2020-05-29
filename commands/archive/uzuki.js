const uzuki = require('../../assets/json/uzuki.json')
const { MessageEmbed } = require('discord.js')

module.exports = {
  config: {
    name: "uzuki",
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

    return message.channel.send(error(`No images were saved for Hirokawa Uzuki yet`))

  }
}


function error(err){
  return new MessageEmbed()
  .setColor('RED')
  .setDescription(`\u200B\n${err}\n\u200B`)
}
