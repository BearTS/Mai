const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kiss',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Show your love to someone special! Not me lol',
  examples: [ 'kiss @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.kiss();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, you desperate enough to kiss an invisible user?!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.member} E~ecchi!`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, ever heard of a mirror?`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} just kissed ${args[0]}!`)
      );

    };
  }
};
