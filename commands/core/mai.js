const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'mai',
  aliases: [ 'bestgirl' ],
  group: 'core',
  description: 'Mai is the best girl and there\'s no denying it!',
  clientPermissions: [ 'EMBED_LINKS', 'ATTACH_FILES' ],
  get examples(){ return [ this.name, ...this.aliases ]; },
  run: (client, message) => {

    const { nsfw } = message.channel;
    const image = client.images.mai({ nsfw });

    return message.channel.send(
      new MessageEmbed()
      .setColor(nsfw ? 'RED' : 'GREY')
      .setFooter(`Mai Images | \©️${new Date().getFullYear()} Mai`)
      .setImage(image)
    );
  }
};
