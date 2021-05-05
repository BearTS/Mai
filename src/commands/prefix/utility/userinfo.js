const { MessageEmbed, Permissions: { FLAGS }} = require('discord.js');

const moment = require('moment');

module.exports = {
  name             : 'userinfo',
  description      : 'Fetch User Information (As of May 20, 2020 - The global function has been removed due to a possible violation to Discord ToS).',
  aliases          : [ 'whois' ],
  cooldown         : { time: 1e4 },
  clientPermissions: [ FLAGS.EMBED_LINKS ],
  permissions      : [],
  group            : 'utility',
  guildOnly        : true,
  ownerOnly        : false,
  adminOnly        : false,
  nsfw             : false,
  requiresDatabase : false,
  rankcommand      : false,
  parameters       : [ 'User Mention/ID' ],
  examples         : [ 'userinfo @user', 'whois 75869504958675123' ],
  run              : async (message, language, [user = '']) => {

    const parameters = new language.Parameter({ '%USER%': user.tag });

    const id     = user.match(/\d{17,19}/)?.[0] || message.author.id;
    const member = await message.guild.members.fetch(id).catch(() => {});

    if (!member){
      return message.reply(language.get({ '$in': 'COMMANDS', id: '__ARGS_NOUSER', parameters }));
    };

    const { ARRAY } = message.client.services.UTIL;
    const DICT      = language.getDictionary([ 'username', 'type', 'bot', 'user', 'joined discord', 'joined server', 'roles' ]);
    const color     = member.displayColor || 0xe620a4;
    const flags     = await member.user.fetchFlags().then(f => Object.entries(f.serialize()).filter(([_,v]) => !!v).map(([x,_]) => x.split('_').map(y => y[0] + y.slice(1).toLowerCase()).join(' ')));
    const owner     = message.guild.ownerID === member.user.id;
    const roles     = member.roles.cache.filter(r => r.id !== message.guild.id).map(r => r.toString())
    const footer    = language.get({ '$in': 'COMMANDS', id: 'USERINFO_EFOOTE', parameters });

    const embed =  new MessageEmbed()
     .setColor(member.displayColor || 0xe620a4)
     .setAuthor(`Discord ${DICT.USER} ${member.user.tag}`, null, 'https://discord.com/')
     .setDescription(ARRAY.join([owner ? 'Server Owner' : '', ...flags].filter(Boolean)))
     .setThumbnail(member.user.displayAvatarURL({format: 'png', dynamic: true}))
     .setFooter(`${footer}\u2000|\u2000${message.client.user.username} Bot\u2000|\u2000©️${new Date().getFullYear()} Mai`)
     .addFields([
       { name: DICT.USERNAME                    , value: `**${member.user.username}**#${member.user.discriminator}`                                               , inline: true  },
       { name: DICT.TYPE                        , value: member.user.bot ? DICT.BOT : DICT.USER                                                                          , inline: true  },
       { name: DICT['JOINED DISCORD']           , value: moment(member.user.createdAt ).locale(message.author.profile?.data.language).format('dddd, Do MMMM YYYY'), inline: false },
       { name: DICT['JOINED SERVER']            , value: moment(member.joinedAt       ).locale(message.author.profile?.data.language).format('dddd, Do MMMM YYYY'), inline: false },
       { name: `${DICT.ROLES} [${roles.length}]`, value: ARRAY.joinAndLimit(roles, 1000, ' • ').text                                                              , inline: false }
     ]);

    return message.channel.send(embed);
  }
};
