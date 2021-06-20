const fetch = require('node-fetch');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'feed',
  description      : 'Sends a roleplay gif `feed` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user whom this command is directed to has been fed 」. Use to indicate that you are / wanted to feed the user.',
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
  examples         : [ 'feed @user' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const res = await fetch(`https://api.tamako.tech/api/roleplay/feed`)
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
         return message.channel.send(embed);
      };
      if (members.size > 1){
         return message.channel.send(embed);
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
       return message.channel.send(embed.setDescription('*Nom Nom Nom* Arigatoo~'));
    };
    if (member.id === message.author.id){
      return message.channel.send(embed);
    };
    return message.channel.send(
        embed.setDescription(`${message.author} feeds ${args[0]}!`));
  }
};
