const fetch = require('node-fetch');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'baka',
  description      : 'Sends a roleplay gif `kill` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user who used this command wants to kill the mentioned user 」. Use to indicate that you are / wanted to kill the mentioned user (context may vary). This is a roleplay command and is meant to be used as a joke, however, this will be limited to a nsfw channel due to sensitive nature of this command. Context should not include real crimes.',
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
  examples         : [ 'kill @user' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const res = await fetch(`https://api.tamako.tech/api/roleplay/kill`)
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
      return message.channel.send(
        embed.setDescription(`Stop ${message.member}! You can't kill me!`)
      );
    };
    if (member.id === message.author.id){
      return message.channel.send(embed);
    };
    return message.channel.send(
        embed.setDescription(`${message.member} just killed ${args[0]}! Reviving in t-minus n seconds.`));
  }
};
