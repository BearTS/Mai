const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'holdhands',
  aliases: [],
  guildOnly: true,
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

    if (!message.mentions.members.size){

      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, whose hands are you holding?!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

     return message.channel.send(embed.setImage(slap).setDescription(`${message.member} baka`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`<:cancel:767062250279927818> | ${message.author}, srsly, whose hands are you even holding?`);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} holds hands of ${args[0]}!`)
      );

    };
  }
};
