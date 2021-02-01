const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'tickle',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Sends a roleplay gif `tickle` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been tickled 」. Use to indicate that you tickled the mentioned user (context may vary).',
  examples: [ 'tickle @user' ],
  parameters: ['User Mention'],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.tickle();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      return message.channel.send(embed);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(
        embed.setDescription(`Stop ${message.author}! It tickles~`)
      );

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ Have fun tickling yourself **${message.author.tag}**!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.author} tickled ${args[0]}`)
      );

    };
  }
};
