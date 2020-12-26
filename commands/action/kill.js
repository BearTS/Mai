const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kill',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Kill someone.',
  examples: [ 'kill @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    ags = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.kill();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      return message.channel.send(embed);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(
        embed.setDescription(`Stop ${message.member}! You can't kill me!`)
      );

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed);

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member} just killed ${args[0]}! Reviving in t-minus n seconds.`)
      );

    };
  }
};
