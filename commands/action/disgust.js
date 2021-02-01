const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'disgust',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Sends a roleplay gif `disgust` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to is digusting (Mazui!!, Kimoi!!) 」. Use to indicate that you are disgusted by their (ideas on their) previous chats. May be used in a similar context to the emoji 🤮.',
  examples: [ 'disgust @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.disgust();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (message.guild && !message.mentions.members.size){

      return message.channel.send(embed.setDescription(`${message.member} is disgusted..`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.react('💢');

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.author} is disgusted..`));

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} eww!`)
      );

    };
  }
};
