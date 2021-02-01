const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'blush',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Blushes at a user.',
  examples: [ 'blush @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.blush();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      return message.channel.send(embed.setDescription(`${message.member} Blushes`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.member} Blushes`));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} blushes at ${args[0]}!`)
      );

    };
  }
};
