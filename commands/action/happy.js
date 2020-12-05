const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'happy',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Happy!',
  examples: [ 'happy' ],
  parameters: [],
  run: async ( client, message, args ) => {

    return message.channel.send(
      new MessageEmbed()
      .setDescription(`${message.author} is happy.`)
      .setColor('GREY')
      .setImage(client.images.happy())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
