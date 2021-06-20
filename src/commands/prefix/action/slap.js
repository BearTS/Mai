const fetch = require('node-fetch');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'slap',
  description      : 'Sends a roleplay gif `slap` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been slapped 」. Use to indicate that you are / wanted to slap the mentioned user (context may vary).',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS, FLAGS.ADD_REACTIONS ],
  permissions      : [],
  group            : 'action',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention' ],
  examples         : [ 'slap @user' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const res = await fetch(`https://api.tamako.tech/api/roleplay/slap`)
    .then(res => res.json())
    .catch(() => {});
    const embed = new MessageEmbed()
              .setColor('GREY')
              .setImage(res.url)
              .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);
    let   member;
    if (!args){
    };
    if (!args.join(' ').match(/\d{17,19}/)){
      const members = await message.guild.members.fetch({ query: args.join(' '), limit: 5 }).catch(err => {});
      if (!members.size){
         return message.channel.send(`\\❌ **${message.author.tag}**, what's the idea slapping nothingness? At least mention a user!`);
      };
      if (members.size > 1){
         return message.channel.send(`\\❌ **${message.author.tag}**, what's the idea slapping nothingness? At least mention a user!`);
      };
      member = members.first();
    };
    if (args.join(' ').match(/\d{17,19}/)){
      member = await message.guild.members.fetch(args.join(' ').match(/\d{17,19}/)[0]).catch(err => err);
      if (member instanceof Error){
        return message.channel.send("error")
      };
    };
    if (member.id === message.client.user.id){
      return message.channel.send([`Ouch! How dare you slap me!`,`Stop that!`,`It hurts!`][Math.floor(Math.random() * 3)]);
    };
    if (member.id === message.author.id){
     return message.channel.send(`\\❌ I'd happily oblige! But i think you need a mental check-up **${message.author.tag}**!`);
    };
    return message.channel.send(
        embed.setDescription(`${args[0]} has been slapped by${message.author}! That must been painful~`)
    );
  }
};
