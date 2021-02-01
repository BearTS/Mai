const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'poke',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Sends a roleplay gif `poke` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The mentioned user ignores you, so you poke them 」. Use to indicate that you are in need of attention from the mentioned user (context may vary).',
  examples: [ 'poke @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.poke();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(`\\❌ **${message.author.tag}**, who am I supposed to poke?`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(
        embed.setDescription('I\'m already here! Need something?')
      );

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ No **${message.author.tag}**!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} poked ${args[0]}`)
      );

    };
  }
};
