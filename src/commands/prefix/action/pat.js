const fetch = require('node-fetch');
const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

module.exports = {
  name             : 'pat',
  description      : 'Sends a roleplay gif `pat` to the chat, directed towards the mentioned user, if there is any. Usually interpreted as 「 The user gave a headpat to the mentioned user 」. Use to indicate that you are / wanted to headpat the mentioned user (context may vary).',
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
  examples         : [ 'pat @user' ],
  run              : async (message, language, args) => {

    const parameters = new language.Parameter({ '%AUTHOR%': message.author.tag });
    const res = await fetch(`https://api.tamako.tech/api/roleplay/pat`)
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
         return message.channel.send(embed.setDescription(`Here you go ${message.author}, \*pat* \*pat*`));
      };
      if (members.size > 1){
         return message.channel.send(embed.setDescription(`Here you go ${message.author}, \*pat* \*pat*`));
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
      return message.channel.send(embed.setDescription('UwU <3! Thanks!'));
    };
    if (member.id === message.author.id){
      return message.channel.send(embed.setDescription(`Here you go ${message.author}, \*pat* \*pat*`));
    };
    return message.channel.send(
        embed.setDescription(`${message.member} pats ${args[0]}!`)
    );
  }
};
