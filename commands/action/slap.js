const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'slap',
  aliases: [],
  clientPermissions: [
    'EMBED_LINKS',
    'ADD_REACTIONS'
  ],
  group: 'action',
  description: 'Sends a roleplay gif `slap` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been slapped 」. Use to indicate that you are / wanted to slap the mentioned user (context may vary).',
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

    if ((message.guild && !message.mentions.members.size) || !args[0]){

      message.channel.send(`\\❌ **${message.author.tag}**, what's the idea slapping nothingness? At least mention a user!`);

    } else if (new RegExp(`<@!?${client.user.id}>`).test(args[0])){

      return message.channel.send([`Ouch! How dare you slap me!`,`Stop that!`,`It hurts!`][Math.floor(Math.random() * 3)]);

    } else if (new RegExp(`<@!?${message.author.id}>`).test(args[0])){

      return message.channel.send(`\\❌ I'd happily oblige! But i think you need a mental check-up **${message.author.tag}**!`);

    } else {

      return message.channel.send(
        embed.setDescription(`${args[0]} has been slapped by${message.author}! That must been painful~`)
      );

    };
  }
};
