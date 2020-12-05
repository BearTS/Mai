const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'slap',
  aliases: [],
  guildOnly: true,
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Slap them friends!~',
  examples: [ 'slap @user' ],
  parameters: [ 'User Mention' ],
  run: async ( client, message, args ) => {

    // Filter out args so that args are only user-mention formats.
    args = args.filter(x => /<@!?\d{17,19}>/.test(x))

    const url = client.images.slap();
    const embed = new MessageEmbed()
    .setColor('GREY')
    .setImage(url)
    .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);

    if (!message.mentions.members.size){

      message.channel.send(`<:cancel:767062250279927818> | ${message.author}, what's the idea slapping nothingness? At least mention a user!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send([`Ouch! How dare you slap me!`,`Stop that!`,`It hurts!`][Math.floor(Math.random() * 3)]);

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`I'd happily oblige! But i think you need a mental check-up ${message.author}!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} has been slapped by${message.member}! That must been painful~`)
      );

    };
  }
};
