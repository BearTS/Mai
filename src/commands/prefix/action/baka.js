const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');
const fetch                                   = require('node-fetch');

module.exports = {
  name             : 'baka',
  description      : 'Baka',
  aliases          : [],
  cooldown         : null,
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'action',
  guildOnly        : false,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention / ID' ],
  examples         : [ 'baka', 'baka @user', 'baka 728394' ],
  run              : async (message, language, [ user = '' ], args) => {

    const id     = user.match(/\d{17,19}/)?.[0] || message.author.id;
    const member = await message.guild?.members.fetch(id).catch(() => {}) || message?.member;
    const parameters = new language.Parameter({
      '%USER%'  : user.tag,
      '%AUTHOR%': message.author.tag
    });
    const notbaka = language.get({ '$in': 'COMMANDS', id: 'BAKA_NOT', parameters });
    const desc   = language.get({ '$in': 'COMMANDS', id: 'BAKA_EDESCRP', parameters });
    const data = await fetch(`https://api.tamako.tech/api/roleplay/baka`)
   .then(res => res.json())
   .catch(()=>null);
    const embed = new MessageEmbed()
      .setColor('GREY')
      .setImage(data.url)
      .setFooter(`Action Commands | \©️${new Date().getFullYear()} Mai`);
        if (member.id === message.client.user.id){
        return message.react('💢');
      };
      if (member.id === message.author.id){
        return message.channel.send(notbaka)
      };
      if (message.guild && !message.mentions.members.size){
        return message.channel.send(embed);
      };
          return message.channel.send(
          embed.setDescription(desc)
        );
    }
  };
