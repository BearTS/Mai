const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'holdhands',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Hold hands of someone special.',
  examples: [ 'holdhands @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.holdhands();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(`\\❌ **${message.author.tag}**, whose hands are you holding?!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

     return message.channel.send(embed.setImage(client.images.slap()).setDescription(`${message.author} baka!`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ **${message.author.tag}**, srsly, whose hands are you even holding?`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} holds hands of ${args[0]}!`)
      );

    };
  }
};
