const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'smug',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Sends a roleplay gif `smug` to the chat. Usually interpreted as 「 The user who used this command smugs at the previous chat 」. Use to indicate that you sense the ulterior motive the previous user sent in chat.',
  examples: [ 'smug' ],
  parameters: [],
  run: async ( client, message, args ) => {

    return message.channel.send(
      new MessageEmbed()
      .setDescription(`${message.author} smugs.`)
      .setColor('GREY')
      .setImage(client.images.smug())
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`)
    );
  }
};
