const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'lick',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Sends a roleplay gif `lick` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been licked (lero lero lero lero lero) 」. Use to indicate that you are / wanted to lick the mentioned user (context may vary).',
  examples: [ 'lick @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.lick();
    const disgust = client.images.disgust();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      return message.channel.send(embed);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(disgust).setDescription(`${message.member}`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, ever heard of a mirror?`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} just licked ${args[0]}!`)
      );

    };
  }
};
