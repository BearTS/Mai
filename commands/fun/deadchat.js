const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'deadchat',
  aliases: [ 'ddc' ],
  group: 'fun',
  description: 'dead chat huh.',
  clientPermissions: [ 'EMBED_LINKS' ],
  get examples(){ return [ this.name, ...this.aliases ];},
  run: async (client, message, args) => {

    const rep = await message.channel.send(
      new MessageEmbed()
      .setTitle("Dead Chat")
      .setColor('GREY')
      .setImage("https://mma.prnewswire.com/media/951563/Automotive_Website_Chat_is_DEAD.jpg?p=publish")
    );

    await message.delete().catch(() => null);

    return rep.react("🇫")
  }
};
