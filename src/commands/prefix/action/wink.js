const fetch = require('node-fetch');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'wink',
  description      : 'Wink at a user.',
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
  examples         : [ 'wink @user' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const res = await fetch(`https://api.tamako.tech/api/roleplay/wink`)
    .then(res => res.json())
    .catch(() => {});
    const blush = await fetch(`https://api.tamako.tech/api/roleplay/blush`)
    .then(blush => blush.json())
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
         return message.channel.send(embed.setDescription(`${message.author} winks!`));
      };
      if (members.size > 1){
        return message.channel.send(embed.setDescription(`${message.author} winks!`));
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
      return message.channel.send(embed.setImage(blush.url).setDescription(`${message.author} baka`));
    };
    if (member.id === message.author.id){
      return message.channel.send(embed.setDescription(`${message.author} wink!`));
    };
    return message.channel.send(
        embed.setDescription(`${message.author} winks at ${args[0]}!`)
    );
  }
};
