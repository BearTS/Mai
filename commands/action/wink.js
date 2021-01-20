const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'wink',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Wink at a user.',
  examples: [ 'wink @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.hug();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      return message.channel.send(embed.setDescription(`${message.member} winks!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(blush).setDescription(`${message.member} baka`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.member} wink!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} winks at ${args[0]}!`)
      );

    };
  }
};
