const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'hug',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Hug someone special.',
  examples: [ 'hug @user' ],
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

      return message.channel.send(embed.setDescription(`${message.member} H~here! Thought you needed a hug!`));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.member} H~how thoughtful! Thank you! ʸᵒᵘ'ʳᵉ ⁿᵒᵗ ˢᵃᵏᵘᵗᵃ ᵗʰᵒ`));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setDescription(`${message.member} H~here! Thought you needed a hug!`));

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} was being hugged by ${message.member}!`)
      );

    };
  }
};
