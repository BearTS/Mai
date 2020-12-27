const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'suicide',
  aliases: ['kms'],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  nsfw: true,
  description: 'KYSL - KillYourSelfLol',
  examples: [ 'suicide', 'kms' ],
  parameters: [],
  run: async ( client, message, args ) => {

    return message.channel.send(
      new MessageEmbed()
      .setDescription(`${message.author} just committed a suicide. Horrible.`)
      .setColor('GREY')
      .setImage(client.images.suicide())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
