const fetch = require('node-fetch');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'poke',
  description      : 'Sends a roleplay gif `poke` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The mentioned user ignores you, so you poke them 」. Use to indicate that you are in need of attention from the mentioned user (context may vary).',
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
  examples         : [ 'poke @user' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const res = await fetch(`https://api.tamako.tech/api/roleplay/poke`)
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
         return message.channel.send(`\\❌ **${message.author.tag}**, who am I supposed to poke?`);
      };
      if (members.size > 1){
         return message.channel.send(`\\❌ **${message.author.tag}**, who am I supposed to poke?`);
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
      return message.channel.send(
         embed.setDescription('I\'m already here! Need something?')
       );
    };
    if (member.id === message.author.id){
      return message.channel.send(`\\❌ No **${message.author.tag}**!`);
    };
    return message.channel.send(
        embed.setDescription(`${message.member} poked ${args[0]}`)
    );
  }
};
