const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'tickle',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Tickle your friends!',
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

    if (!message.mentions.members.size){

      return message.channel.send(embed);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(
        embed.setDescription(`Stop ${message.member}! It tickles~`)
      );

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`<:cancel:767062250279927818> | Have fun tickling yourself ${message.author}!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} tickled ${args[0]}`)
      );

    };
  }
};
