const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'midfing',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  nsfw: true,
  description: 'Use this to throw someone off. No seriously, it\'s a joke!',
  examples: [ '' ],
  parameters: [],
  run: async ( client, message, args ) => {

    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const midfing = client.images.midfing();
    const baka = client.images.baka();

    const embed = new MessageEmbed()
    .setColor('GREY')
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      message.channel.send(embed.setImage(midfing));

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(baka).setDescription(message.author.toString()));

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(embed.setImage(midfing));

    } else {

      return message.channel.send(
        embed.setDescription(`${message.member.displayName}: "Hey ${args[0]}!"`)
      );

    };
  }
};
