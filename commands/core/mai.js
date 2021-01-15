const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'mai',
  aliases: [ 'bestgirl' ],
  group: 'core',
  description: 'Mai is the best girl and there\'s no denying it!',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES' ],
  examples: [
    'mai',
    'bestgirl'
  ],
  run: (client, message) => {

    const image = client.images.mai();

    return message.channel.send(
      new MessageEmbed()
      .setColor('GREY')
      .setFooter(`Mai Images | \©️${new Date().getFullYear()} Mai`)
      .setImage(image)
    );
  }
};
