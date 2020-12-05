const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'cry',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'UWAA~!',
  examples: [ 'cry' ],
  parameters: [],
  run: async ( client, message, args ) => {

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setDescription(`${message.member} started crying!`)
      .setImage(client.images.cry())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
