const { MessageEmbed } = require('discord.js');
module.exports = {
  name: 'dance',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'UWAA~!',
  examples: [ 'dance' ],
  parameters: [],
  run: async ( client, message, args ) => {
    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setDescription(`${message.member} started dancing!`)
      .setImage(client.images.dance())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    );
  }
}
